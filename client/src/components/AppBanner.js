import { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import EditToolbar from './EditToolbar'
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import logo from '../assets/playlister.PNG'

export default function AppBanner() {
    const history = useHistory();
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const navHome = () => {
        handleMenuClose();
        store.closeCurrentList();
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const menuId = 'primary-search-account-menu';
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
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = 
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
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    let editToolbar = <div></div>;
    let menu = loggedOutMenu;
    if (auth.loggedIn || auth.isGuest) {
        menu = loggedInMenu;
    }
    
    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        console.log("userInitials: " + userInitials);
        if (loggedIn) 
            return <div style={{color:'#000000', borderColor:'#000000', borderStyle:'solid', padding:'2px', borderRadius:'50%',width:'40px', height:'30px', background:'#d236df'}}>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{backgroundColor:'#e0e0e0'}}>
                <Toolbar>
                    <Typography                        
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}                        
                    >
                       
                        <Button style={{backgroundColor:'#e0e0e0' }} 
                        onClick={navHome} variant="contained"><img src={logo} alt='Logo'/></Button>
                    </Typography>
                    {(auth.loggedIn || auth.isGuest) ? <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box> : ''}
                    
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                       {(auth.loggedIn || auth.isGuest) ? <IconButton
                            style={{display: "block"}}
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            { getAccountMenu(auth.loggedIn || auth.isGuest) }
                        </IconButton>
                         : <Grid container spacing={15} style={{marginLeft:'50%'}}>
                            <Grid item xs={'auto'} md={6} >
                                <Button onClick={()=>history.push('/login')} style={{ textDecoration: 'none', cursor:'pointer', textTransform: 'none', fontWeight:'bold',
                                                    borderWidth: '1px',  borderColor: '#666666', borderRadius: '5px', borderStyle: 'solid', width:'100px',
                                                    fontSize: '18px', color: '#333333', backgroundColor:'transparent', marginTop:'10px', padding: '5px'}}>
                                        Login
                                </Button>

                            </Grid>
                            <Grid item xs={'auto'} md={6} >
                                <Button onClick={()=>history.push('/register')} style={{ textDecoration: 'none', cursor:'pointer', textTransform: 'none', fontWeight:'bold',
                                                borderWidth: '1px', width:'200px', borderColor: '#666666', borderRadius: '5px', borderStyle: 'solid', fontSize: '18px', color: '#333333', backgroundColor:'transparent', marginTop:'10px', padding: '5px'}}>
                                    Create Account
                                </Button>

                            </Grid>
                            </Grid>} 
                        
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}