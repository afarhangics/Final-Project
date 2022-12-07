import React, { useContext, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';

export default function Comments({currentSong, playlist}) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(()=>{
        if(currentSong !== null && playlist.length > 0){
            console.log('playlist[currentSong].comments', playlist[currentSong].comments)
            setComments(playlist[currentSong].comments);
        }
    },[currentSong, playlist]);

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if (comment.length > 0){
                console.log('comment enter pressed', comment)
                store.postComment(currentSong, comment);
                setComment('')
            }
        }
    }


    return (
        <Box id='song_comments_container'>
            <div id="comments_section">
                {comments.map((comm, index) => (
                    <Typography key={index} sx={{padding:'10px', background:'#d4af37', fontSize:'12px', borderRadius:'8px', 
                    width: '350px', borderWidth:'2px', borderColor:'#0a3158', borderStyle:'solid' }}>
                        <b style={{fontSize:'10px', color:'#6565f9'}}>{comm.authorName}</b><br/>
                        {comm.comment}
                    </Typography>
                ))}
            </div>
            
            <div id="textarea_section">
                <input
                    style={{background:'#ffffff', padding:'10px', fontSize:'12px',fontWeight:'bold', borderRadius:'10px', width:'370px',
                            borderWidth:'1px', borderColor:'transparent', borderStyle:'solid'}}
                    placeholder='Add Comment'
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={ auth.isGuest || store.currentList === null || currentSong === null}
                    />
            </div>    
        </Box>
    );
}