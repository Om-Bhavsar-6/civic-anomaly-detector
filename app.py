from flask import Flask, request, jsonify, render_template
from anomaly_detector import AnomalyDetector
import os

app = Flask(__name__)
detector = AnomalyDetector()

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

# ...existing API endpoints...

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)