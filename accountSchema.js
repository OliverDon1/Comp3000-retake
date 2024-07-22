const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
    username: String,
    password: String,
    sQuestion: String,
    PD: [String]
});
const Accounts = mongoose.model('Accounts', accountSchema);
module.exports = { Accounts };
