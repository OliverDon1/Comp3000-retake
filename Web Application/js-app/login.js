document.addEventListener("DOMContentLoaded", async function () {
    let accountData = undefined;
    let userNameBox = document.getElementById("usernameBox");
    let passwordBox = document.getElementById("passwordBox");
    document.getElementById("loginButton").addEventListener("click", changePageLogin);
    document.getElementById("createAccount").addEventListener("click", changePageCreateAccount);

    function changePageCreateAccount(){
        window.location.href = "/createAccount.html";
    }

    document.getElementById("forgotPassword").addEventListener("click", changePageForgotPassword);

    function changePageForgotPassword(){
        window.location.href = "/forgotPassword.html";
    }

    async function getAccounts(){
        const responseAccounts = await fetch('/getAccounts');
        if (!responseAccounts.ok) {
            throw new Error(`HTTP error! Status: ${responseAccounts.status}`);
        }
        accountData = await responseAccounts.json();
    }

    async function changePageLogin(){
        await getAccounts();
        let imessage = document.getElementById("incorrectMessage");
        imessage.style.visibility = "hidden";
        for(let x = 0; x < accountData.length; x++){
            if(userNameBox.value == accountData[x].username){
                if(passwordBox.value == accountData[x].password){
                    try {
                        const response = await fetch('/loginSuccess', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ username: accountData[x].username })
                        });
                        if (response.ok) {
                            sessionStorage.setItem('username', accountData[x].username);
                            window.location.href = "/mainPage.html";
                        } else {
                            throw new Error('Login failed');
                        }
                    } catch (error) {
                        console.error('Error sending username to server:', error);
                    }
                }
                else{
                    imessage.style.visibility = "visible";
                }
            }
            else{
                imessage.style.visibility = "visible";
            }
        }
    }
});
