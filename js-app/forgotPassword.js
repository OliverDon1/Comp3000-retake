document.addEventListener("DOMContentLoaded", async function () {
    let accountData;
    let backButton = document.getElementById("back");
    let confirmButton = document.getElementById("change");
    let uBoxInput = document.getElementById("uBox");
    let qBoxInput = document.getElementById("sQueBox");
    let nPBox = document.getElementById("nPassBox");
    try {
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
        
        confirmButton.addEventListener("click", updatepassword);
        
        async function updatepassword() {
            console.log(accountData);
            for (let x = 0; x < accountData.length; x++) {
                if (accountData[x].username == uBoxInput.value) {
                    if (accountData[x].sQuestion == qBoxInput.value) {
                        let name = accountData[x].username;
                        let password = nPBox.value;
                        let sQue = accountData[x].sQuestion;
                        let nPD = accountData[x].PD;
                        
                        try {
                            console.log(name);
                            const response = await fetch("/accountChange", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    username: name,
                                    password: password,
                                    sQuestion: sQue,
                                    PD: nPD,
                                }),
                            });
                            
                            if (response.ok) {
                                const result = await response.json();
                                console.log(result.message);
                                window.location.href = "/login.html";
                            } else {
                                const error = await response.json();
                                console.error(error.error);
                            }
                        } catch (error) {
                            console.error("Error updating account:", error);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
    backButton.addEventListener("click",backButtons());
    function backButtons(){
        window.location.href = "/login.html";
    }
});
