import React from 'react';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import StopIcon from '@mui/icons-material/Stop';
import Grid from '@mui/material/Grid';

class YouTubePlayer extends React.PureComponent {
    state = {
        player: null,
        playerState: 0,
        notPlayedYet: true,        
    }
    PLAYER_NAME='youtube_player';

    componentDidUpdate(prevProps, prevState){

        if(this.props.playlist.length !== 0 && this.props.playlist !== prevProps.playlist){
          this.setUpYoutubeFrame(); 
        }
        
        if(this.props.shouldLoadNewSong && this.props.currentSong !== prevProps.currentSong)
        {
          this.loadAndPlayCurrentSong();
          this.props.setShouldLoadNewSong(false);
        }
        if(this.props.shouldLoadNewSong && this.props.currentSong !== prevProps.currentSong)
        {
          this.loadAndPlayCurrentSong();
          this.props.setShouldLoadNewSong(false);
        }
    }

    componentDidMount = () => {
      // On mount, check to see if the API script is already loaded
      this.setUpYoutubeFrame();    
    };

  setUpYoutubeFrame = () => {
    if (!window.YT) { // If not, load the script asynchronously
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      // onYouTubeIframeAPIReady will load the video after the script is loaded
      window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    } else { // If script is already there, load the video directly
      this.onYouTubeIframeAPIReady();
    }
  };


  onYouTubeIframeAPIReady = () => {
    // START OUR PLAYLIST AT THE BEGINNING
    console.log('onYouTubeIframeAPIReady = ()');
    
    // NOW MAKE OUR PLAYER WITH OUR DESIRED PROPERTIES
    if (this.props.playlist.length > 0) {
      this.props.setCurrentSong(0);
      const player = new window.YT.Player(this.PLAYER_NAME, {
        height: '200',
        width: '422',
        playerVars: {
          'playsinline': 1,
          'origin': "https://www.youtube.com"
        },
        events: {
          // NOTE OUR EVENT HANDLER FUNCTIONS HERE
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        }
      });
      this.setState({player});
    }
  }
  
  // THIS EVENT HANDLER GETS CALLED ONCE THE PLAYER IS CREATED
  onPlayerReady = (event) => {
    this.loadCurrentSong();
    //event.target.pauseVideo();
  }

  play = () => {
    if(this.state.notPlayedYet){
      this.state.player.playVideo();
      this.setState({notPlayedYet:false})
    }
    else if(this.state.playerState === 2)
        this.state.player.playVideo();
    else if(this.state.playerState === 0)
        this.loadAndPlayCurrentSong();
    this.props.incrementPlaylistListen();
  }

  loadCurrentSong = () => {
    if(this.props.currentSong !== null && this.props.playlist.length > this.props.currentSong ){
      let song = this.props.playlist[this.props.currentSong];
      this.state.player.cueVideoById(song.youTubeId);
      this.setState({notPlayedYet: true});
    }
  }
  
  // THIS FUNCTION LOADS THE CURRENT SONG INTO
  // THE PLAYER AND PLAYS IT
  loadAndPlayCurrentSong = () => {
    if(this.props.playlist.length > 0 && this.state.player !== null 
      && this.props.currentSong !== null){
      let song = this.props.playlist[this.props.currentSong];
      if(song){
        this.state.player.loadVideoById(song.youTubeId);
        this.state.player.playVideo();
      }
    }
  }
  
  // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
  nextSong = () => {
    let { currentSong } = this.props;
    currentSong++;
    currentSong = currentSong % this.props.playlist.length;
    this.props.setCurrentSong(currentSong);
  }

  // THIS FUNCTION DECREMENTS THE PLAYLIST SONG TO THE PREVIOUS ONE
  previousSong = () => {
    let { currentSong } = this.props;
    if(currentSong > 0)
        currentSong--;
    else if(currentSong === 0)
      currentSong = this.props.playlist.length - 1;
    this.props.setCurrentSong(currentSong);
  }

