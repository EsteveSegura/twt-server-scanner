const fs = require('fs')
const { CanvasRenderService } = require('chartjs-node-canvas');

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
    let stringDate = `${currentDate.getDate()}-${currentDate.getMonth()}-${currentDate.getFullYear()}_${currentDate.getHours()}-${currentDate.getMinutes()}`
    let fileName = `${name}_${stringDate}`
    fs.writeFileSync(`./data/${fileName}.csv`, bodyString, "utf8")
}

function toJson(data, name) {
    let currentDate = new Date();
    let stringDate = `${currentDate.getDate()}-${currentDate.getMonth()}-${currentDate.getFullYear()}_${currentDate.getHours()}-${currentDate.getMinutes()}`
    let fileName = `${name}_${stringDate}`
    try {
        fs.writeFileSync(`./data/${fileName}.json`, JSON.stringify(data), "utf8")
    } catch (error) {
        console.log(error)
    }
}


async function toPng(data_, name) {
    const width = 900;
    const height = 500;
    let currentDate = new Date();
    let stringDate = `${currentDate.getDate()}-${currentDate.getMonth()}-${currentDate.getFullYear()}_${currentDate.getHours()}-${currentDate.getMinutes()}`
    let fileName = `${name}_${stringDate}`
    const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
        ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
    });

    labs = []
    for (let j = 0; j < data_.length; j++) {
        labs.push(j)
    }
    const configuration = {
        type: 'line',
        data: {
            labels: labs,
            datasets: [{
                label: 'views',
                borderColor: 'rgb(0,255,0)',
                data: data_.map((data) => parseInt(data.viewers))
            },
            {
                label: 'Unidentified views',
                borderColor: 'rgb(255,0,0)',
                data: data_.map((data) => parseInt(Math.abs(data.chatter_count - data.viewers)))
            },
            {
                label: 'chatters',
                borderColor: 'rgb(0,0,255)',
                data: data_.map((data) => parseInt(data.chatter_count))
            }]
        },
        options: {
            bezierCurve: false,
            animation: {
                duration: 0
            },
            title: {
                display: true,
                text: name
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    };
    const image = await canvasRenderService.renderToBuffer(configuration);
    fs.writeFileSync(`./dataimg/${fileName}.png`, image)
}

module.exports = { toCsv, toJson, toPng } 