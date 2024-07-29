from flask import Flask, request, jsonify
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pandas as pd

app = Flask(__name__)

# Load training data
data = pd.read_csv('Training.csv')  # Update path as necessary
X = data.drop(columns=['prognosis'])
y = data['prognosis']

# Initialize and fit the scaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Initialize and fit the KMeans model
n_clusters = len(y.unique())
kmeans = KMeans(n_clusters=n_clusters, random_state=0)
kmeans.fit(X_scaled)

# Create a mapping from clusters to prognosis
cluster_prognosis_mapping = {}
for cluster, prognosis in zip(kmeans.labels_, y):
    if cluster not in cluster_prognosis_mapping:
        cluster_prognosis_mapping[cluster] = prognosis

@app.route('/submitSymptoms', methods=['POST'])
def submit_symptoms():
    data = request.json
    symptoms = data.get('symptoms', [])
    if len(symptoms) != X.shape[1]:
        return jsonify({"error": f"Invalid input length. Expected {X.shape[1]} features, got {len(symptoms)}."}), 400
    try:
        newDataScaled = scaler.transform([symptoms])
        cluster = kmeans.predict(newDataScaled)[0]
        prognosis = cluster_prognosis_mapping.get(cluster, "Unknown")
        return jsonify({"diagnosis_cluster": int(cluster), "prognosis": prognosis})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
