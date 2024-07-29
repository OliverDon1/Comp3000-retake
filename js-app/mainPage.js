document.addEventListener("DOMContentLoaded", async function () {
    let newD = document.getElementById("newDiagnosis");
    newD.addEventListener("click",newDchange);
    function newDchange(){
        window.location.href = "/newDiagnosis.html";
    }
});
