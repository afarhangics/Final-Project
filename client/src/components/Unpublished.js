import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import { GlobalStoreContext } from '../store/index.js'
import Statusbar from './Statusbar'


function Unpublished(props) {
    const { idNamePair, handleDeleteList, index, page } = props;
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    const keydownHandler = (e) => {
        if(e.key==='y' && e.ctrlKey && store.canRedo()) handleRedo();
        if(e.key==='z' && e.ctrlKey && store.canUndo()) handleUndo();
    };

    // USE THIS USE EFFECT BOTH AS COMPONENTDIDMOUNT AND COMPONENTWILLUNMOUNT
    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
          };
    }, []);


    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handlePublish() {
        store.publishCurrentList(idNamePair);
    }

    
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
  
    return (
        <>
             <Box sx={{display:'block',  bgcolor: 'transparent', borderRadius:'10px'}}>
                    <List  sx={{ width: '100%', bgcolor: 'transparent' }} id="playlist-cards">
                        {idNamePair.songs.map((song, index) => (
                            <SongCard
                                id={'playlist-song-' + (index)}
                                key={'playlist-song-' + (index)}
                                index={index}
                                song={song}
                            />
                        ))}
                        <ListItem sx={{ width: '100%', bgcolor: '#2c2f70', 
                                color: '#ffffff', fontWeight:'bold', fontSize:'1.2em', height:'50px', borderRadius:'10px' }}
                                
                            >
                                <IconButton 
                                    style={{background:'transparent', color:'#ffffff', marginInline:'auto'}}
                                    aria-label="add"
                                    id="add-list-button"
                                    disabled={!store.canAddNewSong()}
                                    onClick={handleAddNewSong}
                                >
                                    <AddIcon fontSize='large' />                                    
                                </IconButton>
                        </ListItem>
                    </List>
                    { modalJSX }
            </Box>
           
            <br/>
            <Box>
                <Grid container sx={{width: '100%', display:'flex', flexDirection:'row' }} spacing={3} >
                    <Grid item xs={'auto'} md={4} >
                            <Grid container sx={{width: '100%', display:'flex', flexDirection:'row' }} spacing={1} >
                                <Grid item xs={'auto'} md={6} >
                                    <Button  disabled={!store.canUndo()}
                                             onClick={handleUndo} aria-label='undo' 
                                             style={{color:'black', textTransform:'none', paddingLeft:'5px', paddingRight:'5px', background:'#dddddd', border:'1px solid #000000', borderRadius:'8px', fontWeight:'1.2em', height:'23px'}}>
                                                Undo 
                                    </Button>
                                </Grid>
                                <Grid item xs={'auto'} md={6} >
                                    <Button  disabled={!store.canRedo()}
                                            onClick={handleRedo} aria-label='redo'
                                            style={{color:'black', textTransform:'none', paddingLeft:'5px', paddingRight:'5px', background:'#dddddd', border:'1px solid #000000', borderRadius:'8px', fontWeight:'1.2em', height:'23px'}}>
                                                Redo  
                                    </Button>
                                </Grid>
                            </Grid>
                    </Grid>
                    <Grid item xs={'auto'} md={1} ></Grid>
                    <Grid item xs={'auto'} md={7} >
                            <Grid container sx={{display:'flex', flexDirection:'row' }} spacing={0} >
                                <Grid item xs={'auto'} md={4} >
                                    <Button  onClick={handlePublish} aria-label='publish' style={{color:'black', textTransform:'none', paddingLeft:'15px', paddingRight:'15px', background:'#dddddd', border:'1px solid #000000', borderRadius:'8px', fontWeight:'1.2em', height:'23px'}}>
                                                Publish 
                                    </Button>
                                </Grid>
                                <Grid item xs={'auto'} md={4} >
                                    <Button  onClick={(e)=>handleDeleteList(e, idNamePair._id)} aria-label='duplicate' style={{color:'black', textTransform:'none', paddingLeft:'15px', paddingRight:'15px', background:'#dddddd', border:'1px solid #000000', borderRadius:'8px', fontWeight:'1.2em', height:'23px'}}>
                                                Delete  
                                    </Button>
                                </Grid>
                                <Grid item xs={'auto'} md={4} >
                                    <Button  onClick={(e)=>{
                                        e.stopPropagation();
                                        store.duplicatePlaylist(index, idNamePair, page);
                                        }} 
                                        aria-label='delete'style={{color:'black', textTransform:'none', paddingLeft:'15px', paddingRight:'15px', background:'#dddddd', border:'1px solid #000000', borderRadius:'8px', fontWeight:'1.2em', height:'23px'}}>
                                            Duplicate  
                                    </Button>
                                </Grid>
                            </Grid>
                    </Grid>
                </Grid>
            </Box>
            <br/>
        </>
    );
}

export default Unpublished;