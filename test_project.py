#!/usr/bin/env python3
"""
Quick test script to verify the civic anomaly detector project works correctly.
"""

import sys
import os
import tempfile
import numpy as np
from PIL import Image

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from anomaly_detector import CivicAnomalyDetector

def create_test_image(filename, color=(128, 128, 128)):
    """Create a simple test image."""
    img = Image.new('RGB', (224, 224), color)
    img.save(filename)
    return filename

def test_basic_functionality():
    """Test basic functionality of the civic anomaly detector."""
    print("Testing Civic Anomaly Detector...")
    
    # Create a temporary directory for test images
    with tempfile.TemporaryDirectory() as temp_dir:
        # Create test images
        normal_img = create_test_image(os.path.join(temp_dir, "normal.png"), (100, 150, 100))
        test_img = create_test_image(os.path.join(temp_dir, "test.png"), (200, 50, 50))
        
        # Initialize detector
        detector = CivicAnomalyDetector()
        
        # Test image preprocessing
        print("✓ Testing image preprocessing...")
        processed_img = detector.preprocess_image(normal_img)
        assert processed_img.shape == (224, 224, 3), f"Expected shape (224, 224, 3), got {processed_img.shape}"
        
        # Test feature extraction
        print("✓ Testing feature extraction...")
        features = detector.extract_features(processed_img)
        assert len(features) > 0, "No features extracted"
        
        # Test training
        print("✓ Testing model training...")
        detector.train([normal_img])
        
        # Test single image detection
        print("✓ Testing single image detection...")
        result = detector.detect_anomalies(test_img)
        assert 'is_anomaly' in result, "Missing 'is_anomaly' in result"
        assert 'anomaly_score' in result, "Missing 'anomaly_score' in result"
        assert 'anomaly_type' in result, "Missing 'anomaly_type' in result"
        
        # Test batch detection
        print("✓ Testing batch detection...")
        results = detector.batch_detect(temp_dir)
        assert len(results) > 0, "No results from batch detection"
        
        # Test report generation
        print("✓ Testing report generation...")
        report = detector.generate_report(results)
        assert 'total_images' in report, "Missing 'total_images' in report"
        
        print("\n✅ All tests passed! The civic anomaly detector is working correctly.")
        print(f"   - Processed {len(results)} images")
        print(f"   - Feature vector size: {len(features)}")
        print(f"   - Anomaly types supported: {list(detector.anomaly_types.keys())}")

if __name__ == "__main__":
    try:
        test_basic_functionality()
    except Exception as e:
        print(f"❌ Test failed: {e}")
        sys.exit(1)
