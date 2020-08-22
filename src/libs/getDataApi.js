
require('dotenv').config()
const axios = require('axios');
const path = require('path')

async function getApiData(userTwitch) {
    let getData = await axios.get(`https://tmi.twitch.tv/group/user/${userTwitch}/chatters`);
    return getData.data
}

async function getStreamersByCat(category) {
    let getStreams = []
    try {
        let getBearer = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`)
        let headers = {
            'headers': {
                'Authorization': `Bearer ${getBearer.data.access_token}`,
                'Client-ID': process.env.CLIENT_ID,
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }
        for (let i = 0; i < category.length; i++) {
            let getStream = await axios.get(`https://api.twitch.tv/kraken/streams/?game=${category[i]}&limit=100&language=es`, headers)
            console.log(getStream.data.streams)
            for (let j = 0; j < getStream.data.streams.length; j++) {
                getStreams.push(getStream.data.streams[j].channel.name)
            }
        }
    } catch (error) {
        console.log(error)
    }

    return getStreams
}

/*(async () => {
    let streams = await getStreamersByCat(["Overwatch", "Valorant", "Counter-Strike: Global Offensive", "Grand Theft Auto V", "Fortnite"])
})()*/

async function streamerIsOnline(userTwitch) {
    try {
        let getBearer = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`)
        let headers = {
            'headers': {
                'Authorization': `Bearer ${getBearer.data.access_token}`,
                'Client-ID': process.env.CLIENT_ID,
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }
        let getId = await axios.get(`https://api.twitch.tv/kraken/users/?login=${userTwitch}`, headers)
        let getViews = await axios.get(`https://api.twitch.tv/helix/streams?user_id=${getId.data.users[0]._id}`, headers)

        if (getViews.data.data.length == 0) {
            return false
        } else {
            let getData = await getApiData(userTwitch)
            return {
                dataFromTmi: getData,
                dataFromTwitch: getViews.data
            }
        }
    } catch (error) {
        console.log(error)
        return false
    }
}


module.exports = { streamerIsOnline, getStreamersByCat }