const express = require('express');

const authRouter = require('./routers/auth');
const apiRouter = require('./routers/api');
const appRouter = require('./routers/app');

const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });

const server = express();

app.prepare().then(() => {
    authRouter(server);
    apiRouter(server);
    appRouter(server, app);
    server.listen(3000, () => console.info('localhost:3000'));
});

