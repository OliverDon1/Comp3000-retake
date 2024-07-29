document.addEventListener("DOMContentLoaded", async function () {
    let container = document.getElementById("newDiagnosis");
    let newDiagnosisButton = document.getElementById("Calculate");
    let chosenDiagnosis = document.getElementById("cDiagnosis");
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
    let newsymptons = Array(symptoms.length).fill(0);
    symptoms.forEach(symptom => {
        let element = document.createElement("div");
        element.className = "symptom";
        element.id = symptom;
        element.innerHTML = `<div id="${symptom}">${symptom.replace(/([A-Z])/g, ' $1').trim()}</div>`;
        container.appendChild(element);
        element.addEventListener("click", symptomChange);
    });

    function symptomChange(event) {
       
        for(let x = 0; x <symptoms.length;x++){
            if(event.currentTarget.id == symptoms[x]){
                if(newsymptons[x] === 0){
                    newsymptons[x] = 1;
                } 
                else{
                    newsymptons[x] = 0;
                }
                console.log(newsymptons);
                break;
            }
        }
        if (event.currentTarget.style.color != 'green') {
            event.currentTarget.style.color = 'green';
        } else {
            event.currentTarget.style.color = 'black';
        }
        
    }
    async function sendSymptoms() {
        try {
            const response = await fetch('/submitSymptoms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ symptoms: newsymptons })
            });
    
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
    
            // Try parsing the response as JSON
            const data = await response.json();
            console.log('Parsed JSON response:', data);
            chosenDiagnosis.textContent = `Diagnosis: ${data.prognosis}`;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    newDiagnosisButton.addEventListener("click", sendSymptoms);    
});