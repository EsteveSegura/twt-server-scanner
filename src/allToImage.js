(async () => {
    const { CanvasRenderService } = require('chartjs-node-canvas');
    const fs = require('fs')
    const width = 900;
    const height = 500;

    const chartCallback = (ChartJS) => {
        ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
    };
    const canvasRenderService = new CanvasRenderService(width, height, chartCallback);

    let folder = fs.readdirSync('./data/')    
    folder = folder.filter((file) => { if (file.endsWith('.json')) { return file } })

    for (let i = 0; i < folder.length; i++) {
        const fileJson = JSON.parse(fs.readFileSync(`./data/${folder[i]}`, 'utf8'))
        const fileName = folder[i].split('_')
        labs = []
        for (let j = 0; j < fileJson.length; j++) {
            labs.push(j)
        }
        const configuration = {
            type: 'line',
            data: {
                labels: labs,
                datasets: [{
                    label: 'views',
                    borderColor: 'rgb(0,255,0)',
                    data: fileJson.map((data) => parseInt(data.viewers))
                },
                {
                    label: 'Unidentified views',
                    borderColor: 'rgb(255,0,0)',
                    data: fileJson.map((data) => parseInt(Math.abs(data.chatter_count - data.viewers)))
                },
                {
                    label: 'chatters',
                    borderColor: 'rgb(0,0,255)',
                    data: fileJson.map((data) => parseInt(data.chatter_count))
                }]
            },
            options: {
                bezierCurve: false,
                animation: {
                    duration: 0
                },
                title: {
                    display: true,
                    text: fileName
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
        fs.writeFileSync(`./dataimg/${fileName[0]}.png`, image)
    }
})();