import { useContext, useState, useEffect } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIEditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    const [ title, setTitle ] = useState(store.currentSong.title);
    const [ artist, setArtist ] = useState(store.currentSong.artist);
    const [ done, setDone ] = useState(false);
    const [ youTubeId, setYouTubeId ] = useState(store.currentSong.youTubeId);

    useEffect(()=>{
        if(done){
            store.hideModals();
        }
    },[done])

    function handleConfirmEditSong() {
        let newSongData = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        store.addUpdateSongTransaction(store.currentSongIndex, newSongData);        
    }

    function handleCancelEditSong(event) {
        event.stopPropagation();
        setDone(true);
    }

    function handleUpdateTitle(event) {
        event.stopPropagation();
        setTitle(event.target.value);
    }

    function handleUpdateArtist(event) {
        event.stopPropagation();
        setArtist(event.target.value);
    }

    function handleUpdateYouTubeId(event) {
        event.stopPropagation();
        setYouTubeId(event.target.value);
    }

    return (
        <Modal
            open={store.isEditSongModalOpen()}
        >
            <Box sx={style}>
            <div
                id="edit-song-modal"
                className="modal is-visible"
                data-animation="slideInOutLeft">
            <div
                id='edit-song-root'
                className="modal-dialog">
                <div
                    id="edit-song-modal-header"
                    className="dialog-header">Edit Song</div>
                <div
                    id="edit-song-modal-content"
                    className="modal-center">
                    <Grid container spacing={0} sx={{marginBottom:'10px'}}>
                        <Grid item xs={'auto'} md={4}>
                            <div id="title-prompt" className="modal-prompt">Title:</div>
                        </Grid>
                        <Grid item xs={'auto'} md={8}>
                            <input 
                            id="edit-song-modal-title-textfield" 
                            className='modal-textfield' 
                            type="text" 
                            value={title} 
                            onChange={handleUpdateTitle} />
                        </Grid>
                    </Grid>
                    
                    <Grid container spacing={0} sx={{marginBottom:'10px'}}>
                        <Grid item xs={'auto'} md={4}>
                            <div id="title-prompt" className="modal-prompt">Artist:</div>
                        </Grid>
                        <Grid item xs={'auto'} md={8}>
                            <input 
                            id="edit-song-modal-artist-textfield" 
                            className='modal-textfield' 
                            type="text" 
                            value={artist} 
                            onChange={handleUpdateArtist} />
                        </Grid>
                    </Grid>

                    <Grid container spacing={0} sx={{marginBottom:'10px'}}>
                        <Grid item xs={'auto'} md={4}>
                            <div id="title-prompt" className="modal-prompt">YouTubeId:</div>
                        </Grid>
                        <Grid item xs={'auto'} md={8}>
                            <input 
                            id="edit-song-modal-youTubeId-textfield" 
                            className='modal-textfield' 
                            type="text" 
                            value={youTubeId} 
                            onChange={handleUpdateYouTubeId} />
                        </Grid>
                    </Grid>
                </div>

                <Grid container spacing={0} sx={{marginBottom:'10px'}}>
                        <Grid item xs={'auto'} md={4}>
                        </Grid>
                        <Grid item xs={'auto'} md={8}>
                            <div className="modal-south">
                                <input 
                                    type="button" 
                                    id="edit-song-confirm-button" 
                                    className="modal-button" 
                                    value='Confirm' 
                                    onClick={handleConfirmEditSong} />
                                <input 
                                    type="button" 
                                    id="edit-song-cancel-button" 
                                    className="modal-button" 
                                    style={{marginLeft:'20px'}}
                                    value='Cancel' 
                                    onClick={handleCancelEditSong} />
                            </div>
                        </Grid>
                </Grid>

            </div>
        </div>
            </Box>
        </Modal>
    );
}