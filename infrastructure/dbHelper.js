const fetch = require('node-fetch');
const { token, url } = require('../HruDB-config.json');

module.exports = class DBHelper {
    /* eslint-disable no-unused-vars */
    static get(key, params) {
        const headers = {
            'Authorization': token, 'Content-Type': 'plain/text'
        };

        return fetch(url + `${key}/all`, { headers: headers })
            .then(response => response.json());
    }

    static add(key, value) {
        const headers = {
            'Authorization': token, 'Content-Type': 'application/json'
        };
        fetch(url + key, {
            method: 'POST',
            body: JSON.stringify(value),
            headers: headers
        });
    }

    static update() {
        throw new Error();
    }

    static remove() {
        throw new Error();
    }
};
