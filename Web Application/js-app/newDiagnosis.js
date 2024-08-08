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

    let container = document.getElementById("newDiagnosis");
    let newDiagnosisButton = document.getElementById("Calculate");
    let chosenDiagnosis = document.getElementById("cDiagnosis");
    let goBack = document.getElementById("Back");
    let saveDiagnosisButton = document.getElementById("Save");
    let loggedInUsers = undefined;
    let accountData = undefined;
    let newDiagnosis = undefined;

    goBack.addEventListener("click", returnToMainPage);
    saveDiagnosisButton.addEventListener("click", saveDiagnosis);

    const symptoms = [
        "Itching", "Skin Rash", "Nodal Skin Eruptions", "Continuous Sneezing", "Shivering",
        "Chills", "Joint Pain", "Stomach Pain", "Acidity", "Ulcers on Tongue", "Muscle Wasting",
        "Vomiting", "Burning Micturition", "Spotting Urination", "Fatigue", "Weight Gain",
        "Anxiety", "Cold Hands and Feets", "Mood Swings", "Weight Loss", "Restlessness",
        "Lethargy", "Patches in Throat", "Irregular Sugar Level", "Cough", "High Fever",
        "Sunken Eyes", "Breathlessness", "Sweating", "Dehydration", "Indigestion",
        "Headache", "Yellowish Skin", "Dark Urine", "Nausea", "Loss of Appetite",
        "Pain Behind the Eyes", "Back Pain", "Constipation", "Abdominal Pain", "Diarrhoea",
        "Mild Fever", "Yellow Urine", "Yellowing of Eyes", "Acute Liver Failure", "Fluid Overload",
        "Swelling of Stomach", "Swelled Lymph Nodes", "Malaise", "Blurred and Distorted Vision",
        "Phlegm", "Throat Irritation", "Redness of Eyes", "Sinus Pressure", "Runny Nose",
        "Congestion", "Chest Pain", "Weakness in Limbs", "Fast Heart Rate", "Pain During Bowel Movements",
        "Pain in Anal Region", "Bloody Stool", "Irritation in Anus", "Neck Pain", "Dizziness",
        "Cramps", "Bruising", "Obesity", "Swollen Legs", "Swollen Blood Vessels",
        "Puffy Face and Eyes", "Enlarged Thyroid", "Brittle Nails", "Swollen Extremities",
        "Excessive Hunger", "Extra Marital Contacts", "Drying and Tingling Lips", "Slurred Speech",
        "Knee Pain", "Hip Joint Pain", "Muscle Weakness", "Stiff Neck", "Swelling Joints",
        "Movement Stiffness", "Spinning Movements", "Loss of Balance", "Unsteadiness",
        "Weakness of One Body Side", "Loss of Smell", "Bladder Discomfort", "Foul Smell of Urine",
        "Continuous Feel of Urine", "Passage of Gases", "Internal Itching", "Toxic Look",
        "Depression", "Irritability", "Muscle Pain", "Altered Sensorium", "Red Spots Over Body",
        "Belly Pain", "Abnormal Menstruation", "Dischromic Patches", "Watering From Eyes",
        "Increased Appetite", "Polyuria", "Family History", "Mucoid Sputum", "Rusty Sputum",
        "Lack of Concentration", "Visual Disturbances", "Receiving Blood Transfusion",
        "Receiving Unsterile Injections", "Coma", "Stomach Bleeding", "Distention of Abdomen",
        "History of Alcohol Consumption", "Blood in Sputum", "Prominent Veins on Calf",
        "Palpitations", "Painful Walking", "Pus Filled Pimples", "Blackheads", "Scarring",
        "Skin Peeling", "Silver Like Dusting", "Small Dents in Nails", "Inflammatory Nails",
        "Blister", "Red Sore Around Nose", "Yellow Crust Ooze"
    ];

    let newsymptoms = Array(symptoms.length).fill(0);

    symptoms.forEach(symptom => {
        let element = document.createElement("div");
        element.className = "symptom";
        element.id = symptom;
        element.innerHTML = `<div id="${symptom}">${symptom.replace(/([A-Z])/g, ' $1').trim()}</div>`;
        container.appendChild(element);
        element.addEventListener("click", symptomChange);
    });

    function returnToMainPage() {
        window.location.href = "/mainPage.html";
    }

    function symptomChange(event) {
        for (let x = 0; x < symptoms.length; x++) {
            if (event.currentTarget.id == symptoms[x]) {
                newsymptoms[x] = newsymptoms[x] === 0 ? 1 : 0;
                break;
            }
        }
        event.currentTarget.style.color = event.currentTarget.style.color != 'green' ? 'green' : 'black';
    }

    async function sendSymptoms() {
        try {
            console.log('Sending symptoms:', newsymptoms);
            const response = await fetch('/submitSymptoms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ symptoms: newsymptoms })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received data:', data);
            newDiagnosis = data.prognosis;
            chosenDiagnosis.textContent = `Diagnosis: ${data.prognosis}`;
        } catch (error) {
            console.error('Error:', error);
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

    async function getAllUserData() {
        try {
            const responseAccounts = await fetch('/getAccounts');
            if (!responseAccounts.ok) {
                throw new Error(`HTTP error! Status: ${responseAccounts.status}`);
            }
            accountData = await responseAccounts.json();
            console.log('Account data:', accountData);
        } catch (error) {
            console.error('Error fetching account data:', error);
        }
    }

    async function saveDiagnosis() {
        await fetchLoggedInUsers();
        await getAllUserData();

        const username = loggedInUsers[0]; // Assuming only one user is logged in at a time
        const userAccount = accountData.find(account => account.username === username);

        if (userAccount) {
            userAccount.PD.push(newDiagnosis); // Assuming PD is an array

            try {
                const response = await fetch("/accountChange", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: userAccount.username,
                        password: userAccount.password,
                        sQuestion: userAccount.sQuestion,
                        PD: userAccount.PD,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                const data = await response.json();
                console.log('Account updated successfully:', data);
            } catch (error) {
                console.error('Error updating account:', error);
            }
        } else {
            console.error('Logged-in user not found in account data');
        }
    }

    newDiagnosisButton.addEventListener("click", sendSymptoms);
});
