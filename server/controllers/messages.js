const dbHelper = require('../libs/dbHelper');

module.exports = async (req, res) => {
    // temp test
    await dbHelper.put('a', 'put');
    dbHelper.getAll('a').then(response => res.json(response));
};
