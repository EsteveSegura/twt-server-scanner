(async () => {
    const http = require('http');
    const express = require('express')
    const socketIo = require('socket.io');
    const app = express()
    const server = http.createServer(app);
    const io = socketIo(server);
    const userTw = require('./libs/userTwitch');
    const getData = require('./libs/getDataApi');
    const routes = require('./routes/routes');
    const socketClient = require('socket.io-client')('http://localhost:3000/');


    app.set('views', './views');
    app.set('view engine', 'ejs');
    app.use(express.static('./public'));
    app.use('/', routes);


    io.on('connection', (socket) => {
        socket.on('dataUpdate', (body) => {
            console.log(body);
            socket.broadcast.emit('dataUpdate', body);
        })

        socket.on('initData', (body) => {
            console.log(body);
            socket.emit('initData', usersClass);
        })

    });

    
    server.listen(3000, () => {
        console.log('Server ON')
    })

    let users = ["girlazo"]
    //Scan 100 top valorant players
    users = await getData.getStreamersByCat(["Valorant"])
    console.log(users.length)
    let usersClass = users.map(user => new userTw(user))


    setInterval(async () => {
        for (let i = 0; i < usersClass.length; i++) {
            try {
                await usersClass[i].addNewRecord()
            } catch (error) {
                console.log(error)
            }
        }
        socketClient.emit('dataUpdate', usersClass)
    }, 60000);

    //On force exit
    process.on('SIGINT', async () => {
        console.log('Saving data');
        for (let i = 0; i < usersClass.length; i++) {
            await usersClass[i].saveLogs()
        }
        process.exit(1);
    });


})()