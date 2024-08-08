document.addEventListener("DOMContentLoaded", async function () {
    async function checkSession() {
        try {
            const response = await fetch('/loggedInUsers');
            if (response.ok) {
                const loggedInUsers = await response.json();
                const username = sessionStorage.getItem('username');
                if (!loggedInUsers.includes(username)) {
                    window.location.href = "/login.html";
                }
            } else {
                throw new Error('Failed to check session');
            }
        } catch (error) {
            console.error('Error:', error);
            window.location.href = "/login.html";
        }
    }
    checkSession();
    let newDiagnosisButton = document.getElementById("newDiagnosis");
    let logoutButton = document.getElementById("Logout");
    let preDiagnosis = document.getElementById("preDiagnosis");
    
    newDiagnosisButton.addEventListener("click", goToDiagnosisPage);
    logoutButton.addEventListener("click", logout);

    function goToDiagnosisPage() {
        window.location.href = "/newDiagnosis.html";
    }

    async function logout() {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                sessionStorage.removeItem('username');
                window.location.href = "/login.html";
            } else {
                throw new Error('Failed to logout');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    let accountData = undefined;
    let loggedInUsers = undefined;

    await fetchLoggedInUsers();
    await populatePreDiagnosis();

    async function populatePreDiagnosis() {
        const responseAccounts = await fetch('/getAccounts');
        if (!responseAccounts.ok) {
            throw new Error(`HTTP error! Status: ${responseAccounts.status}`);
        }
        accountData = await responseAccounts.json();
        const username = sessionStorage.getItem('username');
        const userAccount = accountData.find(account => account.username === username);

        if (userAccount && userAccount.PD) {
            userAccount.PD.forEach(preD => {
                let element = document.createElement("div");
                element.className = "symptom";
                element.innerHTML = `<div>${preD.replace(/([A-Z])/g, ' $1').trim()}</div>`;
                preDiagnosis.appendChild(element);
            });
        }
    }

    async function fetchLoggedInUsers() {
        try {
            const response = await fetch('/loggedInUsers');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            loggedInUsers = await response.json();
            console.log('Logged-in users:', loggedInUsers);
        } catch (error) {
            console.error('Error fetching logged-in users:', error);
        }
    }
});
