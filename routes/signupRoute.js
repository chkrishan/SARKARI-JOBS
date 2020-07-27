const express = require('express');
const router = express.Router();
const model = require('../db/schema_modal');
const bcrypt = require('bcrypt');
const { models } = require('mongoose');
const saltRounds = 10;

router
    .get('/', (req, res) => {
        res.render('signup.ejs');
    })
    .post('/', (req, res) => {
        models.User.findOne({ email: req.body.email }).then((result) => {
            if (result) {
                console.log("email is already register");
                res.render('signup');
            } else {

                if (req.body.password === req.body.confirmPassword) {

                    bcrypt.hash(req.body.password, saltRounds, function(err, hashedPassword) {
                        //
                        //console.log(hashedPassword);
                        const user = new model.User({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            phoneNumber: req.body.phoneNumber,
                            email: req.body.email,
                            password: hashedPassword
                        });

                        user.save()
                            .then((savedUser) => {
                                console.log(savedUser.firstName + " is saved in database");
                                res.render('home.ejs', { status: true });
                            }).catch((err) => {
                                console.log(err);
                            });
                    })

                } else {
                    console.log("password and confirm password didn't match !! or email is already registeredpleae try again ");
                    res.render('signup.ejs');
                }

            }

        }).catch((err) => {

        });

    })

module.exports = router;