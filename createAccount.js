document.addEventListener("DOMContentLoaded", function () {
    const createAccountButton = document.getElementById("Confirm");
    let userName = document.getElementById("inputUsername");
    let Pword = document.getElementById("inputPassword");
    let sAnswer = document.getElementById("inputsAnswer");

    const socket = io(); // Initialize Socket.IO client

    createAccountButton.addEventListener("click", createAccount);

    function createAccount() {
        let newuname = userName.value;
        let newPword = Pword.value;
        let newsAnswer = sAnswer.value;
        console.log("Sending account data");

        async function saveNewAccount() {
            try {
                socket.emit('accountNew', { newuname, newPword, newsAnswer });
                console.log("Account data sent");
            } catch (error) {
                console.error("Error creating account:", error);
            }
        }

        saveNewAccount();
    }
});
