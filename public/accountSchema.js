const mongoose = require('mongoose');
const dbURL = "mongodb+srv://its0ll13:L2NcI9fvJTij0TIV@drai.t9pvqty.mongodb.net/";
console.log("test");
mongoose.connect(dbURL,{userNewUrlParser: true, useUnifiedToplogy: true});
const accountSchema = new mongoose.Schema({
    Username : String,
    Password : String,
    sQuestion: String,
    PD : [String]
});
module.exports = {accountSchema};