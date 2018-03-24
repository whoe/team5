const contacts = require('../controllers/contacts');
const messages = require('../controllers/messages');
const avatar = require('../controllers/avatar');

module.exports = (server) => {
    server
        .route('/api/messages')
        .get(messages);

    server
        .route('/api/contacts')
        .get(contacts);


    server
        .get('/api/avatar/:type(svg|png)?/:id?', avatar);

};
