(async () => {
    let userTw = require('./libs/userTwitch');
    let getData = require('./libs/getDataApi')
    let users = ["girlazo"]
    //Scan 100 top valorant players
    //users = await getData.getStreamersByCat(["Valorant"]) 
    let usersClass = users.map(user => new userTw(user))


    setInterval(async () => {
        for (let i = 0; i < usersClass.length; i++) {
            try {
                usersClass[i].addNewRecord()
            } catch (error) {
                console.log(error)
            }
        }
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