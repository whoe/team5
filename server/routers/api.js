const contacts = require('../controllers/contacts');
const messages = require('../controllers/messages');

module.exports = (server) => {
    server
        .route('/api/messages')
        .get(messages);

    server
        .route('/api/contacts')
        .get(contacts);
};
