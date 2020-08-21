const fs = require('fs')

function toCsv(data, name) {
    let headers = ["time", "totalViews", "realViews", "fakeViews"]
    let headerString = headers.toString()
    let bodyString = headerString + "\n"
    let time = []

    for (let i = 0; i < data.length; i++) {
        if (i == 0) {
            time.push(0)
        }
        time.push(time[time.length - 1] + 1)
        bodyString = `${bodyString}${time[i]},${data[i].viewers},${data[i].chatter_count},${Math.abs(data[i].viewers - data[i].chatter_count)}\n`
    }

    let currentDate = new Date();
    let stringDate = `${currentDate.getDay()}-${currentDate.getMonth()}-${currentDate.getFullYear()}_${currentDate.getHours()}-${currentDate.getMinutes()}`
    let fileName = `${name}_${stringDate}`
    fs.writeFileSync(`./data/${fileName}.csv`, bodyString, "utf8")
}

function toJson(data, name) {
    let currentDate = new Date();
    let stringDate = `${currentDate.getDay()}-${currentDate.getMonth()}-${currentDate.getFullYear()}_${currentDate.getHours()}-${currentDate.getMinutes()}`
    let fileName = `${name}_${stringDate}`
    try {
        fs.writeFileSync(`./data/${fileName}.json`, JSON.stringify(data), "utf8")
    } catch (error) {
        console.log(error)
    }
}

module.exports = { toCsv, toJson }