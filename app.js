require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const models = require('./db/schema_modal');
const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const session = require('express-session');


var loggedIn = false;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
    secret: 'our little secrets',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/govermentJob', { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.set('useCreateIndex', true);



passport.use(models.User.createStrategy()); /// to use this we have to add plugins to userSchema {userSchema.plugin(passportLocalMongoose); and userSchema.plugin(findOrCreate);}

// passport.serializeuser() is used to setting id as cookie in user's browser
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

//passport.deserializeuser() is used to getting id from the cookie which is then used in callback to get user info or something else
passport.deserializeUser(function(id, done) {
    models.User.findById(id, function(err, user) {
        done(null, user);
    });
});


passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET,
        callbackURL: "http://localhost:4000/auth/google/redirect",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, done) {
        //console.log(profile.emails[0].value);
        // console.log(profile.id);
        // console.log(profile.displayName);
        models.User.findOne({ email: profile.emails[0].value }).then((foundUser) => {
            loggedIn = true;

            if (foundUser) {
                console.log(" google user is found");
                // console.log(foundUser.firstName);
                done(null, foundUser);
            } else {
                console.log("google user didn't match");
                // console.log(profile.name.familyName);
                // console.log(profile.name.givenName);
                const user = new models.User({
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value
                });
                user.save().then((savedUser) => {
                    console.log(savedUser.firstName + " is saved to db");
                    done(null, savedUser);

                }).catch((err) => {
                    console.log(err);
                });


            }
        }).catch((err) => {
            console.log(err);
            done(err);
        });
    }
));

//console.log(process.env.FACEBOOK_APP_ID);
passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOK_APP_SECRET,
        callbackURL: "http://localhost:4000/auth/facebook/redirect"

    },
    function(accessToken, refreshToken, profile, cb) {
        /// console.log(profile);
        models.User.findOne({ email: profile.emails[0].value }).then((foundUser) => {
            loggedIn = true;
            if (foundUser) {
                console.log("facebook user is found");
                done(null, foundUser);
            } else {
                const user = new models.User({
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    username: profile.emails[0].value
                });
                user.save().then((savedUser) => {
                    console.log(savedUser + " is saved to db");
                    done(null, savedUser);

                }).catch((err) => {
                    console.log(err);
                });

                console.log("facebook user did not match");
            }

        }).catch((err) => {
            console.log(err);
            done(err);
        });
    }
));




app.get('/', function(req, res) {
    res.render('home', { status: loggedIn });
});

app.get('/latestJob', function(req, res) {
    models.LatestJob.find().then((latestJobArr) => {
        // console.log(latestJobArr);
        res.render('latestJob', { status: loggedIn, latestJobArray: latestJobArr });

    }).catch((err) => {
        console.log(err);
    });

});

app.use('/login', loginRoute);

app.get('/logout', function(req, res) {
    req.logout();
    loggedIn = false;
    res.redirect('/');
});

app.use('/signup', signupRoute);

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/redirect',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['profile', 'email'] })
);

app.get('/auth/facebook/redirect',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect to home page.
        res.redirect('/');
    });




app.get('/admitcard', function(req, res) {
    models.LatestAdmitCard.find({}, (err, foundLatestAdmitCard) => {
        if (!err) {
            models.ExpectedAdmitCard.find({}, (err, foundExpectedAdmitCard) => {
                if (!err) {
                    res.render('admitCard', {
                        status: loggedIn,
                        latestAdmitCardArray: foundLatestAdmitCard,
                        expectedAdmitCardtArray: foundExpectedAdmitCard
                    });
                }
            });
        }
    });
});

app.get('/answerkey', function(req, res) {
    models.LatestAnswerKey.find({}, (err, foundLatestAnskey) => {
        if (!err) {
            models.ExpectedAnswerKey.find({}, (err, foundExpectedAnskey) => {
                if (!err) {
                    res.render('answerKey', {
                        status: loggedIn,
                        latestAnskeyArray: foundLatestAnskey,
                        expectedAnskeytArray: foundExpectedAnskey
                    });
                }
            });
        }
    });
});

app.get('/results', function(req, res) {
    // var latestResultArr = [];
    // var expectedResultArr = [];
    // var boardResultArr = [];
    models.LatestResult.find({}, (err, foundLatestResults) => {
        if (!err) {
            // latestResultArr = foundLatestResults;
            models.ExpectedResult.find({}, (err, foundExpectedResults) => {
                if (!err) {
                    // expectedResultArr = foundExpectedResults;
                    //console.log(foundExpectedResults);
                    models.BoardResult.find({}, (err, foundBoardResults) => {
                        if (!err) {
                            // boardResultArr = foundBoardResults;
                            //console.log(foundBoardResults);
                            res.render('results', {
                                status: loggedIn,
                                latestResultArray: foundLatestResults,
                                expectedResultArray: foundExpectedResults,
                                boardResultArray: foundBoardResults
                            });
                        }
                    });
                }
            });

        }
    });


    //console.log(latestResultArr);

});

app.get('/competitiveExam', function(req, res) {
    models.CompetitiveExam.find().then((competitiveExamArr) => {
        // console.log(latestJobArr);
        res.render('competitiveExam', { status: loggedIn, Array: competitiveExamArr });

    }).catch((err) => {
        console.log(err);
    });

});


app.get('/admission', function(req, res) {

    models.Admission.find().then((admissionArr) => {
        // console.log(latestJobArr);
        res.render('admission', { status: loggedIn, Array: admissionArr });

    }).catch((err) => {
        console.log(err);
    });
})



app.listen(4000, function() {
    console.log("server is started at http://localhost:4000");

})