# Complete VSCode Implementation Guide: Civic Image Anomaly Detector

## Prerequisites
- Windows 10/11
- Internet connection
- Administrator privileges (for installations)

## Step 1: Install Required Software

### 1.1 Install Python
1. Go to [python.org](https://www.python.org/downloads/)
2. Download Python 3.11 or 3.12 (latest stable version)
3. **IMPORTANT**: During installation, check "Add Python to PATH"
4. Verify installation:
   - Open Command Prompt (Win + R, type `cmd`)
   - Type `python --version` - should show Python version

### 1.2 Install VSCode
1. Go to [code.visualstudio.com](https://code.visualstudio.com/)
2. Download and install VSCode
3. Launch VSCode after installation

### 1.3 Install VSCode Extensions
1. Open VSCode
2. Click Extensions icon (Ctrl + Shift + X)
3. Install these essential extensions:
   - **Python** (by Microsoft)
   - **Pylance** (by Microsoft)
   - **Python Debugger** (by Microsoft)
   - **Jupyter** (by Microsoft) - optional but helpful

## Step 2: Open Your Project in VSCode

### 2.1 Open the Project Folder
1. In VSCode: File → Open Folder
2. Navigate to `C:\Users\omkbh.OM.000\civic_anomaly_detector`
3. Click "Select Folder"
4. VSCode will open your project

### 2.2 Set Up Python Interpreter
1. Press `Ctrl + Shift + P` to open Command Palette
2. Type "Python: Select Interpreter"
3. Choose the Python version you installed (should show path with python.exe)

## Step 3: Set Up Virtual Environment (Recommended)

### 3.1 Create Virtual Environment
1. Open VSCode Terminal: `Ctrl + ` (backtick)
2. In terminal, type:
   ```powershell
   python -m venv venv
   ```
3. Wait for creation to complete

### 3.2 Activate Virtual Environment
1. In VSCode terminal, type:
   ```powershell
   .\venv\Scripts\Activate
   ```
2. You should see `(venv)` at the beginning of your terminal prompt
3. If you get execution policy error, run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### 3.3 Select Virtual Environment in VSCode
1. Press `Ctrl + Shift + P`
2. Type "Python: Select Interpreter"
3. Choose the interpreter from your venv folder: `.\venv\Scripts\python.exe`

## Step 4: Install Dependencies

### 4.1 Install Required Packages
1. In VSCode terminal (with venv activated), run:
   ```powershell
   pip install -r requirements.txt
   ```
2. Wait for all packages to install (this may take 5-10 minutes)
3. If you see warnings about PATH, ignore them for now

## Step 5: Explore Your Project Structure

### 5.1 Project Files Overview
Your project should look like this in VSCode Explorer:
```
civic_anomaly_detector/
├── anomaly_detector.py    # Main detection logic
├── main.py               # Command-line interface
├── requirements.txt      # Dependencies list
├── venv/                # Virtual environment (don't edit)
└── VSCODE_GUIDE.md      # This guide
```

### 5.2 Understanding the Code
1. **Click on `main.py`** - This is your entry point
2. **Click on `anomaly_detector.py`** - This contains the AI detection logic
3. **Click on `requirements.txt`** - Lists all the libraries needed

## Step 6: Prepare Your Data

### 6.1 Create Sample Data Structure
1. In VSCode terminal, run:
   ```powershell
   python main.py create-sample
   ```
2. This creates folders for your images:
   - `sample_data/normal/` - Put normal civic images here
   - `sample_data/anomalies/` - Put problem images here
   - `sample_data/test/` - Put images you want to test

### 6.2 Add Your Images
1. **Find civic images online** or take photos:
   - Normal: regular streets, working streetlights, clean sidewalks
   - Anomalies: potholes, broken signs, graffiti, debris
2. **Download and organize**:
   - Save 10-20 normal images to `sample_data/normal/`
   - Save some test images to `sample_data/test/`
3. **Supported formats**: JPG, PNG, BMP, TIFF

## Step 7: Train Your Model

### 7.1 Train the Anomaly Detector
1. In VSCode terminal, run:
   ```powershell
   python main.py train --data_folder sample_data/normal
   ```
2. **What happens**:
   - The system analyzes your normal images
   - Learns what "normal" civic infrastructure looks like
   - Saves a model file: `civic_anomaly_model.pkl`
3. **Wait time**: 2-5 minutes depending on number of images

### 7.2 Verify Training Success
1. Check that `civic_anomaly_model.pkl` appears in your project folder
2. Look for "Training completed successfully!" message

## Step 8: Test Anomaly Detection

### 8.1 Test Single Image
1. Put a test image in `sample_data/test/`
2. In terminal, run:
   ```powershell
   python main.py detect --image sample_data/test/your_image.jpg
   ```
3. **Results will show**:
   - Is Anomaly: YES/NO
   - Anomaly Score: numerical confidence
   - Anomaly Type: classification of the problem

### 8.2 Test Multiple Images (Batch Processing)
1. Put multiple test images in `sample_data/test/`
2. Run:
   ```powershell
   python main.py batch --folder sample_data/test --visualize
   ```
3. **This will**:
   - Process all images in the folder
   - Show summary of results
   - Create visualization plots (saved in `results/` folder)

### 8.3 Generate Detailed Report
1. Run:
   ```powershell
   python main.py batch --folder sample_data/test --output detailed_report.json
   ```
2. Open `detailed_report.json` in VSCode to see full results

## Step 9: Understand Your Results

### 9.1 Reading the Output
- **Anomaly Score**: Negative values indicate anomalies (more negative = more anomalous)
- **Confidence**: Higher values = more confident in detection
- **Anomaly Types**:
  - `pothole`: Road surface damage
  - `broken_streetlight`: Lighting infrastructure issues
  - `graffiti`: Vandalism or unwanted markings
  - `debris`: Objects blocking paths
  - `cracked_pavement`: Sidewalk damage
  - `other`: Unclassified anomalies

### 9.2 Viewing Visualizations
1. After running with `--visualize`, check the `results/` folder
2. Open `anomaly_summary.png` to see detected anomalies with labels

## Step 10: Debugging and Troubleshooting

### 10.1 Common Issues and Solutions

#### Python Not Found
```powershell
# Error: 'python' is not recognized
# Solution: Reinstall Python with "Add to PATH" checked
```

#### Import Errors
```powershell
# Error: ModuleNotFoundError
# Solution: Make sure virtual environment is activated and dependencies installed
pip install -r requirements.txt
```

#### No Images Found
```powershell
# Error: No images found in folder
# Solution: Check image formats (JPG, PNG, BMP, TIFF) and file extensions
```

#### Model Not Found
```powershell
# Error: Model not found
# Solution: Train the model first
python main.py train --data_folder sample_data/normal
```

### 10.2 VSCode Debugging Features
1. **Set Breakpoints**: Click left margin next to line numbers
2. **Debug Mode**: Press F5 to start debugging
3. **Variable Inspector**: View variable values during execution
4. **Integrated Terminal**: Use Ctrl + ` for terminal access

## Step 11: Customization and Extensions

### 11.1 Modify Detection Parameters
1. Open `anomaly_detector.py` in VSCode
2. **Key parameters to adjust**:
   - Line 50: `contamination=0.1` (percentage of anomalies expected)
   - Line 52: `n_estimators=100` (model complexity)
   - Lines 271-282: Anomaly classification rules

### 11.2 Add New Anomaly Types
1. In `anomaly_detector.py`, find the `anomaly_types` dictionary (line 31)
2. Add new types:
   ```python
   'new_anomaly_type': 7,
   'another_type': 8
   ```
3. Update classification logic in `_classify_anomaly_type` method

### 11.3 Improve Classification
1. Collect more training data for specific anomaly types
2. Adjust threshold values in classification rules
3. Add more sophisticated feature extraction

## Step 12: Deployment and Sharing

### 11.1 Create a Standalone Script
1. Create `run_detector.py` for easy use:
   ```python
   from anomaly_detector import CivicAnomalyDetector
   
   # Simple usage script
   detector = CivicAnomalyDetector('civic_anomaly_model.pkl')
   result = detector.detect_anomalies('path/to/image.jpg')
   print(f"Anomaly detected: {result['is_anomaly']}")
   ```

### 11.2 Package Your Project
1. Create `setup.py` for distribution
2. Document your changes in `README.md`
3. Include sample images and results

## Step 13: Next Steps and Learning

### 13.1 Improve the Model
- **Collect more data**: More training images improve accuracy
- **Experiment with parameters**: Try different settings
- **Add preprocessing**: Image enhancement, noise reduction
- **Try different algorithms**: Neural networks, SVM, etc.

### 13.2 Learn More
- **Python Programming**: codecademy.com, python.org tutorial
- **Computer Vision**: OpenCV tutorials, PyImageSearch
- **Machine Learning**: Coursera, edX courses
- **VSCode Tips**: VSCode documentation, keyboard shortcuts

### 13.3 Real-World Applications
- **City Planning**: Municipal infrastructure monitoring
- **Smart Cities**: Automated reporting systems
- **Mobile Apps**: Citizen reporting tools
- **IoT Integration**: Camera-based monitoring systems

## Troubleshooting Checklist

Before asking for help, check:
- [ ] Virtual environment is activated (`(venv)` in terminal)
- [ ] All dependencies installed successfully
- [ ] Python interpreter selected in VSCode
- [ ] Images are in correct folders with supported formats
- [ ] Model has been trained before testing
- [ ] File paths are correct (use forward slashes or double backslashes)

## Getting Help

1. **Check error messages carefully** - they usually tell you what's wrong
2. **Google the exact error message** - someone else likely had the same issue
3. **Use VSCode's built-in help**: Hover over code for documentation
4. **Stack Overflow**: Great for specific programming questions
5. **GitHub Issues**: Check if others reported similar problems

---

## Quick Reference Commands

```powershell
# Activate virtual environment
.\venv\Scripts\Activate

# Create sample data structure
python main.py create-sample

# Train model
python main.py train --data_folder sample_data/normal

# Test single image
python main.py detect --image sample_data/test/image.jpg

# Batch process with visualization
python main.py batch --folder sample_data/test --visualize

# Generate report
python main.py batch --folder sample_data/test --output report.json
```

**Congratulations!** You now have a working civic image anomaly detector. Start with the basics and gradually experiment with more advanced features as you become comfortable with the system.
