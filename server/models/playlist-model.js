const mongoose = require('mongoose')
const Schema = mongoose.Schema
require("mongoose-long")(mongoose);

const SchemaTypes = mongoose.Schema.Types;

const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        listens: { type: SchemaTypes.Long, required: true },
        published: { type: Boolean, required: true },
        publishedDate: { type: Date, required: false },
        likes: { type: [{
            userId: String,
        }], required: false },
        dislikes: { type: [{
            userId: String,
        }], required: false },
        ownerEmail: { type: String, required: true },
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String,
            comments: { type: [{
                userId: String,
                authorName: String,
                comment:String,
            }], required: false },
        }], required: true }
    },
    { timestamps: true },
)

playlistSchema.index({name: 'text', 'name': 'text'});

module.exports = mongoose.model('Playlist', playlistSchema)
