const express = require('express');
const bodyParser = require('body-parser');
const helper = require('./helper/helper.js');
const mongoose = require('mongoose');
const campground = require('./models/campground');
const comment = require('./models/comment');
const seedDb = require('./helper/seed');
const passport = require('passport');
const localStrategy = require('passport-local');
const user = require('./models/user');
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');
const likeRoutes = require('./routes/like');
const userRoutes = require('./routes/user');

//seedDb();

mongoose.connect('mongodb://localhost/campgrounds');
mongoose.Promise = require('bluebird');

const app = express();

app.use(require('express-session')({
	secret: 'I am a psychopath!!',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use(commentRoutes);
app.use(likeRoutes);
app.use(userRoutes);

let port = helper.normalizePort(process.env.PORT || '3000');

app.listen(port, () => {
	console.log("The app has started!");
});
