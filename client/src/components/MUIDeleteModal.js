import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIDeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    let modalClass = "modal";
    if (store.listMarkedForDeletion) {
        name = store.listMarkedForDeletion.name;
        modalClass += " is-visible";
    }

    function handleDeleteList(event) {
        event.stopPropagation();
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        event.stopPropagation();
        store.unmarkListForDeletion();
    }

    return (
        <Modal
            open={store.listMarkedForDeletion !== null}
        >
            <Box sx={style}>
                <div id="remove-song-modal"
                className={modalClass}
                data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-remove-song-root'>

                    <div className="modal-north dialog-header">
                            Remove Playlist?
                        </div>
                        <div className="modal-center">
                            <div className="modal-center-content">
                            Are you sure you want to delete the "{name}" playlist?
                            </div>
                        </div>
                        <div className="modal-south" style={{marginLeft:'20%'}}>
                            <input type="button" 
                                id="remove-song-confirm-button" 
                                className="modal-button" 
                                onClick={handleDeleteList}
                                value='Confirm' />
                            <input 
                                type="button" 
                                id="remove-song-cancel-button" 
                                className="modal-button" 
                                style={{marginLeft:'20px'}}
                                onClick={handleCloseModal}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
            </Box>
        </Modal>
    );
}