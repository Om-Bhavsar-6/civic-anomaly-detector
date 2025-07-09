#!/usr/bin/env python3
"""
Example usage of the Civic Anomaly Detector

This script demonstrates how to use the civic anomaly detector
for detecting infrastructure anomalies in images.
"""

import os
import sys
from pathlib import Path
import numpy as np
from PIL import Image

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from anomaly_detector import CivicAnomalyDetector

def create_example_images():
    """Create example images for demonstration."""
    print("Creating example images...")
    
    # Create sample_data directory
    sample_dir = Path("sample_data")
    sample_dir.mkdir(exist_ok=True)
    (sample_dir / "normal").mkdir(exist_ok=True)
    (sample_dir / "test").mkdir(exist_ok=True)
    
    # Create some normal civic images (simulated)
    normal_colors = [
        (100, 150, 100),  # Green-ish (grass/trees)
        (120, 120, 120),  # Gray (concrete)
        (80, 100, 140),   # Blue-ish (sky)
        (140, 140, 100),  # Yellow-ish (road markings)
    ]
    
    for i, color in enumerate(normal_colors):
        img = Image.new('RGB', (224, 224), color)
        # Add some noise to make it more realistic
        pixels = np.array(img)
        noise = np.random.normal(0, 10, pixels.shape).astype(np.uint8)
        pixels = np.clip(pixels + noise, 0, 255)
        img = Image.fromarray(pixels)
        img.save(sample_dir / "normal" / f"normal_{i+1}.png")
    
    # Create some test images with potential anomalies
    test_colors = [
        (200, 50, 50),    # Red-ish (potential issues)
        (50, 50, 50),     # Dark (shadows/damage)
        (220, 220, 220),  # Very bright (overexposed)
        (100, 200, 100),  # Very green (vegetation overgrowth)
    ]
    
    for i, color in enumerate(test_colors):
        img = Image.new('RGB', (224, 224), color)
        # Add different patterns to simulate anomalies
        pixels = np.array(img)
        
        if i == 0:  # Red - simulate pothole
            pixels[50:100, 50:100] = [30, 30, 30]  # Dark patch
        elif i == 1:  # Dark - simulate broken streetlight
            pixels[75:150, 75:150] = [255, 255, 0]  # Bright spot
        elif i == 2:  # Bright - simulate damaged sign
            pixels[::10, ::10] = [255, 0, 0]  # Red spots
        elif i == 3:  # Green - simulate debris
            pixels[100:120, 100:120] = [139, 69, 19]  # Brown patch
        
        img = Image.fromarray(pixels)
        img.save(sample_dir / "test" / f"test_{i+1}.png")
    
    print(f"Created {len(normal_colors)} normal images and {len(test_colors)} test images")
    return sample_dir

def main():
    """Main example function."""
    print("=== Civic Anomaly Detector Example ===")
    print()
    
    # Step 1: Create example images
    sample_dir = create_example_images()
    
    # Step 2: Initialize detector
    print("Initializing anomaly detector...")
    detector = CivicAnomalyDetector()
    
    # Step 3: Train the model
    print("Training the model with normal images...")
    normal_dir = sample_dir / "normal"
    training_images = list(normal_dir.glob("*.png"))
    training_images = [str(img) for img in training_images]
    
    detector.train(training_images)
    
    # Step 4: Test single image detection
    print("\n=== Single Image Detection ===")
    test_image = sample_dir / "test" / "test_1.png"
    result = detector.detect_anomalies(str(test_image))
    
    print(f"Image: {test_image.name}")
    print(f"Is Anomaly: {'YES' if result['is_anomaly'] else 'NO'}")
    print(f"Anomaly Score: {result['anomaly_score']:.4f}")
    print(f"Anomaly Type: {result['anomaly_type']}")
    print(f"Confidence: {result['confidence']:.4f}")
    
    # Step 5: Batch detection
    print("\n=== Batch Detection ===")
    test_dir = sample_dir / "test"
    results = detector.batch_detect(str(test_dir))
    
    anomaly_count = sum(1 for r in results if r['is_anomaly'])
    print(f"Processed {len(results)} images")
    print(f"Anomalies detected: {anomaly_count}")
    
    print("\nDetailed Results:")
    print("-" * 60)
    for result in results:
        filename = Path(result['image_path']).name
        status = "ANOMALY" if result['is_anomaly'] else "NORMAL"
        print(f"{filename:15} | {status:8} | Type: {result['anomaly_type']:15} | Score: {result['anomaly_score']:6.3f}")
    
    # Step 6: Generate report
    print("\n=== Generating Report ===")
    report_path = "anomaly_report.json"
    report = detector.generate_report(results, report_path)
    
    print(f"Report saved to: {report_path}")
    print(f"Summary:")
    print(f"  - Total images: {report['total_images']}")
    print(f"  - Anomalies detected: {report['anomalies_detected']}")
    print(f"  - Anomaly types found: {list(report['anomaly_types'].keys())}")
    
    # Step 7: Save the trained model
    print("\n=== Saving Model ===")
    model_path = "civic_anomaly_model.pkl"
    detector.save_model(model_path)
    print(f"Model saved to: {model_path}")
    
    print("\n=== Example Complete ===")
    print("You can now use the trained model for detecting anomalies in new images!")
    print("\nNext steps:")
    print("1. Replace sample images with real civic infrastructure images")
    print("2. Retrain the model with your specific data")
    print("3. Use the model to detect anomalies in your city's infrastructure")

if __name__ == "__main__":
    main()
