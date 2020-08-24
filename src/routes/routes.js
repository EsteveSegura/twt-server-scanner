const express = require('express');
const router = express.Router();
const database = require('../libs/database')
const secure = require('../libs/auth')
const jwt = require('jsonwebtoken')

router.get('/', secure.verifyToken, (req, res) => {
    req.token = req.session.token;
    jwt.verify(req.token, process.env.SESSION, (err, authData) => {
        if (err) {
            res.redirect('/login')
        } else {
            res.render('index.ejs');
        }
    });

});

router.get('/profile/:user', secure.verifyToken, async (req, res, next) => {
    req.token = req.session.token;
    jwt.verify(req.token, process.env.SESSION, async (err, authData) => {
        if (err) {
            res.redirect('/login')
        } else {
            let userUrl = req.params.user
            let databaseResult = await database.getStreamer(userUrl)
            res.render('profile.ejs', {
                files: databaseResult.history,
                user: userUrl,
                screenName: req.params.user,
                userData: databaseResult
            });
        }
    });
});

router.get('/login', async (req, res, next) => {
    res.render('login.ejs');
});

router.post('/login', (req, res) => {
    let users = [
        {
            "user": "",
        }
    ]
    for (let i = 0; i < users.length; i++) {
        if (users[i].user == req.body.token) {
            jwt.sign({ 'user': users[i].user }, process.env.SESSION, (err, token) => {
                req.session.token = token;
                res.redirect('/')
            });
            break;
        }
    }
});

router.get('/profile/:user/:file', secure.verifyToken, async (req, res, next) => {
    req.token = req.session.token;
    jwt.verify(req.token, process.env.SESSION, async (err, authData) => {
        if (err) {
            res.redirect('/login')
        } else {
            let userUrl = req.params.user
            let databaseResult = await database.getStreamer(userUrl)
            let json = databaseResult.history.filter(dataset => dataset._id == req.params.file)
            res.render('data.ejs', {
                user: userUrl,
                json: json[0].data,
                userData: databaseResult
            });
        }
    });
});


module.exports = router;