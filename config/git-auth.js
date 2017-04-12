const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user');

const gitConfig = {
    clientID: '63e392b02841bb8319e1',
    clientSecret: '9dc53c57b947e1c67bbb3fa09966b089bbe3cf3e',
    callbackURL: 'http://localhost:3000/auth/github/callback'
};

const gitInit = (token, refreshToken, profile, done) => {
    User.findOne({ 'github.id': profile.id })
        .then(user => {
            if(user) {
                return done(null, user);
            }

            User.create({
                'github.id': profile.id,
                'github.token': token
            })
                .then(user => {
                    return done(null, user);
                })
                .catch(done);
        })
        .catch(done);
};

passport.use(new GitHubStrategy(gitConfig, gitInit));

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser((id, done) => {
   User.findById(id)
       .then(user => {
           return done(null, user);
       })
       .catch(done);
});

module.exports = {
    gitLogin: passport.authenticate('github'),
    gitDone: passport.authenticate('github', {
        successRedirect: '/api/ninjas',
        failureRedirect: '/'
    }),
    ensureAuth(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }
};