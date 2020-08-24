const mongoose = require('mongoose')
const streamer = require('../models/streamer')
const getData = require('../libs/getDataApi')
const { find } = require('../models/streamer')

async function getStreamer(twitchUser) {
    let findStreamer = await streamer.findOne({ "stream.channel.name": twitchUser }).exec()
    return findStreamer
}

async function addStreamer(twitchUser) {
    let findStreamer = await getStreamer(twitchUser)
    let dataAdd = await getData.dataStreamer(twitchUser)
    if (dataAdd.stream != null) {
        if (!findStreamer) {
            let newStreamer = new streamer(dataAdd)
            await newStreamer.save()
        } else {
            await streamer.findOneAndUpdate({ "stream.channel.name": twitchUser }, dataAdd)
        }
    } else {
    }
}

async function addStreamerHistory(twitchUser, date, data) {
    let formatData = { date: date, data: data }
    let updateStreamer = await streamer.findOneAndUpdate({ "stream.channel.name": twitchUser }, { $push: { "history": formatData } }).exec();
}



module.exports = { getStreamer, addStreamer, addStreamerHistory }