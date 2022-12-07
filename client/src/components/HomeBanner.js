import { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store';
import EditToolbar from './EditToolbar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';


export default function HomeBanner({page, setPage, searchTerm, setSearchTerm}) {

    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
       setAnchorEl(null);
    };

    function handleSortBy(sortBy){
        store.sortBy(sortBy);
        handleMenuClose();
    };

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if (searchTerm.length > 0){
                console.log('searchTerm enter pressed', searchTerm)
                if(page === 'users')
                    store.searchPlaylistsByUsers(searchTerm);
                else if(page === 'all-list')
                    store.searchPlaylists(searchTerm);
                //setSearchTerm('')
            }
        }
    }

    const menuId = 'playlist-sort-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <List>
                <MenuItem onClick={()=>handleSortBy(1)}><ListItem>Name (A - Z)</ListItem></MenuItem>
                <MenuItem onClick={()=>handleSortBy(2)}><ListItem>Publish Date(Newest)</ListItem></MenuItem>
                <MenuItem onClick={()=>handleSortBy(3)}><ListItem>Listens (High - Low)</ListItem></MenuItem>
                <MenuItem onClick={()=>handleSortBy(4)}><ListItem>Likes Date(High - Low)</ListItem></MenuItem>
                <MenuItem onClick={()=>handleSortBy(5)}><ListItem>Dislikes (High - Low)</ListItem></MenuItem>
            </List>
        </Menu>
    );
  
    const menu = loggedOutMenu;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static' sx={{backgroundColor:'#cfcfcf', boxShadow:'none'}}>
                <Toolbar>
                       <IconButton size='large' onClick={()=>setPage('home')} disabled={auth.isGuest}><HomeOutlinedIcon fontSize='large' className={`${page === 'home' ? 'menuIconActive' : ''}`}/></IconButton>
                       <IconButton size='large' onClick={()=>setPage('all-list')} ><GroupsOutlinedIcon fontSize='large' className={`${page === 'all-list' ? 'menuIconActive' : ''}`}/></IconButton>
                       <IconButton size='large' onClick={()=>setPage('users')} ><PersonOutlineOutlinedIcon fontSize='large' className={`${page === 'users' ? 'menuIconActive' : ''}`}/></IconButton>
                    
                       <Box sx={{ flexGrow: 1, marginLeft:'5%' }}>
                            <input onChange={(e)=>{
                                                if(page === 'home'){
                                                    setPage('all-list');
                                                }
                                                setSearchTerm(e.target.value);
                                            }} 
                                    value={searchTerm} 
                                    placeholder='Search' 
                                    style={{background:'#FFFFFF', width:'500px', borderRadius:'4px', 
                                            height:'30px', padding: '5px', paddingLeft: '10px'}}
                                    onKeyPress={handleKeyPress}
                             />
                        </Box> 
                    
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            style={{display: 'block', color:'#333333', fontWeight: 'bolder'}}
                            edge='end'
                            aria-label='account of current user'
                            aria-controls={menuId}
                            aria-haspopup='true'
                            onClick={handleProfileMenuOpen}
                            color='inherit'
                        >
                          <Box>SORT BY <SortOutlinedIcon fontSize='large'/></Box> 
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}