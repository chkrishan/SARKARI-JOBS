const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: Number,
    password: String

});


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
    descriptionLink: String
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
    description: String
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
    user: User,
    latestjob: LatestJob,
    latestresult: LatestResult,
    expectedResult: ExpectedResult,
    boardResult: BoardResult,
    latestAnswerKey: LatestAnswerKey,
    expectedAnswerKey: ExpectedAnswerKey,
    latestAdmitCard: LatestAdmitCard,
    expectedAdmitCard: ExpectedAdmitCard,
    competitiveExam: CompetitiveExam,
    admission: Admission
}

module.exports = models;