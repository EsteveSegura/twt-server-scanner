const getData = require('../libs/getDataApi');
const exportFiles = require('./exportFiles');
const database = require('./database');

class userTwitch {
    constructor(user) {
        this.user = user;
        this.isOnline = false;
        this.viewsOverTime = []
        this.currentStatus = false
        this.previousStauts = false
    }

    async addNewRecord() {
        let broadcastData = await getData.streamerIsOnline(this.user)
        if (broadcastData) {
            this.currentStatus = true

            //Starting to stream
            if (this.currentStatus && !this.previousStauts) {
                console.log(`${this.user} is now streaming`)
                await this.createProfile()
                this.viewsOverTime = []
                this.viewsOverTime.push({
                    viewers: broadcastData.dataFromTwitch.data[0].viewer_count,
                    chatter_count: broadcastData.dataFromTmi.chatter_count
                })
                this.previousStauts = true
                return 0;
            }

            //Is streaming
            if (this.currentStatus && this.previousStauts) {
                console.log(`${this.user}: views: ${broadcastData.dataFromTwitch.data[0].viewer_count} chatters: ${broadcastData.dataFromTmi.chatter_count}`)
                this.viewsOverTime.push({
                    viewers: broadcastData.dataFromTwitch.data[0].viewer_count,
                    chatter_count: broadcastData.dataFromTmi.chatter_count
                })
                return 0;
            }
        } else {
            this.currentStatus = false
        }

        //End Stream
        if (!this.currentStatus && this.previousStauts) {
            console.log(`${this.user} has stoped the streaming. Logs are saved.`) 
            await this.saveLogs()
            this.previousStauts = false
            return 0;
        }
    }

    async createProfile(){
        database.addStreamer(this.user)
        /*fs.writeFile(`./users/${this.user}.json`, JSON.stringify(streamData), (err) => {
            console.log(`User data: ${this.user} saved.`)
        })*/
    }

    async saveLogs() {
        if (this.viewsOverTime.length > 0) {
            await database.addStreamerHistory(this.user, Date.now(), this.viewsOverTime)
            //exportFiles.toCsv(this.viewsOverTime, this.user)
            //exportFiles.toJson(this.viewsOverTime, this.user)
            //await exportFiles.toPng(this.viewsOverTime, this.user)
        }
    }
}

module.exports = userTwitch