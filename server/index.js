'use strict';

const express = require('express');
const routes = require('./routes');

const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });

const server = express();

app.prepare().then(() => {
    routes(server, app);
    server.listen(3000, () => console.info('localhost:3000'));
});
