const blessed = require('blessed')
const contrib = require('blessed-contrib')
const fs = require('fs')
let folder = fs.readdirSync('./data/')
folder = folder.filter((file) => { if (file.endsWith('.json')) { return file } })
let foldercensor = folder.map((file)=> {

    
    let s = file.split("_")
    s.shift()
    return s.join('_')
    
    
   //return file
})

let screen = blessed.screen()
let ContentList = blessed.list({
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: true,
    label: 'Streamers',
    width: '100%',
    height: '100%',
    border: { type: "line", fg: "cyan" },
    columnSpacing: 10, 
    columnWidth: [16, 12, 12] 
});

foldercensor.forEach((el) => { ContentList.add(el) })
ContentList.focus()

ContentList.on('select', item => {
    let dataJson = JSON.parse(fs.readFileSync('./data/' + folder[ContentList.getItemIndex(item.content)], 'utf8'))
    let label = dataJson.map((dataset, i) => i + 1)

    let line = contrib.line({
        style: {
            line: "yellow",
            text: "green",
            baseline: "black"
        },
        height: "100%",
        showLegend: true,
        xLabelPadding: 3,
        xPadding: 5,
        label: foldercensor[ContentList.getItemIndex(item.content)]
    })

    let views = {
        title: "views",
        x: label,
        y: dataJson.map(data => data.viewers),
        style: { line: 'blue' }
    }

    let chatters = {
        title: "chatters",
        x: label,
        y: dataJson.map(data => data.chatter_count),
        style: { line: 'green' }
    }

    let unidintified = {
        title: "unidintified views",
        x: label,
        y: dataJson.map(data => Math.abs(data.chatter_count - data.viewers)),
        style: { line: 'red' }
    }

    screen.append(line, ContentList)
    line.setData([views, chatters, unidintified])
    screen.render()

    screen.key(['q', 'C-c'], function (ch, key) {
        screen.append(ContentList)
        ContentList.focus()
        screen.render()
    });
});

screen.append(ContentList)
screen.key(['escape', 'C-c'], function (ch, key) {
    return process.exit(0);
});

screen.render()