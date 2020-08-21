(async () => {
    let userTw = require('./libs/userTwitch');
    let users = ["girlazo"] //users to scan
    let usersClass = users.map(user => new userTw(user))

    //Scaning online streamers
    setInterval(async () => {
        for (let i = 0; i < usersClass.length; i++) {
            try {
                await usersClass[i].addNewRecord()
            } catch (error) {
                console.log(error)
            }
        }
    }, 60000);

    //On force exit
    process.on('SIGINT', () => {
        console.log('Saving data');
        for (let i = 0; i < usersClass.length; i++) {
            usersClass[i].saveLogs()
        }
        process.exit();
    });

})()