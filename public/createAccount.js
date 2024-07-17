const createAccountbutton = document.getElementById("Confirm");
let userName = document.getElementById("inputUsername");
let Pword = document.getElementById("inputPassword");
let sAnswer = document.getElementById("inputsAnswer");

// Import the insertdata function from accountinsert.js
const { insertdata } = require('./accountinsert');

createAccountbutton.addEventListener("click", createaccount);

function createaccount() {
    let newuname = userName.value;
    let newPword = Pword.value;
    let newsAnswer = sAnswer.value;

    // Call the insertdata function
    insertdata(newuname, newPword, newsAnswer);
}
