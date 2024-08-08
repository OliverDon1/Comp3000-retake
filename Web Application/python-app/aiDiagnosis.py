from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from collections import defaultdict
from sklearn.preprocessing import StandardScaler
app = Flask(__name__)
data = pd.read_csv('Training.csv')
X = data.drop(columns=['prognosis'])
y = data['prognosis']
scaler = StandardScaler()
xScaled = scaler.fit_transform(X)
class CustomKMeans:
    def __init__(self, nClusters, maxIter=300, tol=1e-4):
        self.nClusters = nClusters
        self.maxIter = maxIter
        self.tol = tol
        self.centroids = None
    def fit(self, X):
        np.random.seed(0)
        initial_indices = np.random.choice(len(X), self.nClusters, replace=False)
        self.centroids = X[initial_indices]
        for i in range(self.maxIter):
            clusters = self._assign_clusters(X)
            newCentroids = []
            for k in range(self.nClusters):
                cluster_points = X[clusters == k]
                if len(cluster_points) > 0:
                    newCentroids.append(cluster_points.mean(axis=0))
                else:
                    newCentroids.append(X[np.random.choice(len(X))])
            newCentroids = np.array(newCentroids)
            if np.linalg.norm(self.centroids - newCentroids) < self.tol:
                break
            self.centroids = newCentroids
    def _assign_clusters(self, X):
        distances = np.linalg.norm(X[:, np.newaxis] - self.centroids, axis=2)
        return np.argmin(distances, axis=1)
    def predict(self, X):
        clusters = self._assign_clusters(X)
        return clusters
@app.route('/submitSymptoms', methods=['POST'])
def submit_symptoms():
    data = request.json
    symptoms = data.get('symptoms', [])
    if len(symptoms) != X.shape[1]:
        return jsonify({"error": f"Invalid input length. Expected {X.shape[1]} features, got {len(symptoms)}."}), 400

    try:
        nClusters = len(y.unique())
        kmeans = CustomKMeans(nClusters=nClusters)
        kmeans.fit(xScaled)
        cluster_prognosis_mapping = defaultdict(list)
        for cluster, prognosis in zip(kmeans.predict(xScaled), y):
            cluster_prognosis_mapping[cluster].append(prognosis)
        for cluster in cluster_prognosis_mapping:
            cluster_prognosis_mapping[cluster] = max(set(cluster_prognosis_mapping[cluster]), key=cluster_prognosis_mapping[cluster].count)
        
        new_data_scaled = scaler.transform([symptoms])
        cluster = kmeans.predict(new_data_scaled)[0]
        prognosis = cluster_prognosis_mapping.get(cluster, "Unknown")
        print(f"Symptoms: {symptoms}")
        print(f"Scaled Symptoms: {new_data_scaled}")
        print(f"Predicted Cluster: {cluster}")
        print(f"Prognosis: {prognosis}")
        
        return jsonify({"diagnosis_cluster": int(cluster), "prognosis": prognosis})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
