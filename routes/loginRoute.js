const express = require('express');
const router = require('express').Router();

const models = require('../db/schema_modal');
const bcrypt = require('bcrypt');

router
    .get('/', (req, res) => {
        res.render('login.ejs');
    })
    .post('/', (req, res) => {
        // res.send("login post request...");
        models.User.findOne({ email: req.body.email }, function(err, foundUser) {

            if (err) {
                console.log(err);
            } else {
                if (foundUser) {
                    bcrypt.compare(req.body.password, foundUser.password, function(err, match) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render('home.ejs', { status: true });
                        }
                    })
                } else {
                    res.send("email or password is incorrect !! please try again");
                }
            }

        })
    })


module.exports = router;