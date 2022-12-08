import { useContext } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'


function Published(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const { idNamePair, currentSong, setCurrentSong, 
        setShouldLoadNewSong, handleDeleteList, index, page } = props;
  
    return (
        <>
             <Box sx={{display:'block',  bgcolor: '#2c2f70', borderRadius:'10px'}}>
                    <List  sx={{ width: '95%', bgcolor: 'transparent' }}>
                        {idNamePair.songs.map((song, ind) => (
                            <ListItem key={ind} sx={{ width: '95%', bgcolor: 'transparent', 
                                color: `${currentSong === ind ? '#cb7d39' : '#d4af37'}`, fontWeight:'bold', fontSize:'1.2em' }}
                                onClick={(e)=>{ 
                                    e.stopPropagation();
                                    setCurrentSong(ind);
                                    setShouldLoadNewSong(true);
                                }}
                            >
                                {ind + 1}. <Typography sx={{ marginLeft:'10px',color: `${currentSong === ind ? '#cb7d39' : '#d4af37'}`, fontWeight:'bold', }}> {song.title} </Typography>
                            </ListItem>
                        ))}
                    </List>
            </Box>
           
            <br/>
            <Box sx={{float:'right', paddingRight:'8px'}}>
                <Grid container sx={{width: '100%', display:'flex', flexDirection:'row' }} spacing={1} >
                    <Grid item xs={'auto'} md={6} >
                        {auth.user.email === idNamePair.ownerEmail ? 
                            <Button  onClick={(e)=>handleDeleteList(e, idNamePair._id)} aria-label='delete'style={{color:'black', textTransform:'none', paddingLeft:'15px', paddingRight:'15px', background:'#dddddd', border:'1px solid #000000', borderRadius:'8px', fontWeight:'1.2em', height:'23px'}}>
                                Delete  
                            </Button>
                        : ''}
                        
                    </Grid>
                    <Grid item xs={'auto'} md={6} >
                        {auth.isGuest ? '' : 
                            <Button  onClick={(e)=>{
                                            e.stopPropagation();
                                            store.duplicatePlaylist(index, idNamePair, page);
                                            }}
                                            aria-label='delete'style={{color:'black', textTransform:'none', paddingLeft:'15px', paddingRight:'15px', background:'#dddddd', border:'1px solid #000000', borderRadius:'8px', fontWeight:'1.2em', height:'23px'}}>
                                    Duplicate  
                            </Button>
                        }
                        
                    </Grid>
                </Grid>
            </Box>
            <br/>
        </>
    );
}

export default Published;