document.addEventListener("DOMContentLoaded", function () {
    let backButton = document.getElementById("back");
    let changeButton = document.getElementById("change");

    backButton.addEventListener("click", function() {
        window.location.href = "/login.html";
    });

    changeButton.addEventListener("click", async function() {
        let username = document.getElementById("uBox").value;
        let securityAnswer = document.getElementById("sQueBox").value;
        let newPassword = document.getElementById("nPassBox").value;

        try {
            const response = await fetch('/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, securityAnswer, newPassword })
            });

            if (response.ok) {
                alert('Password changed successfully');
                window.location.href = "/login.html";
            } else {
                throw new Error('Failed to change password');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error changing password');
        }
    });
});
