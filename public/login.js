document.getElementById("loginButton").addEventListener("click",changePageLogin);
function changePageLogin(){
    window.location.href = "/mainPage.html";
}
document.getElementById("createAccount").addEventListener("click",changePageCreateAccount);
function changePageCreateAccount(){
    window.location.href = "/createAccount.html";
}
document.getElementById("forgotPassword").addEventListener("click",changePageForgotPassword);
function changePageForgotPassword(){
    window.location.href = "/forgotPassword.html";
}