"""
Civic Anomaly Detector Module
This module provides functionality to detect anomalies in civic infrastructure images.
"""

import os
import cv2
import numpy as np
from pathlib import Path
import json
from datetime import datetime

class AnomalyDetector:
    def __init__(self):
        self.normal_images_path = "sample_data/normal"
        self.anomaly_images_path = "sample_data/anomalies"
        self.results = []
        self.model = None
        self.model_path = "anomaly_model.pkl"
        self.use_ml = False
        
    def load_images_from_folder(self, folder_path):
        """Load all images from a given folder"""
        supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif')
        images = []
        filenames = []
        
        # Check if folder exists
        if not os.path.exists(folder_path):
            print(f"Warning: Folder {folder_path} does not exist")
            return images, filenames
        
        try:
            for filename in os.listdir(folder_path):
                if filename.lower().endswith(supported_formats):
                    img_path = os.path.join(folder_path, filename)
                    try:
                        img = cv2.imread(img_path)
                        if img is not None:
                            images.append(img)
                            filenames.append(filename)
                        else:
                            print(f"Warning: Could not read image {filename}")
                    except Exception as e:
                        print(f"Warning: Error reading {filename}: {str(e)}")
        except Exception as e:
            print(f"Warning: Error accessing folder {folder_path}: {str(e)}")
        
        return images, filenames
    
    def extract_features(self, image):
        """Extract basic features from an image for anomaly detection"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Calculate basic statistical features
        features = {
            'mean_intensity': np.mean(gray),
            'std_intensity': np.std(gray),
            'contrast': np.std(gray) / np.mean(gray) if np.mean(gray) != 0 else 0,
            'brightness': np.mean(gray),
            'histogram': cv2.calcHist([gray], [0], None, [256], [0, 256]).flatten()
        }
        
        # Edge detection for structural analysis
        edges = cv2.Canny(gray, 50, 150)
        features['edge_density'] = np.sum(edges > 0) / edges.size
        
        # Color analysis (if applicable)
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        features['hue_mean'] = np.mean(hsv[:, :, 0])
        features['saturation_mean'] = np.mean(hsv[:, :, 1])
        features['value_mean'] = np.mean(hsv[:, :, 2])
        
        return features
    
    def calculate_anomaly_score(self, image_features, baseline_features):
        """Calculate anomaly score based on deviation from baseline"""
        score = 0.0
        
        # Compare statistical features
        if baseline_features:
            score += abs(image_features['mean_intensity'] - baseline_features['mean_intensity']) / 255.0
            score += abs(image_features['contrast'] - baseline_features['contrast'])
            score += abs(image_features['edge_density'] - baseline_features['edge_density'])
            
            # Histogram comparison using correlation
            hist_corr = cv2.compareHist(
                image_features['histogram'].astype(np.float32),
                baseline_features['histogram'].astype(np.float32),
                cv2.HISTCMP_CORREL
            )
            score += (1.0 - hist_corr)  # Lower correlation = higher anomaly score
        
        return min(score, 1.0)  # Cap at 1.0
    
    def _process_single_image(self, image, filename, progress_callback=None, total_images=1, index=0):
        """Process a single image (helper for parallel processing)"""
        try:
            # Extract features
            features = self.extract_features(image)
            
            if self.use_ml and self.model:
                # Use ML model for detection
                feature_vec = [
                    features['mean_intensity'],
                    features['contrast'],
                    features['edge_density'],
                    features['hue_mean'],
                    features['saturation_mean'],
                    features['value_mean']
                ]
                # Predict returns 1 for normal, -1 for anomaly
                is_normal = self.model.predict([feature_vec])[0] == 1
                anomaly_score = -self.model.score_samples([feature_vec])[0]  # Convert to positive score
            else:
                # Fallback to basic method
                baseline_features = None
                if os.path.exists(self.normal_images_path):
                    normal_images, _ = self.load_images_from_folder(self.normal_images_path)
                    if normal_images:
                        try:
                            all_features = [self.extract_features(img) for img in normal_images]
                            baseline_features = self._calculate_average_features(all_features)
                        except Exception as e:
                            print(f"Warning: Error processing baseline images: {str(e)}")
                
                anomaly_score = self.calculate_anomaly_score(features, baseline_features)
                is_normal = anomaly_score <= 0.3
            
            result = {
                'filename': filename,
                'anomaly_score': round(anomaly_score, 3),
                'is_anomaly': not is_normal,
                'features': {
                    'brightness': round(features['brightness'], 2),
                    'contrast': round(features['contrast'], 3),
                    'edge_density': round(features['edge_density'], 3)
                }
            }
            
            # Call progress callback if provided
            if progress_callback:
                progress_callback(index + 1, total_images)
                
            return result
            
        except Exception as e:
            print(f"Warning: Error processing {filename}: {str(e)}")
            return {
                'filename': filename,
                'anomaly_score': 0.0,
                'is_anomaly': False,
                'error': str(e),
                'features': {
                    'brightness': 0.0,
                    'contrast': 0.0,
                    'edge_density': 0.0
                }
            }

    def analyze_folder(self, folder_path, progress_callback=None, parallel=True):
        """Analyze a folder of images for anomalies"""
        self.results = []
        
        # Validate folder path
        if not folder_path or not isinstance(folder_path, str):
            return {'error': 'Invalid folder path provided'}
        
        if not os.path.exists(folder_path):
            return {'error': f'Folder "{folder_path}" does not exist. Please check the path and try again.'}
        
        if not os.path.isdir(folder_path):
            return {'error': f'Path "{folder_path}" is not a directory. Please select a valid folder.'}
        
        # Try to load ML model if not already loaded
        if self.model is None:
            self.load_model()
        
        # Load target images
        images, filenames = self.load_images_from_folder(folder_path)
        
        if not images:
            return {'error': f'No supported image files found in "{folder_path}". Supported formats: .jpg, .jpeg, .png, .bmp, .tiff, .tif'}
        
        print(f"Found {len(images)} images to analyze")
        total_images = len(images)
        
        if parallel and len(images) > 10:  # Only parallelize for larger sets
            from joblib import Parallel, delayed
            try:
                self.results = Parallel(n_jobs=-1, prefer="threads")(
                    delayed(self._process_single_image)(
                        image, filename, progress_callback, total_images, i
                    ) for i, (image, filename) in enumerate(zip(images, filenames))
                )
            except Exception as e:
                print(f"Warning: Parallel processing failed, falling back to sequential: {str(e)}")
                self.results = [
                    self._process_single_image(image, filename, progress_callback, total_images, i)
                    for i, (image, filename) in enumerate(zip(images, filenames))
                ]
        else:
            self.results = [
                self._process_single_image(image, filename, progress_callback, total_images, i)
                for i, (image, filename) in enumerate(zip(images, filenames))
            ]
        
        return self.results
    
    def _calculate_average_features(self, features_list):
        """Calculate average features from a list of feature dictionaries"""
        if not features_list:
            return None
        
        avg_features = {}
        for key in features_list[0].keys():
            if key == 'histogram':
                avg_features[key] = np.mean([f[key] for f in features_list], axis=0)
            else:
                avg_features[key] = np.mean([f[key] for f in features_list])
        
        return avg_features

    def train_model(self, contamination=0.1):
        """Train an Isolation Forest model on normal images"""
        from sklearn.ensemble import IsolationForest
        from joblib import dump
        
        normal_images, _ = self.load_images_from_folder(self.normal_images_path)
        if not normal_images:
            raise ValueError("No normal images found for training")
            
        # Extract features from normal images
        features = []
        for img in normal_images:
            img_features = self.extract_features(img)
            # Convert features to flat array
            feature_vec = [
                img_features['mean_intensity'],
                img_features['contrast'],
                img_features['edge_density'],
                img_features['hue_mean'],
                img_features['saturation_mean'],
                img_features['value_mean']
            ]
            features.append(feature_vec)
            
        # Train Isolation Forest
        self.model = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_jobs=-1  # Use all cores
        )
        self.model.fit(features)
        
        # Save model
        dump(self.model, self.model_path)
        self.use_ml = True
        return "Model trained and saved successfully"

    def load_model(self):
        """Load a pre-trained anomaly detection model"""
        from joblib import load
        try:
            self.model = load(self.model_path)
            self.use_ml = True
            return "Model loaded successfully"
        except FileNotFoundError:
            self.use_ml = False
            return "No trained model found - using basic detection"
        except Exception as e:
            self.use_ml = False
            return f"Error loading model: {str(e)} - using basic detection"
    
    def save_results(self, output_path):
        """Save analysis results to a JSON file"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_images': len(self.results),
            'anomalies_detected': sum(1 for r in self.results if r['is_anomaly']),
            'results': self.results
        }
        
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)
    
    def get_summary(self):
        """Get a summary of the analysis results"""
        if not self.results:
            return "No analysis results available."
        
        total = len(self.results)
        anomalies = sum(1 for r in self.results if r['is_anomaly'])
        normal = total - anomalies
        
        summary = f"""Analysis Summary:
        
Total Images Analyzed: {total}
Normal Images: {normal} ({normal/total*100:.1f}%)
Anomalies Detected: {anomalies} ({anomalies/total*100:.1f}%)

Anomaly Details:"""

        if anomalies > 0:
            for result in self.results:
                if result['is_anomaly']:
                    summary += f"\n- {result['filename']}: Score {result['anomaly_score']}"
        else:
            summary += "\nNo anomalies detected."
        
        return summary