  skipNext = () => {
      this.nextSong();
      this.loadAndPlayCurrentSong();
  }

  skipPrevious = () => {
    this.previousSong();
    this.loadAndPlayCurrentSong();
}
  
  // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
  // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
  // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
  // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
  onPlayerStateChange = (event) => {
    let playerStatus = event.data;
    this.setState({playerState: Number(event.data)});
    let color;
    if (playerStatus == -1) {
      // VIDEO UNSTARTED
      color = "#37474F";
    } else if (playerStatus == 0) {
      // THE VIDEO HAS COMPLETED PLAYING
      color = "#FFFF00";
      this.nextSong();
    } else if (playerStatus == 1) {
      // THE VIDEO IS PLAYED
      color = "#33691E";
    } else if (playerStatus == 2) {
      // THE VIDEO IS PAUSED
      color = "#DD2C00";
    } else if (playerStatus == 3) {
      // THE VIDEO IS BUFFERING
      color = "#AA00FF";
    } else if (playerStatus == 5) {
      // THE VIDEO HAS BEEN CUED
      color = "#FF6DOO";
    }
    if (color) {
      document.getElementById(this.PLAYER_NAME).style.borderColor = color;
    }
  }


  render = () => {
    const { playlist, title, currentSong } = this.props;
    console.log('PPPP', this.state.player, playlist.length, currentSong)
    return (
        <Box id='youtube_test_player_container'>
            <div id="youtube_player"></div>
            
            <div id="player-info" >
                <Typography sx={{fontWeight:'bold', fontSize:'14px', marginLeft:'35%'}}>Now Playing</Typography>
               
                {(this.state.player !== null && playlist.length > 0 && currentSong !== null) ? 
                    <>
                        <Typography sx={{fontWeight:'bold', fontSize:'14px'}}>Playlist: {title}</Typography>
                        <Typography sx={{fontWeight:'bold', fontSize:'14px'}}>Song #: {currentSong+1}</Typography>
                        <Typography sx={{fontWeight:'bold', fontSize:'14px'}}>Title: {playlist[currentSong].title}</Typography>
                        <Typography sx={{fontWeight:'bold', fontSize:'14px'}}>Artist: {playlist[currentSong].artist}</Typography>
                    </>
                :
                    ''
                }
                <Grid display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems='center' alignContent='center' 
                style={{background:'#ffffff', width:'385px', height:'30px', gap:'10px', color:'black', borderColor:'#666666',
                 borderStyle:'solid', borderWidth:'1px', borderRadius:'5px', position: 'absolute', top: '112px'}}>
                    <SkipPreviousIcon sx={{cursor:'pointer'}} onClick={(e)=>{
                      e.stopPropagation()
                        if(this.state.player !== null && playlist.length > 0)
                        {
                            this.skipPrevious();
                        }
                    }}
                    />
                    <StopIcon sx={{cursor:'pointer'}} onClick={(e)=>{
                      e.stopPropagation()
                        if(this.state.player !== null && playlist.length > 0)
                        {
                            this.state.player.stopVideo();
                        }
                    }}/>
                    {
                        this.state.playerState === 1 ? 
                        <PauseIcon sx={{cursor:'pointer'}}
                            onClick={(e)=>{
                      e.stopPropagation()
                                if(this.state.player !== null && playlist.length > 0)
                                {
                                    this.state.player.pauseVideo()
                                }
                            }}
                        /> : 
                        <PlayArrowIcon sx={{cursor:'pointer'}} 
                            onClick={(e)=>{
                      e.stopPropagation()
                                if(this.state.player !== null && playlist.length > 0)
                                {
                                    this.play();
                                }
                            }}
                        />
                    }
                    <SkipNextIcon sx={{cursor:'pointer'}} 
                        onClick={(e)=>{
                      e.stopPropagation()
                            if(this.state.player !== null && playlist.length > 0)
                            {
                                this.skipNext();
                            }
                        }}
                    />
                </Grid>
            </div> 
            
        </Box>
    );
  };
}

export default YouTubePlayer;

