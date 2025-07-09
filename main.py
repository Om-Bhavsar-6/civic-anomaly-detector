#!/usr/bin/env python3
"""
Civic Image Anomaly Detector - Command Line Interface

This script provides a command-line interface for detecting anomalies in civic
infrastructure images such as potholes, broken streetlights, damaged signs, etc.

Usage:
    python main.py train --data_folder /path/to/training/images
    python main.py detect --image /path/to/image.jpg
    python main.py batch --folder /path/to/images/folder
"""

import argparse
import os
import sys
import glob
from pathlib import Path
import json

from anomaly_detector import CivicAnomalyDetector

def create_sample_data():
    """Create sample data structure for testing."""
    sample_dir = Path("sample_data")
    sample_dir.mkdir(exist_ok=True)
    
    # Create subdirectories
    (sample_dir / "normal").mkdir(exist_ok=True)
    (sample_dir / "anomalies").mkdir(exist_ok=True)
    (sample_dir / "test").mkdir(exist_ok=True)
    
    print(f"Sample data structure created at: {sample_dir.absolute()}")
    print("Add normal civic images to: sample_data/normal/")
    print("Add anomalous civic images to: sample_data/anomalies/")
    print("Add test images to: sample_data/test/")

def train_model(args):
    """Train the anomaly detection model."""
    print("Training Civic Anomaly Detector...")
    
    # Initialize detector
    detector = CivicAnomalyDetector()
    
    # Get training images
    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.tiff']
    training_images = []
    
    for ext in image_extensions:
        training_images.extend(glob.glob(os.path.join(args.data_folder, ext)))
        training_images.extend(glob.glob(os.path.join(args.data_folder, ext.upper())))
    
    if not training_images:
        print(f"No images found in {args.data_folder}")
        return
    
    print(f"Found {len(training_images)} training images")
    
    # Train the model
    detector.train(training_images)
    
    # Save the model
    model_path = args.model_path or "civic_anomaly_model.pkl"
    detector.save_model(model_path)
    
    print(f"Model training completed and saved to: {model_path}")

def detect_single_image(args):
    """Detect anomalies in a single image."""
    print(f"Analyzing image: {args.image}")
    
    # Load model
    model_path = args.model_path or "civic_anomaly_model.pkl"
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}. Please train the model first.")
        return
    
    # Initialize detector with trained model
    detector = CivicAnomalyDetector(model_path)
    
    # Detect anomalies
    try:
        result = detector.detect_anomalies(args.image)
        
        # Display results
        print("\n" + "="*50)
        print("ANOMALY DETECTION RESULTS")
        print("="*50)
        print(f"Image: {result['image_path']}")
        print(f"Is Anomaly: {'YES' if result['is_anomaly'] else 'NO'}")
        print(f"Anomaly Score: {result['anomaly_score']:.4f}")
        print(f"Confidence: {result['confidence']:.4f}")
        if result['is_anomaly']:
            print(f"Anomaly Type: {result['anomaly_type']}")
        print("="*50)
        
        # Save results if requested
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"Results saved to: {args.output}")
            
    except Exception as e:
        print(f"Error processing image: {e}")

def batch_detect(args):
    """Detect anomalies in a batch of images."""
    print(f"Processing images in folder: {args.folder}")
    
    # Load model
    model_path = args.model_path or "civic_anomaly_model.pkl"
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}. Please train the model first.")
        return
    
    # Initialize detector with trained model
    detector = CivicAnomalyDetector(model_path)
    
    # Batch detect
    try:
        results = detector.batch_detect(args.folder)
        
        # Display summary
        anomaly_count = sum(1 for r in results if r['is_anomaly'])
        print(f"\nProcessed {len(results)} images")
        print(f"Anomalies detected: {anomaly_count}")
        
        # Show anomaly details
        if anomaly_count > 0:
            print("\nANOMALIES DETECTED:")
            print("-" * 60)
            for result in results:
                if result['is_anomaly']:
                    filename = os.path.basename(result['image_path'])
                    print(f"{filename:30} | {result['anomaly_type']:15} | Score: {result['anomaly_score']:.3f}")
        
        # Generate report
        report = detector.generate_report(results, args.output)
        
        # Visualize results if requested
        if args.visualize:
            output_folder = args.output_folder or "results"
            detector.visualize_results(results, output_folder)
            
    except Exception as e:
        print(f"Error processing batch: {e}")

def main():
    """Main function to handle command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Civic Image Anomaly Detector",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    # Create sample data structure
    python main.py create-sample

# Train model using civic images
    python main.py train --data_folder sample_data/normal

    # Detect anomalies in a single image
    python main.py detect --image sample_data/test/image.jpg

    # Batch process images in a folder
    python main.py batch --folder sample_data/test --visualize

    # Generate detailed report
    python main.py batch --folder sample_data/test --output report.json
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Create sample data command
    create_parser = subparsers.add_parser('create-sample', help='Create sample data structure')
    
    # Train command
    train_parser = subparsers.add_parser('train', help='Train the anomaly detection model')
    train_parser.add_argument('--data_folder', required=True, help='Path to training images folder')
    train_parser.add_argument('--model_path', help='Path to save the trained model (default: civic_anomaly_model.pkl)')
    
    # Single image detection command
    detect_parser = subparsers.add_parser('detect', help='Detect anomalies in a single image')
    detect_parser.add_argument('--image', required=True, help='Path to image file')
    detect_parser.add_argument('--model_path', help='Path to trained model (default: civic_anomaly_model.pkl)')
    detect_parser.add_argument('--output', help='Path to save results JSON file')
    
    # Batch detection command
    batch_parser = subparsers.add_parser('batch', help='Detect anomalies in a batch of images')
    batch_parser.add_argument('--folder', required=True, help='Path to folder containing images')
    batch_parser.add_argument('--model_path', help='Path to trained model (default: civic_anomaly_model.pkl)')
    batch_parser.add_argument('--output', help='Path to save results JSON report')
    batch_parser.add_argument('--output_folder', help='Path to save visualization images (default: results)')
    batch_parser.add_argument('--visualize', action='store_true', help='Generate visualization plots')
    
    args = parser.parse_args()
    
    if args.command == 'create-sample':
        create_sample_data()
    elif args.command == 'train':
        train_model(args)
    elif args.command == 'detect':
        detect_single_image(args)
    elif args.command == 'batch':
        batch_detect(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
