'use strict';

const auth = require('./controllers/auth');
const contacts = require('./controllers/contacts');
const messages = require('./controllers/messages');



module.exports = app => {
    app
        .route('/messages')
        .get(messages)

    app
        .route('/contacts')
        .get(contacts)

    app
        .route('/auth')
        .get(auth)

    app.all('*', (req, res) => res.sendStatus(404));
};
