# Civic Image Anomaly Detector

A machine learning system designed to detect anomalies in civic infrastructure images such as potholes, broken streetlights, damaged signs, and other urban issues.

## Quick Start

### Prerequisites
- Python 3.11+ installed with PATH configured
- VSCode (recommended) or any text editor

### Installation
1. Clone or download this project
2. Open in VSCode: `File → Open Folder`
3. Open terminal in VSCode: `Ctrl + ` (backtick)
4. Create virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate
   ```
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Basic Usage
1. **Create sample data structure:**
   ```bash
   python main.py create-sample
   ```

2. **Add images to folders:**
   - Normal civic images → `sample_data/normal/`
   - Test images → `sample_data/test/`

3. **Train the model:**
   ```bash
   python main.py train --data_folder sample_data/normal
   ```

4. **Detect anomalies:**
   ```bash
   # Single image
   python main.py detect --image sample_data/test/your_image.jpg
   
   # Multiple images with visualization
   python main.py batch --folder sample_data/test --visualize
   ```

## Detailed Guide
See `VSCODE_GUIDE.md` for complete step-by-step instructions.

## Features
- **Anomaly Detection**: Identifies unusual patterns in civic infrastructure
- **Classification**: Categorizes detected anomalies (potholes, graffiti, etc.)
- **Batch Processing**: Analyze multiple images at once
- **Visualization**: Generate plots showing detected anomalies
- **Reporting**: Export detailed JSON reports

## Supported Anomaly Types
- Potholes
- Broken streetlights
- Damaged signs
- Graffiti
- Debris
- Cracked pavement
- Other unclassified issues

## Project Structure
```
civic_anomaly_detector/
├── anomaly_detector.py    # Core detection logic
├── main.py               # Command-line interface
├── requirements.txt      # Python dependencies
├── README.md            # This file
└── VSCODE_GUIDE.md      # Detailed implementation guide
```

## Requirements
See `requirements.txt` for complete list of dependencies.

## 🎬 Live Demo

See the system in action:

```bash
python demo_for_github.py
```

### Demo Output:

```
============================================================
  🏙️ CIVIC ANOMALY DETECTOR - LIVE DEMO
============================================================
This demonstration shows the civic anomaly detector in action!

🎨 Creating demonstration images...
   ✓ Created clean_street.png - Clean concrete street
   ✓ Created pothole_damage.png - Street with pothole damage
   ✓ Created graffiti_wall.png - Wall with red graffiti
   ✓ Created broken_light.png - Broken streetlight
   ✓ Created cracked_sidewalk.png - Cracked sidewalk

🤖 INITIALIZING & TRAINING THE AI MODEL
🔄 Training with 4 normal civic images...
✅ Training completed successfully!

🔍 SINGLE IMAGE ANALYSIS
📸 Analyzing: pothole_damage.png
🚨 Anomaly Detected: YES
📊 Confidence Score: -0.0064
🏷️ Anomaly Type: graffiti

📊 BATCH ANALYSIS RESULTS
🔄 Processed 5 civic infrastructure images
🚨 Total anomalies detected: 2

📋 DETAILED ANALYSIS REPORT:
----------------------------------------------------------------------
IMAGE NAME           STATUS     TYPE               SCORE   
----------------------------------------------------------------------
broken_light.png     ✅ NORMAL   pothole            0.011   
cracked_sidewalk.png 🚨 ANOMALY  graffiti           -0.019  
debris_road.png      ✅ NORMAL   graffiti           0.015   
graffiti_wall.png    ✅ NORMAL   graffiti           0.053   
pothole_damage.png   🚨 ANOMALY  graffiti           -0.006  

🎉 DEMONSTRATION COMPLETE
The Civic Anomaly Detector is working perfectly!
```

## Contributing
Feel free to customize the detection parameters and add new anomaly types based on your specific needs.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author
**Om Bhavsar** - *Initial work* - [Om-Bhavsar-6](https://github.com/Om-Bhavsar-6)
