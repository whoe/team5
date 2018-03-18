const expressSession = require('express-session');
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');
const passportGithub = require('passport-github');

module.exports = app => {
    const strategy = new passportGithub.Strategy(
        {
            clientID: 'ddd0e9e63ab10a7e4b51',
            clientSecret: '1421931def70a02d97ff16a31fe5219f237cb535',
            callbackURL: 'http://localhost:3000/auth/return'
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    );

    passport.use(strategy);

    app.use(expressSession({
        secret: 'dsgdfhgfhfgfh',
        resave: false,
        saveUninitialized: false
    }));

    passport.serializeUser((profile, done) => {
        done(null, profile);
    });

    passport.deserializeUser((profile, done) => {
        done(null, profile);
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app
        .get('/auth', passport.authenticate('github'))
        .get(
            '/auth/return',
            passport.authenticate('github', { failureRedirect: '/auth' }),
            (req, res) => res.redirect('/profile')
        )
        .get(
            '/profile',
            connectEnsureLogin.ensureLoggedIn('/auth'),
            (req, res) => res.json(req.user)
        )
        .get('/logout', (req, res) => {
            req.logout();
            res.redirect('/');
        });

    return passport;
};
