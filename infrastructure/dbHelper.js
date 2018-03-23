'use strict';

const got = require('got');
const querystring = require('querystring');

const { token, dbUrl, requestTimeout, retryCount } = require('../HruDB-config.json');

class DBHelper {

    static async get(key) {
        return DBHelper._get(dbUrl + key);
    }

    static async getAll(key, params = null) {
        const url = `${dbUrl}${key}/all?` + querystring.stringify(params);

        return DBHelper._get(url);
    }

    static _get(url) {
        const options = DBHelper._makeOption('GET');

        return DBHelper.request(url, options)
            .then(res => JSON.parse(res.body));
    }

    static async put(key, value) {
        const options = DBHelper._makeOption('PUT', value);

        return DBHelper.request(dbUrl + key, options);
    }

    static async post(key, value) {
        const options = DBHelper._makeOption('POST', value);

        return DBHelper.request(dbUrl + key, options);
    }

    static async delete(key) {
        const options = DBHelper._makeOption('DELETE');

        return DBHelper.request(dbUrl + key, options);
    }

    static async request(url, options) {
        for (let i = 0; i < retryCount; i++) {
            try {
                return await got(url, options);
            } catch (e) {
                continue;
            }
        }
        throw new Error();
    }

    static _makeOption(method, body = null) {
        return {
            method,
            headers: {
                'Authorization': token,
                'Content-Type': 'plain/text'
            },
            timeout: requestTimeout,
            body
        };
    }
}

module.exports = DBHelper;
