import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import Published from './Published';
import Unpublished from './Unpublished';

const months = ['Jan','Feb','Mar','Apr','May','Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'];

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected, index, setCurrentPlaylist, currentSong, setCurrentSong, 
        setShouldLoadNewSong, current, setCurrent, page, idToEdit, setIdToEdit } = props;
        const [editActive, setEditActive] = useState(false);

    function handleLoadList(event, id, playlist) {
       // event.stopPropagation();
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {            
            if (event.detail === 1) {
                store.setCurrentList(id);
                setCurrentPlaylist(playlist);
                setCurrent(id);
                setCurrentSong(null);
            }

            if (event.detail === 2) {
                handleToggleEdit(event);
            }
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    useEffect(()=>{
        if(idToEdit === idNamePair._id){
            console.log("OPASSSAPOSSSSS")
            toggleEdit();
        }
    },[idToEdit])

    function toggleEdit() {
        let newActive = !editActive;
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
            setIdToEdit('')
        }
    }

    
    function abbreviateNumber(number){
        const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

        // what tier? (determines SI symbol)
        const tier = Math.log10(Math.abs(number)) / 3 | 0;

        // if zero, we don't need a suffix
        if(tier == 0) return number;

        // get suffix and determine scale
        const suffix = SI_SYMBOL[tier];
        const scale = Math.pow(10, tier * 3);

        // scale the number
        const scaled = number / scale;

        // format number and add suffix
        return scaled.toFixed(1) + suffix;
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', width: '100%', borderRadius:'10px',
                    background: `${!idNamePair.published ? '#ffffff' : '#d4d4f5'}`,                     
                    cursor:'pointer' }}
            className={`${current === idNamePair._id ? 'listActive' : ''}`}
            onClick={(event) => {
                event.stopPropagation();
                handleLoadList(event, idNamePair._id, idNamePair)
            }}
        >
                        <Box sx={{flexGrow: 1}}>
                            <Grid container sx={{width: '100%', }} spacing={3}>
                                <Grid item xs={'auto'} md={7} >
                                    <Typography sx={{ fontSize:'12pt', fontWeight:'bold', color:'#000000', lineHeight:'30px'}}>{idNamePair.name}</Typography>
                                    <Typography sx={{ fontSize:'8pt', fontWeight:'bold', color:'#000000', lineHeight:'30px'}}>By: <b style={{color:'blue', textDecoration:'underline'}}>{idNamePair?.user?.firstName} {idNamePair?.user?.lastName}</b></Typography>
                                </Grid>
                                <Grid item xs={'auto'} md={5} >
                                    {idNamePair.published ? 
                                    <Box sx={{flexGrow: 1, display:'flex', flexDirection:'row', gap:'20px'}}>
                                        <IconButton aria-label='delete' onClick={(e)=>{
                                            e.stopPropagation();
                                            store.postLike(idNamePair);
                                        }}
                                            style={{background:'transparent', color:'black'}}>
                                            <ThumbUpOffAltIcon /> <Typography sx={{ marginLeft:'10px', fontSize:'12pt', fontWeight:'bold', color:'#000000'}}>{abbreviateNumber(idNamePair.likes.length)}</Typography> 
                                        </IconButton>
                                        <IconButton  aria-label='delete' onClick={(e)=>{
                                                e.stopPropagation();
                                                store.postDisLike(idNamePair)}}
                                            style={{background:'transparent', color:'black'}}>
                                            <ThumbDownOffAltIcon /> <Typography sx={{marginLeft:'10px',  fontSize:'12pt', fontWeight:'bold', color:'#000000'}}>{abbreviateNumber(idNamePair.dislikes.length)}</Typography> 
                                        </IconButton>
                                    </Box> : '' }                                    
                               </Grid>
                            </Grid>
                            <br/>
                            {open ? 
                                <>
                                    {idNamePair.published ?
                                        <Published 
                                            key={current + String(current)}
                                            idNamePair={idNamePair} 
                                            page={page}
                                            index={index}
                                            currentSong={currentSong}
                                            setCurrentSong={setCurrentSong} 
                                            setShouldLoadNewSong={setShouldLoadNewSong}
                                            handleDeleteList={handleDeleteList}
                                        /> : 
                                        <Unpublished
                                            key={current + String(current)}
                                            page={page}
                                            index={index}
                                            idNamePair={idNamePair} 
                                            handleDeleteList={handleDeleteList}
                                            setCurrentSong={setCurrentSong} 
                                            setShouldLoadNewSong={setShouldLoadNewSong}
                                        />
                                    }
                                </> 
                            : ''}
                            
                            <Grid container sx={{width: '100%', }} spacing={3}>
                                <Grid item xs={'auto'} md={7} >
                                {idNamePair.published ? 
                                    <Typography sx={{ fontSize:'8pt', fontWeight:'bold', color:'#000000'}}>Published: 
                                    <b style={{color:'#43d51e'}}>

                                    {months[new Date(idNamePair?.publishedDate).getMonth()]} 
                                    {' '}{new Date(idNamePair?.publishedDate).getDate()},
                                    {' '}{new Date(idNamePair?.publishedDate).getFullYear()}
                                    
                                    </b></Typography>
                                : ''}                
                                </Grid>
                                <Grid item xs={'auto'} md={5} >
                                    {idNamePair.published ? 
                                        <Box sx={{flexGrow: 1, display:'flex', flexDirection:'row', gap:'40px'}}>
                                            <Typography sx={{ fontSize:'8pt', fontWeight:'bold', color:'#000000'}}>Listens: <b style={{color:'#b02b28'}}>{(idNamePair.listens).toLocaleString('en-US')}</b></Typography>
                                            <IconButton  disabled={store.currentList === null || (store.currentList !== null && store.currentList._id !== idNamePair._id)}
                                                onClick={(e)=>{
                                                    e.stopPropagation();
                                                    setOpen(!open)
                                                }} aria-label='delete'style={{background:'transparent', color:'black', marginTop:'-15px' }}>
                                                {open ? <KeyboardDoubleArrowUpIcon fontSize='large' sx={{color:'#000000'}} /> : <KeyboardDoubleArrowDownIcon fontSize='large' sx={{color:'#000000'}} 
                                                /> }    
                                            </IconButton>
                                        </Box>
                                    : 
                                    <Box sx={{flexGrow: 1}}> <IconButton  disabled={store.currentList === null || (store.currentList !== null && store.currentList._id !== idNamePair._id)}
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                setOpen(!open)
                                            }} aria-label='delete'style={{background:'transparent', color:'black', marginTop:'-25px', marginLeft:'89px' }}>
                                            {open ? <KeyboardDoubleArrowUpIcon fontSize='large' sx={{color:'#000000'}} /> : <KeyboardDoubleArrowDownIcon fontSize='large' sx={{color:'#000000'}} 
                                            /> }    
                                        </IconButton>
                                    </Box>
                                    } 
                                    
                                </Grid>
                            </Grid>
                            
                        </Box>
            
        </ListItem>

    if (((editActive && !idNamePair.published) || (idToEdit === idNamePair._id)) ) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                sx={{background:'#eeeeee'}}
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 32}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;