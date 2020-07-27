const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phoneNumber: String,
    password: String

});

userSchema.plugin(passportLocalMongoose); //Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.
userSchema.plugin(findOrCreate);

const resultSchema = new mongoose.Schema({
    title: String,
    link: String
});

const expectedResultSchema = new mongoose.Schema({
    title: String,
    link: String,
    expectedDate: String
});

const latestJobSchema = new mongoose.Schema({
    title: String,
    startingDate: String,
    lastDate: String,
    eligiblity: String,
    applyLink: String,
    descriptionLink: String,
    vacancy: String
});


const competitiveExamSchema = new mongoose.Schema({
    title: String,
    startingDate: String,
    lastDate: String,
    applyLink: String,
    descriptionLink: String
});


const admissionSchema = new mongoose.Schema({
    title: String,
    startingDate: String,
    lastDate: String,
    descriptionLink: String,
    description: String,
    id: String
});


const User = new mongoose.model('User', userSchema);
const LatestResult = new mongoose.model('LatestResult', resultSchema);
const ExpectedResult = new mongoose.model('ExpectedResult', expectedResultSchema);
const BoardResult = new mongoose.model('BoardResult', resultSchema);
const LatestAnswerkey = new mongoose.model('LatestAnswerKey', resultSchema);
const ExpectedAnswerKey = new mongoose.model('ExpectedAnswerKey', expectedResultSchema);
const LatestAdmitCard = new mongoose.model('LatestAdmitCard', resultSchema);
const ExpectedAdmitCard = new mongoose.model('ExpectedAdmitCard', expectedResultSchema);
const LatestJob = new mongoose.model('LatestJob', latestJobSchema);
const CompetitiveExam = new mongoose.model('CompetitiveExam', competitiveExamSchema);
const Admission = new mongoose.model('Admission', admissionSchema);

const models = {
    User: User,
    LatestJob: LatestJob,
    LatestResult: LatestResult,
    ExpectedResult: ExpectedResult,
    BoardResult: BoardResult,
    LatestAnswerKey: LatestAnswerkey,
    ExpectedAnswerKey: ExpectedAnswerKey,
    LatestAdmitCard: LatestAdmitCard,
    ExpectedAdmitCard: ExpectedAdmitCard,
    CompetitiveExam: CompetitiveExam,
    Admission: Admission
}



module.exports = models;