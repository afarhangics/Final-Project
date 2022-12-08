import { useContext } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AuthContext from '../auth'

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    
    return (
        <Box style={{ alignItems:'center', textAlign:'center', background:'#cfcfcf', paddingTop:'50px', paddingBottom:'100px'}}>
            <Typography variant='h3' id='splash-screen-r'>
                Welcome to Playlister
            </Typography>
            <Typography variant='h6' id='splash-screen-welcome'>
                Playlister, an application for creating and playing playlists of YouTube music videos. You can create, edit and play plylists as well as share playlists with others.
            </Typography>

            <Button onClick={()=>auth.guestLogIn()} 
                style={{ textDecoration: 'none', cursor:'pointer', textTransform: 'none', fontWeight:'bold', 
                fontSize: '20px', color: '#FFFFFF', backgroundColor:'#1976d5', marginTop:'50px', 
                padding: '15px', width:'350px'}}>
                continue as Guest
            </Button>


            <Typography
                style={{ textDecoration: 'none', cursor:'pointer', textTransform: 'none',  
                fontSize: '20px', marginTop:'80px', marginLeft:'32%',
                padding: '15px', width:'350px'}}>
                Designed By Alireza Farhangi
            </Typography>
        </Box>
        
    )
}