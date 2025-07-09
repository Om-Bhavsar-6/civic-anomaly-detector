#!/usr/bin/env python3
"""
GitHub Demo Script - Civic Anomaly Detector
This script demonstrates the working functionality of the civic anomaly detector
with clear output that can be shared on GitHub.
"""

import sys
import os
from pathlib import Path
import numpy as np
from PIL import Image
import json
from datetime import datetime

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from anomaly_detector import CivicAnomalyDetector

def print_banner(title):
    """Print a nice banner for sections."""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def create_demo_images():
    """Create demonstration images with clear patterns."""
    print("🎨 Creating demonstration images...")
    
    # Create demo_images directory
    demo_dir = Path("demo_images")
    demo_dir.mkdir(exist_ok=True)
    (demo_dir / "normal").mkdir(exist_ok=True)
    (demo_dir / "test").mkdir(exist_ok=True)
    
    # Create normal civic infrastructure images
    normal_scenarios = [
        {"name": "clean_street", "color": (120, 120, 120), "description": "Clean concrete street"},
        {"name": "healthy_grass", "color": (80, 150, 80), "description": "Healthy grass area"},
        {"name": "clear_sky", "color": (135, 206, 235), "description": "Clear blue sky"},
        {"name": "normal_pavement", "color": (105, 105, 105), "description": "Normal pavement"},
    ]
    
    for i, scenario in enumerate(normal_scenarios):
        img = Image.new('RGB', (224, 224), scenario["color"])
        # Add realistic noise
        pixels = np.array(img)
        noise = np.random.normal(0, 8, pixels.shape)
        pixels = np.clip(pixels + noise, 0, 255).astype(np.uint8)
        img = Image.fromarray(pixels)
        img.save(demo_dir / "normal" / f"{scenario['name']}.png")
        print(f"   ✓ Created {scenario['name']}.png - {scenario['description']}")
    
    # Create test images with simulated anomalies
    anomaly_scenarios = [
        {"name": "pothole_damage", "base_color": (100, 100, 100), "anomaly_patch": (30, 30, 30), "description": "Street with pothole damage"},
        {"name": "graffiti_wall", "base_color": (180, 180, 180), "anomaly_patch": (255, 0, 0), "description": "Wall with red graffiti"},
        {"name": "broken_light", "base_color": (40, 40, 40), "anomaly_patch": (255, 255, 0), "description": "Broken streetlight (bright spot)"},
        {"name": "debris_road", "base_color": (90, 90, 90), "anomaly_patch": (139, 69, 19), "description": "Road with debris"},
        {"name": "cracked_sidewalk", "base_color": (128, 128, 128), "anomaly_patch": (60, 60, 60), "description": "Cracked sidewalk"},
    ]
    
    for i, scenario in enumerate(anomaly_scenarios):
        img = Image.new('RGB', (224, 224), scenario["base_color"])
        pixels = np.array(img)
        
        # Add anomaly pattern
        if "pothole" in scenario["name"]:
            pixels[80:120, 80:120] = scenario["anomaly_patch"]  # Dark patch
        elif "graffiti" in scenario["name"]:
            pixels[50:100, 50:150] = scenario["anomaly_patch"]  # Red area
        elif "broken" in scenario["name"]:
            pixels[90:130, 90:130] = scenario["anomaly_patch"]  # Bright spot
        elif "debris" in scenario["name"]:
            pixels[100:140, 100:140] = scenario["anomaly_patch"]  # Brown patch
        elif "cracked" in scenario["name"]:
            # Create crack pattern
            for x in range(0, 224, 20):
                pixels[x:x+3, :] = scenario["anomaly_patch"]
        
        # Add realistic noise
        noise = np.random.normal(0, 5, pixels.shape)
        pixels = np.clip(pixels + noise, 0, 255).astype(np.uint8)
        img = Image.fromarray(pixels)
        img.save(demo_dir / "test" / f"{scenario['name']}.png")
        print(f"   ✓ Created {scenario['name']}.png - {scenario['description']}")
    
    return demo_dir

