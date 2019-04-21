const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const UserService = require('./userService.js');
const userService = new UserService();

const TextService = require('./textService.js');
const textService = new TextService();

app.use(cookieParser());
app.use(bodyParser.json());

app.get('/api/v1/session', (req, res) => {
    const userSession = req.cookies['session'];
    const sessionData = userService.getSessionInfo(userSession);
    if (sessionData) {
        res.send({ login: sessionData.login });
    } else {
        res.status(401).send({ error: 'No such user.' })
    }
});

app.post('/api/v1/session', (req, res) => {
    const userData = req.body;
    const newSessionData = userService.newSession(userData);
    if (newSessionData) {
        res.cookie('session', newSessionData.session, { httpOnly: true });
        res.send({ login: newSessionData.login });
    } else {
        res.status(401).send({ error: 'No such user.' })
    }
});

app.delete('/api/v1/session', (req, res) => {
    const userData = req.body;
    const deletedSessionData = userService.deleteSession(userData);
    if (deletedSessionData) {
        res.clearCookie('session', { httpOnly: true });
        res.send({ success: 'Cookie cleared' });
    } else {
        res.status(401).send({ error: 'No such user.' })
    }
});

app.post('/api/v1/text', (req, res) => {
    const textData = req.body;
    const privateSections = ['PRIVATE1', 'PRIVATE2', 'PRIVATE3', 'PRIVATE4'];
    let createdText = null;
    if (!textData.author) {
        res.status(403).send({ error: 'No permission' });
    }

    if (privateSections.includes(textData.section)) {
        if (userService.checkSession({ login: textData.author, sessionId: req.cookies['session'] })) {
            createdText = textService.newText(textData);
        } else {
            res.status(403).send({ error: 'No permission' });
        }
    } else {
        createdText = textService.newText(textData);
    }

    console.log(createdText);
    if (createdText) {
        res.status(201).send(createdText);
    } else {
        res.status(403).send({ error: 'No permission' });
    }
});

app.get('/api/v1/text', (req, res) => {
    const privateSections = ['PRIVATE1', 'PRIVATE2', 'PRIVATE3', 'PRIVATE4'];
    let text = null;
    const login = req.query['login'];
    const section = req.query['section'];
    if (privateSections.includes(section)) {
        if (userService.checkSession({ login, sessionId: req.cookies['session'] })) {
            text = textService.getText({ login, section });
        } else {
            res.status(403).send({ error: 'No permission' });
        }
    } else {
        text = textService.getText({ login, section });
    }

    if (text) {
        if (text === 'No text') {
            res.status(404).send({ error: 'No such text' });
        } else {
            res.send(text);
        }
    } else {
        res.status(403).send({ error: 'No permission' });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});