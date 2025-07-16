from flask import Flask, request, jsonify
from anomaly_detector import AnomalyDetector
import os
import tempfile
import base64
import cv2
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)
detector = AnomalyDetector()

# Configure upload settings
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': detector.model is not None
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    """Analyze a single image for anomalies"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    try:
        # Create temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save file
            filename = secure_filename(file.filename)
            filepath = os.path.join(temp_dir, filename)
            file.save(filepath)
            
            # Analyze image
            results = detector.analyze_folder(temp_dir)
            
            if isinstance(results, dict) and 'error' in results:
                return jsonify({'error': results['error']}), 400
            
            if results and len(results) > 0:
                return jsonify({
                    'filename': results[0]['filename'],
                    'anomaly_score': results[0]['anomaly_score'],
                    'is_anomaly': results[0]['is_anomaly'],
                    'features': results[0]['features']
                })
            else:
                return jsonify({'error': 'Analysis failed'}), 500
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-batch', methods=['POST'])
def analyze_batch():
    """Analyze multiple images for anomalies"""
    if 'images[]' not in request.files:
        return jsonify({'error': 'No images provided'}), 400
    
    files = request.files.getlist('images[]')
    
    if not files:
        return jsonify({'error': 'No files selected'}), 400
    
    try:
        # Create temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save all files
            for file in files:
                if file.filename != '' and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    filepath = os.path.join(temp_dir, filename)
                    file.save(filepath)
            
            # Analyze directory
            results = detector.analyze_folder(temp_dir)
            
            if isinstance(results, dict) and 'error' in results:
                return jsonify({'error': results['error']}), 400
            
            return jsonify({
                'results': results,
                'summary': detector.get_summary()
            })
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/train', methods=['POST'])
def train_model():
    """Train the anomaly detection model"""
    try:
        result = detector.train_model()
        return jsonify({'message': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-base64', methods=['POST'])
def analyze_base64():
    """Analyze an image provided as base64 string"""
    if not request.json or 'image' not in request.json:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Decode base64 image
        img_data = base64.b64decode(request.json['image'])
        nparr = np.frombuffer(img_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({'error': 'Invalid image data'}), 400
        
        # Create temporary directory and save image
        with tempfile.TemporaryDirectory() as temp_dir:
            filepath = os.path.join(temp_dir, 'image.jpg')
            cv2.imwrite(filepath, image)
            
            # Analyze image
            results = detector.analyze_folder(temp_dir)
            
            if isinstance(results, dict) and 'error' in results:
                return jsonify({'error': results['error']}), 400
            
            if results and len(results) > 0:
                return jsonify({
                    'filename': results[0]['filename'],
                    'anomaly_score': results[0]['anomaly_score'],
                    'is_anomaly': results[0]['is_anomaly'],
                    'features': results[0]['features']
                })
            else:
                return jsonify({'error': 'Analysis failed'}), 500
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)