const dbHelper = require('../../infrastructure/dbHelper');

module.exports = (req, res) => {
    // temp test
    dbHelper.get('a').then(response => res.json(response));
};