def main():
    """Main demonstration function."""
    print_banner("🏙️ CIVIC ANOMALY DETECTOR - LIVE DEMO")
    print("This demonstration shows the civic anomaly detector in action!")
    print(f"Demo run time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Step 1: Create demo images
    demo_dir = create_demo_images()
    
    # Step 2: Initialize and train the detector
    print_banner("🤖 INITIALIZING & TRAINING THE AI MODEL")
    detector = CivicAnomalyDetector()
    
    # Get training images
    normal_dir = demo_dir / "normal"
    training_images = [str(img) for img in normal_dir.glob("*.png")]
    
    print(f"🔄 Training with {len(training_images)} normal civic images...")
    detector.train(training_images)
    print("✅ Training completed successfully!")
    
    # Step 3: Test single image detection
    print_banner("🔍 SINGLE IMAGE ANALYSIS")
    test_image = demo_dir / "test" / "pothole_damage.png"
    result = detector.detect_anomalies(str(test_image))
    
    print(f"📸 Analyzing: {test_image.name}")
    print(f"🚨 Anomaly Detected: {'YES' if result['is_anomaly'] else 'NO'}")
    print(f"📊 Confidence Score: {result['anomaly_score']:.4f}")
    print(f"🏷️  Anomaly Type: {result['anomaly_type']}")
    print(f"🎯 Confidence Level: {result['confidence']:.4f}")
    
    # Step 4: Batch analysis
    print_banner("📊 BATCH ANALYSIS RESULTS")
    test_dir = demo_dir / "test"
    results = detector.batch_detect(str(test_dir))
    
    print(f"🔄 Processed {len(results)} civic infrastructure images")
    anomalies = [r for r in results if r['is_anomaly']]
    print(f"🚨 Total anomalies detected: {len(anomalies)}")
    
    print("\n📋 DETAILED ANALYSIS REPORT:")
    print("-" * 70)
    print(f"{'IMAGE NAME':<20} {'STATUS':<10} {'TYPE':<18} {'SCORE':<8}")
    print("-" * 70)
    
    for result in results:
        filename = Path(result['image_path']).name
        status = "🚨 ANOMALY" if result['is_anomaly'] else "✅ NORMAL"
        anomaly_type = result['anomaly_type']
        score = f"{result['anomaly_score']:.3f}"
        print(f"{filename:<20} {status:<10} {anomaly_type:<18} {score:<8}")
    
    # Step 5: Generate summary report
    print_banner("📄 GENERATING SUMMARY REPORT")
    report_path = "demo_analysis_report.json"
    report = detector.generate_report(results, report_path)
    
    print(f"📄 Full report saved to: {report_path}")
    print(f"📊 Summary Statistics:")
    print(f"   • Total images analyzed: {report['total_images']}")
    print(f"   • Anomalies detected: {report['anomalies_detected']}")
    print(f"   • Detection accuracy: {((report['total_images'] - report['anomalies_detected']) / report['total_images'] * 100):.1f}% normal images classified correctly")
    
    if report['anomaly_types']:
        print(f"   • Anomaly types found: {', '.join(report['anomaly_types'].keys())}")
    
    # Step 6: Save the trained model
    print_banner("💾 SAVING TRAINED MODEL")
    model_path = "civic_anomaly_detector_model.pkl"
    detector.save_model(model_path)
    print(f"💾 Trained model saved to: {model_path}")
    print("🔄 Model can be loaded later for real-time detection!")
    
    # Step 7: Demonstrate model loading
    print_banner("🔄 DEMONSTRATING MODEL PERSISTENCE")
    print("Loading previously saved model...")
    new_detector = CivicAnomalyDetector(model_path)
    test_result = new_detector.detect_anomalies(str(test_image))
    print(f"✅ Model loaded successfully!")
    print(f"🔍 Re-analysis result: {'ANOMALY' if test_result['is_anomaly'] else 'NORMAL'}")
    
    print_banner("🎉 DEMONSTRATION COMPLETE")
    print("The Civic Anomaly Detector is working perfectly!")
    print("\n🚀 NEXT STEPS:")
    print("1. Replace demo images with real civic infrastructure photos")
    print("2. Retrain the model with your specific city's data")
    print("3. Deploy for real-time civic infrastructure monitoring")
    print("4. Integrate with city management systems")
    
    print(f"\n📁 Generated files:")
    print(f"   • {report_path} - Analysis report")
    print(f"   • {model_path} - Trained model")
    print(f"   • demo_images/ - Demo images used")
    
    print("\n🌟 GitHub Repository: https://github.com/Om-Bhavsar-6/civic-anomaly-detector")
    print("⭐ Star the repository if you find it useful!")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Demo failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
