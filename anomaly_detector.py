import cv2
import numpy as np
import os
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
import matplotlib.pyplot as plt
from PIL import Image
import tensorflow as tf
from tensorflow import keras
from typing import List, Tuple, Dict
import json

class CivicAnomalyDetector:
    """
    A civic infrastructure anomaly detection system designed to aid city management
    by identifying issues such as potholes, broken streetlights, and more.
    Customizable and extendable to fit unique urban needs.
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize the civic anomaly detector.
        
        Args:
            model_path (str): Path to pre-trained model (optional)
        """
        self.feature_extractor = None
        self.anomaly_model = None
        self.scaler = StandardScaler()
        self.anomaly_types = {
            'pothole': 0,
            'broken_streetlight': 1,
            'damaged_sign': 2,
            'graffiti': 3,
            'debris': 4,
            'cracked_pavement': 5,
            'other': 6
        }
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
        else:
            self.initialize_models()
    
    def initialize_models(self):
        """Initialize the anomaly detection models."""
        # Initialize Isolation Forest for anomaly detection
        self.anomaly_model = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100
        )
        
        # Initialize feature extractor (using a simple CNN)
        self.feature_extractor = self._build_feature_extractor()
    
    def _build_feature_extractor(self):
        """Build a CNN feature extractor for image analysis."""
        model = keras.Sequential([
            keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(128, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Flatten(),
            keras.layers.Dense(256, activation='relu'),
            keras.layers.Dropout(0.5),
            keras.layers.Dense(128, activation='relu')
        ])
        
        model.compile(optimizer='adam', loss='mse')
        return model
    
    def preprocess_image(self, image_path: str) -> np.ndarray:
        """
        Preprocess an image for anomaly detection.
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            np.ndarray: Preprocessed image array
        """
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image from {image_path}")
        
        # Convert BGR to RGB
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Resize to standard size
        image = cv2.resize(image, (224, 224))
        
        # Normalize pixel values
        image = image.astype(np.float32) / 255.0
        
        return image
    
    def extract_features(self, image: np.ndarray) -> np.ndarray:
        """
        Extract features from an image using traditional computer vision techniques.
        
        Args:
            image (np.ndarray): Input image
            
        Returns:
            np.ndarray: Feature vector
        """
        features = []
        
        # Convert to grayscale for some features
        gray = cv2.cvtColor((image * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
        
        # 1. Edge detection features
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges) / (edges.shape[0] * edges.shape[1])
        features.append(edge_density)
        
        # 2. Texture features using Local Binary Patterns
        def local_binary_pattern(image, radius=3, n_points=24):
            """Simple LBP implementation."""
            lbp = np.zeros_like(image)
            for i in range(radius, image.shape[0] - radius):
                for j in range(radius, image.shape[1] - radius):
                    center = image[i, j]
                    code = 0
                    for k in range(min(n_points, 8)):  # Limit to 8 points to prevent overflow
                        angle = 2 * np.pi * k / n_points
                        x = int(i + radius * np.cos(angle))
                        y = int(j + radius * np.sin(angle))
                        if 0 <= x < image.shape[0] and 0 <= y < image.shape[1]:
                            if image[x, y] >= center:
                                code |= (1 << k)
                    lbp[i, j] = code
            return lbp
        
        lbp = local_binary_pattern(gray)
        lbp_hist, _ = np.histogram(lbp, bins=256, range=(0, 256))
        lbp_hist = lbp_hist / np.sum(lbp_hist)  # Normalize
        features.extend(lbp_hist[:10])  # Use first 10 bins
        
        # 3. Color features
        color_hist = []
        for channel in range(3):
            hist, _ = np.histogram(image[:, :, channel], bins=16, range=(0, 1))
            hist = hist / np.sum(hist)
            color_hist.extend(hist[:8])  # Use first 8 bins per channel
        features.extend(color_hist)
        
        # 4. Contour features
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contour_count = len(contours)
        features.append(contour_count)
        
        # 5. Mean and standard deviation of pixel values
        for channel in range(3):
            features.append(np.mean(image[:, :, channel]))
            features.append(np.std(image[:, :, channel]))
        
        return np.array(features)
    
    def train(self, image_paths: List[str], labels: List[int] = None):
        """
        Train the anomaly detector on a dataset of civic images.
        
        Args:
            image_paths (List[str]): List of paths to training images
            labels (List[int]): Optional labels for supervised learning
        """
        features_list = []
        
        print(f"Processing {len(image_paths)} images for training...")
        
        for i, image_path in enumerate(image_paths):
            try:
                # Preprocess image
                image = self.preprocess_image(image_path)
                
                # Extract features
                features = self.extract_features(image)
                features_list.append(features)
                
                if (i + 1) % 10 == 0:
                    print(f"Processed {i + 1}/{len(image_paths)} images")
                    
            except Exception as e:
                print(f"Error processing {image_path}: {e}")
                continue
        
        if not features_list:
            raise ValueError("No valid images found for training")
        
        # Convert to numpy array
        X = np.array(features_list)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train anomaly detection model
        self.anomaly_model.fit(X_scaled)
        
        print("Training completed successfully!")
    
    def detect_anomalies(self, image_path: str) -> Dict:
        """
        Detect anomalies in a single image.
        
        Args:
            image_path (str): Path to the image to analyze
            
        Returns:
            Dict: Detection results including anomaly score and type
        """
        if self.anomaly_model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        # Preprocess image
        image = self.preprocess_image(image_path)
        
        # Extract features
        features = self.extract_features(image)
        
        # Scale features
        features_scaled = self.scaler.transform(features.reshape(1, -1))
        
        # Predict anomaly
        anomaly_score = self.anomaly_model.decision_function(features_scaled)[0]
        is_anomaly = self.anomaly_model.predict(features_scaled)[0] == -1
        
        # Additional analysis for anomaly type classification
        anomaly_type = self._classify_anomaly_type(image, features)
        
        return {
            'image_path': image_path,
            'is_anomaly': is_anomaly,
            'anomaly_score': float(anomaly_score),
            'anomaly_type': anomaly_type,
            'confidence': abs(anomaly_score)
        }
    
    def _classify_anomaly_type(self, image: np.ndarray, features: np.ndarray) -> str:
        """
        Classify the type of anomaly detected.
        
        Args:
            image (np.ndarray): Input image
            features (np.ndarray): Extracted features
            
        Returns:
            str: Anomaly type classification
        """
        # Heuristic-based anomaly classification
        # Further customization can be added according to city-specific requirements
        
        # Convert to grayscale
        gray = cv2.cvtColor((image * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
        
        # Edge density (first feature)
        edge_density = features[0]
        
        # Color variance
        color_std = np.mean(features[-6::2])  # Every other feature from color stats
        
        # Contour count
        contour_count = features[35]  # Contour feature position
        
        # Simple classification rules
        if edge_density > 0.1 and contour_count > 50:
            return 'cracked_pavement'
        elif color_std < 0.1 and edge_density < 0.05:
            return 'broken_streetlight'
        elif contour_count > 100:
            return 'debris'
        elif color_std > 0.2:
            return 'graffiti'
        elif edge_density > 0.05 and contour_count < 20:
            return 'pothole'
        else:
            return 'other'
    
    def batch_detect(self, image_folder: str) -> List[Dict]:
        """
        Detect anomalies in a batch of images.
        
        Args:
            image_folder (str): Path to folder containing images
            
        Returns:
            List[Dict]: List of detection results
        """
        results = []
        
        # Get all image files
        image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']
        image_paths = []
        
        for file in os.listdir(image_folder):
            if any(file.lower().endswith(ext) for ext in image_extensions):
                image_paths.append(os.path.join(image_folder, file))
        
        print(f"Processing {len(image_paths)} images...")
        
        for i, image_path in enumerate(image_paths):
            try:
                result = self.detect_anomalies(image_path)
                results.append(result)
                
                if (i + 1) % 10 == 0:
                    print(f"Processed {i + 1}/{len(image_paths)} images")
                    
            except Exception as e:
                print(f"Error processing {image_path}: {e}")
                continue
        
        return results
    
    def visualize_results(self, results: List[Dict], output_folder: str = None):
        """
        Visualize anomaly detection results.
        
        Args:
            results (List[Dict]): Detection results
            output_folder (str): Optional folder to save visualizations
        """
        if output_folder and not os.path.exists(output_folder):
            os.makedirs(output_folder)
        
        anomaly_results = [r for r in results if r['is_anomaly']]
        
        if not anomaly_results:
            print("No anomalies detected to visualize.")
            return
        
        # Create summary plot
        fig, axes = plt.subplots(2, 3, figsize=(15, 10))
        fig.suptitle('Civic Infrastructure Anomaly Detection Results', fontsize=16)
        
        for i, result in enumerate(anomaly_results[:6]):  # Show first 6 anomalies
            row = i // 3
            col = i % 3
            
            # Load and display image
            image = cv2.imread(result['image_path'])
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            axes[row, col].imshow(image)
            axes[row, col].set_title(f"Type: {result['anomaly_type']}\nScore: {result['anomaly_score']:.3f}")
            axes[row, col].axis('off')
        
        # Hide unused subplots
        for i in range(len(anomaly_results), 6):
            row = i // 3
            col = i % 3
            axes[row, col].axis('off')
        
        plt.tight_layout()
        
        if output_folder:
            plt.savefig(os.path.join(output_folder, 'anomaly_summary.png'), dpi=300, bbox_inches='tight')
        
        plt.show()
    
    def save_model(self, model_path: str):
        """Save the trained model."""
        model_data = {
            'scaler': self.scaler,
            'anomaly_model': self.anomaly_model,
            'anomaly_types': self.anomaly_types
        }
        
        # Save using joblib for sklearn models
        import joblib
        joblib.dump(model_data, model_path)
        print(f"Model saved to {model_path}")
    
    def load_model(self, model_path: str):
        """Load a trained model."""
        import joblib
        model_data = joblib.load(model_path)
        
        self.scaler = model_data['scaler']
        self.anomaly_model = model_data['anomaly_model']
        self.anomaly_types = model_data['anomaly_types']
        
        print(f"Model loaded from {model_path}")
    
    def generate_report(self, results: List[Dict], output_path: str = None):
        """
        Generate a detailed report of anomaly detection results.
        
        Args:
            results (List[Dict]): Detection results
            output_path (str): Optional path to save the report
        """
        report = {
            'total_images': len(results),
            'anomalies_detected': sum(1 for r in results if r['is_anomaly']),
            'anomaly_types': {},
            'summary_stats': {},
            'detailed_results': results
        }
        
        # Count anomaly types
        for result in results:
            if result['is_anomaly']:
                anomaly_type = result['anomaly_type']
                if anomaly_type not in report['anomaly_types']:
                    report['anomaly_types'][anomaly_type] = 0
                report['anomaly_types'][anomaly_type] += 1
        
        # Calculate summary statistics
        anomaly_scores = [r['anomaly_score'] for r in results if r['is_anomaly']]
        if anomaly_scores:
            report['summary_stats'] = {
                'mean_anomaly_score': np.mean(anomaly_scores),
                'std_anomaly_score': np.std(anomaly_scores),
                'min_anomaly_score': np.min(anomaly_scores),
                'max_anomaly_score': np.max(anomaly_scores)
            }
        
        # Save report
        if output_path:
            with open(output_path, 'w') as f:
                json.dump(report, f, indent=2)
            print(f"Report saved to {output_path}")
        
        return report
