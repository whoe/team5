require('dotenv').config({ path: './server/config/.auth' });

const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');

const authRouter = require('./routers/auth');
const apiRouter = require('./routers/api');
const appRouter = require('./routers/app');

const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });

const server = express();

app.prepare().then(() => {
    server.use(expressSession({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));


    server.use(passport.initialize());
    server.use(passport.session());

    authRouter(server);
    apiRouter(server);
    appRouter(server, app);

    server.listen(3000, () => console.info('localhost:3000'));
});

