document.addEventListener("DOMContentLoaded", async function () {
    let accountData = undefined;
    let userNameBox = document.getElementById("usernameBox");
    let passwordBox = document.getElementById("passwordBox");
    document.getElementById("loginButton").addEventListener("click",changePageLogin);
    document.getElementById("createAccount").addEventListener("click",changePageCreateAccount);
    function changePageCreateAccount(){
        window.location.href = "/createAccount.html";
    }
    document.getElementById("forgotPassword").addEventListener("click",changePageForgotPassword);
    function changePageForgotPassword(){
        window.location.href = "/forgotPassword.html";
    }
    async function getAccounts(){
        const responseBooks = await fetch('/getAccounts');
        if (!responseBooks.ok) {
            throw new Error(`HTTP error! Status: ${responseBooks.status}`);
        }
        accountData = await responseBooks.json();
        
        const responseAccounts = await fetch('/getAccounts');
        if (!responseAccounts.ok) {
            throw new Error(`HTTP error! Status: ${responseAccounts.status}`);
        }
        accountsData = await responseAccounts.json();
    }
    function changePageLogin(){
        getAccounts();
        for(let x = 0; x<accountData.length;x++){
            if(userNameBox.value == accountData[x].username){
                if(passwordBox.value == accountData[x].password){
                    window.location.href = "/mainPage.html";
                }
            }
        }
    }
})