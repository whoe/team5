'use strict';

const express = require('express');
const routes = require('./routes');

const port = 8080;

const app = express();

module.exports = app;
routes(app);

app.listen(port, () => {
    console.info(`localhost:${port}`);
});
