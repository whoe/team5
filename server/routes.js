'use strict';

const auth = require('./controllers/auth');
const contacts = require('./controllers/contacts');
const messages = require('./controllers/messages');

module.exports = (server, app) => {
    const render = pageName => (req, res) => app.render(req, res, `/${pageName}`);

    server
        .route('/')
        .get(render('index'));

    server
        .route('/messages')
        .get(messages)

    server
        .route('/contacts')
        .get(contacts)

    server
        .route('/auth')
        .get(auth)

    server.all('*', (req, res) => res.sendStatus(404));
};
