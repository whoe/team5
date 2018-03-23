const passport = require('passport');


module.exports = function () {

    passport.serializeUser((profile, done) => {
        done(null, profile);
    });

    passport.deserializeUser((profile, done) => {
        done(null, profile);
    });
};
