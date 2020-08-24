const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let streamerSchema = new Schema({
    stream: {
        _id: Number,
        game: String,
        broadcast_platform: String,
        community_id: String,
        community_ids: [String],
        viewers: Number,
        video_height: Number,
        average_fps: Number,
        delay: Number,
        created_at: Date,
        is_playlist: Boolean,
        stream_type: String,
        preview: {
            small: String,
            medium: String,
            large: String,
            template: String
        },
        channel: {
            mature: Boolean,
            status: String,
            broadcaster_language: String,
            broadcaster_software: String,
            display_name: String,
            game: String,
            language: String,
            _id: Number,
            name: String,
            created_at: Date,
            updated_at: Date,
            partner: Boolean,
            logo: String,
            video_banner: String,
            profile_banner: String,
            profile_banner_background_color: String,
            url: String,
            views: Number,
            followers: Number,
            broadcaster_type: String,
            description: String,
            private_video: Boolean,
            privacy_options_enabled: Boolean
        }
    },
    history: [
        {
            date: Date,
            data: [{
                viewers: Number,
                chatter_count: Number
            }]
        }
    ]
})

module.exports = mongoose.model('streamer', streamerSchema)