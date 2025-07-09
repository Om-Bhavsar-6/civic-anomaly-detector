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

## Contributing
Feel free to customize the detection parameters and add new anomaly types based on your specific needs.

## License
This project is for educational and civic improvement purposes.
