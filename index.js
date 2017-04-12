const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const gitAuth = require('./config/git-auth');
const session = require('express-session');
const database = require('./config/database');

const routes = require('./routes/api');

const app = express();

database.connect();

app.set('port', process.env.port || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'tank and spank',
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    const html = `
    <ul>\
        <li><a href='/auth/github'>GitHub</a></li>\
        <li><a href='/logout'>logout</a></li>\
    </ul>`;

    res.send(html);
});

app.get('/logout', (req, res) => {
   req.logout();
   res.redirect('/');
});

app.get('/auth/github', gitAuth.gitLogin);
app.get('/auth/github/callback', gitAuth.gitDone);

app.use('/api', gitAuth.ensureAuth, routes);

app.use((err, req, res, next) => {
   res.status(422).send({
       error: err.message
   });
   next();
});

app.listen(app.get('port'), () => {
    console.log(`App is running at http://localhost:${app.get('port')}`);
    console.log('Press CTRL-C to stop\n');
});