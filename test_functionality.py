#!/usr/bin/env python3
"""
Test script to verify the civic anomaly detector functionality
"""

import os
import cv2
import numpy as np
from anomaly_detector import AnomalyDetector

def create_test_image(filename, width=100, height=100, color=(128, 128, 128)):
    """Create a simple test image"""
    image = np.full((height, width, 3), color, dtype=np.uint8)
    cv2.imwrite(filename, image)
    print(f"Created test image: {filename}")

def test_folder_analysis():
    """Test the folder analysis functionality"""
    print("Testing Civic Anomaly Detector...")
    
    # Create test directory
    test_dir = "test_images"
    os.makedirs(test_dir, exist_ok=True)
    
    # Create some test images
    create_test_image(os.path.join(test_dir, "test1.jpg"), color=(100, 100, 100))
    create_test_image(os.path.join(test_dir, "test2.jpg"), color=(150, 150, 150))
    create_test_image(os.path.join(test_dir, "test3.png"), color=(200, 200, 200))
    
    # Initialize detector
    detector = AnomalyDetector()
    
    # Test folder analysis
    print(f"\nAnalyzing folder: {test_dir}")
    results = detector.analyze_folder(test_dir)
    
    if isinstance(results, dict) and 'error' in results:
        print(f"Error: {results['error']}")
        return False
    
    print(f"Analysis completed successfully!")
    print(f"Found {len(results)} images")
    
    for result in results:
        print(f"- {result['filename']}: Score {result['anomaly_score']}, Anomaly: {result['is_anomaly']}")
    
    # Test summary
    summary = detector.get_summary()
    print(f"\nSummary:\n{summary}")
    
    return True

def test_invalid_folder():
    """Test with invalid folder path"""
    print("\nTesting with invalid folder...")
    detector = AnomalyDetector()
    
    # Test non-existent folder
    results = detector.analyze_folder("non_existent_folder")
    if isinstance(results, dict) and 'error' in results:
        print(f"Correctly handled invalid folder: {results['error']}")
        return True
    else:
        print("Failed to handle invalid folder properly")
        return False

def test_empty_folder():
    """Test with empty folder"""
    print("\nTesting with empty folder...")
    empty_dir = "empty_test"
    os.makedirs(empty_dir, exist_ok=True)
    
    detector = AnomalyDetector()
    results = detector.analyze_folder(empty_dir)
    
    if isinstance(results, dict) and 'error' in results:
        print(f"Correctly handled empty folder: {results['error']}")
        # Clean up
        os.rmdir(empty_dir)
        return True
    else:
        print("Failed to handle empty folder properly")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("CIVIC ANOMALY DETECTOR FUNCTIONALITY TEST")
    print("=" * 50)
    
    try:
        # Run tests
        test1 = test_folder_analysis()
        test2 = test_invalid_folder()
        test3 = test_empty_folder()
        
        print("\n" + "=" * 50)
        print("TEST RESULTS:")
        print(f"Folder Analysis: {'PASS' if test1 else 'FAIL'}")
        print(f"Invalid Folder Handling: {'PASS' if test2 else 'FAIL'}")
        print(f"Empty Folder Handling: {'PASS' if test3 else 'FAIL'}")
        
        if all([test1, test2, test3]):
            print("\nAll tests PASSED! The application should work correctly.")
        else:
            print("\nSome tests FAILED. There may be issues with the application.")
            
    except Exception as e:
        print(f"Test failed with exception: {str(e)}")
        import traceback
        traceback.print_exc()