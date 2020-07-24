const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const models = require('./db/schema_modal');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/govermentJob', { useUnifiedTopology: true, useNewUrlParser: true });



app.get('/', function(req, res) {
    res.render('home');
});

app.get('/latestJob', function(req, res) {
    res.render('latestJob');
});

app.get('/login', function(req, res) {
    res.render('login');
})

app.get('/signup', function(req, res) {
    res.render('signup');
});

app.get('/admitcard', function(req, res) {
    res.render('admitCard');
});

app.get('/answerkey', function(req, res) {
    res.render('answerKey');
});

app.get('/results', function(req, res) {
    res.render('results');
});

app.get('/competitiveExam', function(req, res) {
    res.render('competitiveExam');
});


app.get('/admission', function(req, res) {
    res.render('admission');
})



app.listen(4000, function() {
    console.log("server is started at http://localhost:4000");

})