const mongoose = require('mongoose'); // Ensure mongoose is required if not already done
const { accountData } = require('./accountSchema');

function insertdata(uname, pword, sque) {
    const newAccount = {
        Username: uname,
        Password: pword,
        sQuestion: sque,
        PD: []
    };
    const exampleInstance = new accountData(newAccount);
    exampleInstance.save((err, result) => {
        if (err) {
            console.error('Error saving to MongoDB:', err);
        } else {
            console.log('Data inserted successfully:', result);
        }
        mongoose.disconnect(); // Close the connection after insertion
    });
}

// Export the insertdata function
module.exports = { insertdata };
