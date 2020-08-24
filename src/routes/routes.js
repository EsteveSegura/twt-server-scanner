const express = require('express');
const router = express.Router();
const fs = require('fs')

router.get('/', (req, res) => {
    res.render('index.ejs');
});

router.get('/profile/:user', (req, res) => {
    let userData = JSON.parse(fs.readFileSync(`./users/${req.params.user}.json`,'utf8'))
    let files = fs.readdirSync('./data', 'utf8')
    let userUrl = req.params.user
    let filesFiltered = files.filter(file => userUrl == file.split("_")[0])
    let filesFilteredFormat = filesFiltered.filter(file => file.endsWith(".json"))
    console.log(filesFilteredFormat)
    res.render('profile.ejs', {
        files: filesFilteredFormat,
        user: userUrl,
        screenName: req.params.user,
        userData: userData
    });
});

router.get('/profile/:user/:file', (req, res) => {
    let fileUrl = req.params.file
    let userData = JSON.parse(fs.readFileSync(`./users/${req.params.user}.json`,'utf8'))
    let userUrl = req.params.user
    let json = JSON.parse(fs.readFileSync(`./data/${fileUrl}`,'utf8'))
    res.render('data.ejs', {
        user : userUrl,
        json: json,
        userData: userData
    });
});


module.exports = router;