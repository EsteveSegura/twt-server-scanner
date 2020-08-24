(async () => {
    const http = require('http');
    const express = require('express')
    const socketIo = require('socket.io');
    const app = express()
    const cors = require('cors')
    const server = http.createServer(app)
    const io = socketIo(server);
    const userTw = require('./libs/userTwitch');
    const getData = require('./libs/getDataApi');
    const routes = require('./routes/routes');
    const socketClient = require('socket.io-client')('http://localhost:8729/');
    const mongoose = require('mongoose')
    const helmet = require('helmet');
    const bodyParser = require('body-parser');
    const session = require('express-session')

    mongoose.connect('mongodb://localhost/inspectwitch', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log("DataBase: OK")
    })

    //app.set('trust proxy', 1) // trust first proxy
    app.use(cors());
    app.use(session({
        secret: process.env.SESSION || 'supersecret1',
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 6000000000 }
    }));
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.set('views', './views');
    app.set('view engine', 'ejs');
    app.use(express.static('./public'));
    app.use('/', routes);

    io.on('connection', (socket) => {
        socket.on('dataUpdate', (body) => {
            socket.broadcast.emit('dataUpdate', body);
        })

        socket.on('initData', (body) => {
            socket.emit('initData', usersClass);
        })
    });

    server.listen(8729, () => {
        console.log('Server ON')
    })

    let users = ["epsyloncat", "sergioregui", "elbokeron", "elxokas", "sito7", "hitboxking", "sirmaza", "zok3r", "zainita", "paracetamor", "dazrbn", "mery_soldier", "luken", "leviathan", "rickyedit", "katth", "winghaven", "sujagg", "illojuan", "espe", "pettans", "mumusiraneitor", "gonsabellla", "milan926_", "iaaras2", "danielaazuaje_", "reborn_live", "kaquka", "girlazo"]
    //Scan 100 top valorant players
    //users = await getData.getStreamersByCat(["Valorant"])
    let usersClass = users.map(user => new userTw(user))

    for (let i = 0; i < usersClass.length; i++) {
        try {
            await usersClass[i].addNewRecord()
        } catch (error) {
            console.log(error)
        }
    }
    socketClient.emit('dataUpdate', usersClass)
    setInterval(async () => {
        for (let i = 0; i < usersClass.length; i++) {
            try {
                await usersClass[i].addNewRecord()
            } catch (error) {
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