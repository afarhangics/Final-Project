import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index, setCurrentSong,
        setShouldLoadNewSong,currentSong } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        event.stopPropagation();
        if(currentSong === index){
            setCurrentSong(null);
        }
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        event.stopPropagation();
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 1) {
            setCurrentSong(index);
            setShouldLoadNewSong(true);
        }
        if (event.detail === 2) {
            store.showEditSongModal(index, song);
        }
       
    }

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            style={{background: `${currentSong === index ? '#d4af37' : '#2c2f70'}`}}
            onClick={handleClick}
        >
            {index + 1}.
            <span
                id={'song-' + index + '-link'}
                className="song-link">
                {song.title} by {song.artist}
            </span>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleRemoveSong}
            />
        </div>
    );
}

export default SongCard;