import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

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

export default function MUIRemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleConfirmRemoveSong (event) {
        event.stopPropagation();
        store.addRemoveSongTransaction();
    }

    function handleCancelRemoveSong (event) {
        event.stopPropagation();
        store.hideModals();
    }
    
    let modalClass = "modal";
    if (store.isRemoveSongModalOpen()) {
        modalClass += " is-visible";
    }
    let songTitle = "";
    if (store.currentSong) {
        songTitle = store.currentSong.title;
    }

    return (
        <Modal
            open={store.isRemoveSongModalOpen()}
        >
            <Box sx={style}>
            <div
                id="remove-song-modal"
                className={modalClass}
                data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-remove-song-root'>
                    <div className="modal-north dialog-header">
                        Remove Song?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you want to remove "{songTitle}" from the playlist?
                        </div>
                    </div>
                    <div className="modal-south" style={{marginLeft:'20%'}}>
                        <input type="button" 
                            id="remove-song-confirm-button" 
                            className="modal-button" 
                            onClick={handleConfirmRemoveSong} 
                            value='Confirm' />
                        <input 
                            type="button" 
                            id="remove-song-cancel-button" 
                            className="modal-button" 
                            style={{marginLeft:'20px'}}
                            onClick={handleCancelRemoveSong} 
                            value='Cancel' />
                    </div>
                </div>
            </div>
            </Box>
        </Modal>
    );
}