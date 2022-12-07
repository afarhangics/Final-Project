import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import HomeBanner from './HomeBanner';
import AddIcon from '@mui/icons-material/AddOutlined';
import Fab from '@mui/material/Fab'
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import YouTubePlayer from './YouTubePlayer';
import Comments from './Comments';
import { IconButton } from '@mui/material';
import AuthContext from '../auth';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [namePairs, setNamePairs] = useState([])
    const [currentPlaylist, setCurrentPlaylist] = useState(null)
    const [tab, setTab] = useState('player');
    const [currentSong, setCurrentSong] = useState(null)
    const [shouldLoadNewSong, setShouldLoadNewSong] = useState(false)
    const [current, setCurrent] = useState("");
    const [listenId, setListenId] = useState("");
    const [page, setPage] = useState('all-list');
    const [searchTerm, setSearchTerm] = useState('');
    const [idToEdit, setIdToEdit] = useState('')

    useEffect(() => {
        if(auth.isGuest)
          setPage('all-list')
        else if(auth.loggedIn)
            setPage('home')
    }, []);

    useEffect(() => {
        if(page === 'home')
        {
            store.loadIdNamePairs();
        } else if(page === 'all-list'){
            store.loadPublished();
        }
        else if(page === 'users'){
            store.resetPlaylists();
        }
    }, [page]);

    function incrementPlaylistListen(){
        if(current.length > 0 && current !== listenId){
            store.incrementPlaylistListen(current);
            setListenId(current);
        }
    }

    useEffect(() => {
        setNamePairs(store.idNamePairs);
        console.log('setNamePairs(store.idNamePairs);')
        console.log(store.idNamePairs);
    }, [store.idNamePairs]);

    async function handleCreateNewList() {
        const nId = await store.createNewList();
        setIdToEdit(nId);
    }
    
    return (
        <>
            <HomeBanner page={page} setPage={setPage} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <br/>
            <div id="playlist-selector">
                    <Grid container sx={{background:'#c4c4c4'}}>
                        <Grid item xs={'auto'} md={7}>


                        <div id="list-selector-list">
                        {namePairs.length > 0 ? 
                            <List sx={{ width: '90%', left: '5%', bgcolor: 'transparent' }}>
                            {
                                namePairs.map((pair, index) => (
                                    <ListCard
                                        index={index}
                                        page={page}
                                        key={pair._id}
                                        idNamePair={pair}
                                        selected={false}
                                        currentSong={currentSong}
                                        setShouldLoadNewSong={setShouldLoadNewSong}
                                        setCurrentSong={setCurrentSong}
                                        setCurrentPlaylist={setCurrentPlaylist}
                                        current={current}
                                        idToEdit={idToEdit}
                                        setIdToEdit={setIdToEdit}
                                        setCurrent={setCurrent}
                                    />
                                ))
                            }
                            </List>
                            : ''}
                        </div>

                            <div id="list-selector-heading" >
                                {page === 'home' ? 
                                    <IconButton 
                                        style={{background:'transparent', color:'black'}}
                                        aria-label="add"
                                        id="add-list-button"
                                        disabled={idToEdit !== ''}
                                        onClick={handleCreateNewList}
                                    >
                                        <AddIcon fontSize='large'/> <b sx={{fontWeight:'bold'}}>Your Lists</b>                                   
                                    </IconButton>
                            : ''}
                                {page === 'all-list' ? 
                                    <span 
                                        style={{background:'transparent', color:'black'}}
                                    >
                                          <b> {searchTerm === '' ? 'Other Users\' ' : searchTerm} Playlists</b>                                   
                                    </span>
                            : ''}
                                {page === 'users' ?
                                <span 
                                    style={{background:'transparent', color:'black'}}
                                >
                                    <b sx={{fontWeight:'bold'}}>{searchTerm === '' ? 'Search Lists' : searchTerm + ' ' + 'Lists'} </b>                                   
                                </span>
                            
                            : ''}
                                
                                
                            </div>
                        </Grid>
                        <Grid item xs={'auto'} md={5}>
                            <ButtonGroup variant="outlined" aria-label="outlined button group">
                                <Button onClick={()=>setTab('player')} style={{background: `${tab === 'player' ? '#FFFFFF' : '#CCCCCC'}`, textTransform:'none', fontWeight:'bold', color:'black', borderColor:'#333333', borderTopLeftRadius:'7px', borderTopRightRadius:'7px'}}>Player</Button>
                                <Button onClick={()=>setTab('comments')} style={{background: `${tab === 'comments' ? '#FFFFFF' : '#CCCCCC'}`, textTransform:'none', fontWeight:'bold', color:'black', borderColor:'#333333', borderTopLeftRadius:'7px', borderTopRightRadius:'7px'}}>Comments</Button>
                            </ButtonGroup>
                            {tab === 'comments' ? 

                                <Comments 
                                    currentSong={currentSong} 
                                    playlist={currentPlaylist && currentPlaylist.songs || []}
                                /> : ''}
                               
                                <div style={{display:`${tab === 'player' ? 'block' : 'none'}`}}> 
                                    <YouTubePlayer 
                                        key={current + String(current)}
                                        currentPlaylist={currentPlaylist}
                                        incrementPlaylistListen={incrementPlaylistListen}
                                        shouldLoadNewSong={shouldLoadNewSong} setShouldLoadNewSong={setShouldLoadNewSong}
                                        setCurrentSong={setCurrentSong} currentSong={currentSong}
                                        playlist={currentPlaylist && currentPlaylist.songs || []} 
                                        title={currentPlaylist && currentPlaylist.name || ''}
                                        currentPlaylistId={currentPlaylist && currentPlaylist._id || ''}
                                    /> 
                                </div>                           

                        </Grid>
                    </Grid>

                    <MUIDeleteModal />
        </div>
        </>
        )
}

export default HomeScreen;