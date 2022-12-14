const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
const mongoose = require('mongoose')
const Long = mongoose.Types.Long;
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    body.listens = Long.fromString("0");

    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
    })
}
deletePlaylist = async (req, res) => {
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    return res.status(200).json({ success: true, playlist: list })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(list);
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    console.log("getPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email, user) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            ...list._doc,
                            user
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email, user);
    }).catch(err => console.log(err))
}

getPublishedPlaylists = async (req, res) => {
    const users = await User.find({});
    console.log("%%%%%%%%%%%%%%%", users);
    const userTree = {}
    users.forEach(u => userTree[u.email] = u)
    await Playlist.find({published: true}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        const userTree = {}
            users.forEach(u => userTree[u.email] = u)
            const emailUserKeys = playlists.map(p => {
                const newPlaylist = {
                    ...p._doc,
                    user: userTree[p.ownerEmail]
                }
                return newPlaylist;
            })
        return res.status(200).json({ success: true, playlists: emailUserKeys })
    }).catch(err => console.log(err))
}

getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}

searchPlaylistsByUsers = async (req, res) => {
    const {searchTerm} = req.body;
    if (!searchTerm) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a searchTerm',
        })
    }

    const users = await User.find({$text: {$search: searchTerm}});
    console.log(users);
    const emails = users.map(u=>u.email);
    if(emails.length > 0)
    {
        await Playlist.find( { ownerEmail: { $in: emails }, published: true }, (err, playlists) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!playlists.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Playlists not found` })
            }
            const userTree = {}
            users.forEach(u => userTree[u.email] = u)
            const emailUserKeys = playlists.map(p => {
                const newPlaylist = {
                    ...p._doc,
                    user: userTree[p.ownerEmail]
                }
                return newPlaylist;
            })
            return res.status(200).json({ success: true, playlists: emailUserKeys })
        }).catch(err => console.log(err));
    } else{
        return res
                    .status(404)
                    .json({ success: false, error: `No user match` })
    }
    
}


searchPlaylists = async (req, res) => {
    const {searchTerm} = req.body;
    if (!searchTerm) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a searchTerm',
        })
    }
    const users = await User.find({});
    console.log("%%%%%%%%%%%%%%%", users);
    const userTree = {}
    users.forEach(u => userTree[u.email] = u)
            
   await Playlist.find( { $text: {$search: searchTerm}, published: true }, (err, playlists) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!playlists.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Playlists not found` })
            }
            const emailUserKeys = playlists.map(p => {
                const newPlaylist = {
                    ...p._doc,
                    user: userTree[p.ownerEmail]
                }
                return newPlaylist;
           })
            return res.status(200).json({ success: true, playlists: emailUserKeys })
        }).catch(err => console.log(err));    
}

incrementPlaylistListen = async (req, res) => {
    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }
        playlist.listens = playlist.listens.add(Long.fromString("1"));
        playlist
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: playlist._id,
                    playlist,
                    message: 'Playlist listens incremented!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Playlist not listens incremented!',
                })
            })
    })
}

updatePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);

                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;

                    list.published = body.playlist.published;
                    list.publishedDate = body.playlist.publishedDate;
                    list.likes = body.playlist.likes;
                    list.dislikes = body.playlist.dislikes;

                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                playlist: list,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}



likeUnlikePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

                         
        playlist.likes = body.playlist.likes;
        playlist.dislikes = body.playlist.dislikes;

        playlist
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: playlist._id,
                                playlist: playlist,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
       
    })
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    searchPlaylistsByUsers,
    getPublishedPlaylists,
    incrementPlaylistListen,
    searchPlaylists,
    likeUnlikePlaylist,
};