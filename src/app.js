require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const passport = require('passport');
require('./strategies/discordstrategy'); // discordstrategy.js 파일을 임포트하여 passport 설정을 불러옵니다.
const db = require('./database/database');
const path = require('path');

db.then(() => console.log('Connected to MongoDB.')).catch(err => console.log(err));

// Routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard')
app.use(session({
    secret: 'some random secret',
    resave: false, // 추가된 부분
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    name: 'discord-oauth2'
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//s%3ABUgCuGX4uAJnv06pCialb2rGgQnUfaCt.EyILNNxe3xE7P17ZQhneMc5PQQQQNMsuvsQdUV1FMDA
// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// Middleware Routes
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);
app.get('/discordgo', (req, res) => {
    res.redirect('https://discord.com/channels/@me');
});

app.get('/', isAuthorized, (req, res) => {
    res.render('home');
});

function isAuthorized(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User is logged in.");
        return res.redirect('/dashboard');  // Use res.redirect directly if already authenticated
    } else {
        console.log("User is not logged in.");
        next();
    }
}

app.listen(PORT, () => {
    console.log(`당신은 지금 포트 ${PORT}에서 듣고 있습니단ㅇ.`);
});
