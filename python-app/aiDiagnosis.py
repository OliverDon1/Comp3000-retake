from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from collections import defaultdict
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# Load training data
data = pd.read_csv('Training.csv')  # Update path as necessary
X = data.drop(columns=['prognosis'])
y = data['prognosis']

# Standardize the data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Custom KMeans implementation
class CustomKMeans:
    def __init__(self, n_clusters, max_iter=300, tol=1e-4):
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        self.tol = tol
        self.centroids = None

    def fit(self, X):
        np.random.seed(0)
        # Initialize centroids randomly from the data points
        initial_indices = np.random.choice(len(X), self.n_clusters, replace=False)
        self.centroids = X[initial_indices]

        for i in range(self.max_iter):
            # Assign clusters based on the closest centroid
            clusters = self._assign_clusters(X)
            # Calculate new centroids
            new_centroids = np.array([X[clusters == k].mean(axis=0) for k in range(self.n_clusters)])

            # Check for convergence
            if np.linalg.norm(self.centroids - new_centroids) < self.tol:
                break
            self.centroids = new_centroids

    def _assign_clusters(self, X):
        distances = np.linalg.norm(X[:, np.newaxis] - self.centroids, axis=2)
        return np.argmin(distances, axis=1)

    def predict(self, X):
        clusters = self._assign_clusters(X)
        return clusters

n_clusters = len(y.unique())
kmeans = CustomKMeans(n_clusters=n_clusters)
kmeans.fit(X_scaled)

# Create a mapping from clusters to prognosis
cluster_prognosis_mapping = defaultdict(list)
for cluster, prognosis in zip(kmeans.predict(X_scaled), y):
    cluster_prognosis_mapping[cluster].append(prognosis)

# Use the most frequent prognosis in each cluster
for cluster in cluster_prognosis_mapping:
    cluster_prognosis_mapping[cluster] = max(set(cluster_prognosis_mapping[cluster]), key=cluster_prognosis_mapping[cluster].count)

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
