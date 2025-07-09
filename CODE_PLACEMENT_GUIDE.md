# Where to Add Code: Complete Placement Guide

This guide shows you **exactly** where to add different types of code in your project.

## 📁 Your Current Project Files

```
civic_anomaly_detector/
├── 📄 anomaly_detector.py     ← Main AI detection logic (ALREADY CREATED)
├── 📄 main.py                ← Command-line interface (ALREADY CREATED)
├── 📄 requirements.txt       ← Dependencies list (ALREADY CREATED)
├── 📄 README.md             ← Project overview (ALREADY CREATED)
├── 📄 VSCODE_GUIDE.md       ← Step-by-step guide (ALREADY CREATED)
├── 📄 CODE_PLACEMENT_GUIDE.md ← This file
└── 📁 venv/                 ← Virtual environment (don't touch)
```

## 🎯 Where to Add Code Based on What You Want to Do

### 1. 📝 **Terminal Commands** (Most Common)
**WHERE:** VSCode Terminal (Ctrl + ` to open)
**WHEN:** Following the guide, running the program

```powershell
# These go in the TERMINAL, not in files:
python main.py create-sample
python main.py train --data_folder sample_data/normal
python main.py detect --image sample_data/test/image.jpg
```

### 2. 🔧 **Modify Detection Parameters**
**WHERE:** `anomaly_detector.py`
**LINES:** Around line 49-53

```python
# FIND this section in anomaly_detector.py:
self.anomaly_model = IsolationForest(
    contamination=0.1,        ← Change this (0.1 = 10% anomalies expected)
    random_state=42,
    n_estimators=100          ← Change this (higher = more complex)
)
```

### 3. 🏷️ **Add New Anomaly Types**
**WHERE:** `anomaly_detector.py`
**LINES:** Around line 31-39

```python
# FIND this dictionary in anomaly_detector.py:
self.anomaly_types = {
    'pothole': 0,
    'broken_streetlight': 1,
    'damaged_sign': 2,
    'graffiti': 3,
    'debris': 4,
    'cracked_pavement': 5,
    'other': 6,
    # ADD NEW TYPES HERE:
    'broken_fence': 7,        ← ADD this line
    'fallen_tree': 8          ← ADD this line
}
```

### 4. 🎨 **Customize Classification Rules**
**WHERE:** `anomaly_detector.py`
**LINES:** Around line 270-282

```python
# FIND this section in anomaly_detector.py:
# Simple classification rules
if edge_density > 0.1 and contour_count > 50:
    return 'cracked_pavement'
elif color_std < 0.1 and edge_density < 0.05:
    return 'broken_streetlight'
# ADD NEW RULES HERE:
elif edge_density > 0.15 and color_std > 0.3:    ← ADD new conditions
    return 'broken_fence'                        ← ADD new return
```

### 5. 📊 **Create Custom Scripts**
**WHERE:** Create NEW files in your project folder

#### Example: Create `quick_test.py`
```python
# CREATE A NEW FILE called quick_test.py
from anomaly_detector import CivicAnomalyDetector

# Simple test script
detector = CivicAnomalyDetector('civic_anomaly_model.pkl')
result = detector.detect_anomalies('sample_data/test/your_image.jpg')
print(f"Is anomaly: {result['is_anomaly']}")
print(f"Type: {result['anomaly_type']}")
```

#### Example: Create `batch_analyzer.py`
```python
# CREATE A NEW FILE called batch_analyzer.py
import os
from anomaly_detector import CivicAnomalyDetector

detector = CivicAnomalyDetector('civic_anomaly_model.pkl')
results = detector.batch_detect('sample_data/test')

# Count anomalies by type
anomaly_counts = {}
for result in results:
    if result['is_anomaly']:
        atype = result['anomaly_type']
        anomaly_counts[atype] = anomaly_counts.get(atype, 0) + 1

print("Anomaly Summary:")
for atype, count in anomaly_counts.items():
    print(f"  {atype}: {count}")
```

## 🎯 **Step-by-Step: Where to Add Code in VSCode**

### **Method 1: Editing Existing Files**
1. **Open VSCode**
2. **Open your project folder** (File → Open Folder)
3. **Click on the file** you want to edit (e.g., `anomaly_detector.py`)
4. **Find the line number** mentioned in the guide
5. **Make your changes**
6. **Save** (Ctrl + S)

### **Method 2: Creating New Files**
1. **Right-click** in VSCode Explorer panel
2. **Select "New File"**
3. **Type filename** (e.g., `quick_test.py`)
4. **Add your code**
5. **Save** (Ctrl + S)

### **Method 3: Terminal Commands**
1. **Open terminal** in VSCode (Ctrl + `)
2. **Make sure you're in project directory**
3. **Type the command** and press Enter

## 📍 **Visual Guide: Finding Code Locations**

### Finding Line Numbers in VSCode:
1. **Press Ctrl + G** to go to specific line
2. **Look at bottom-right** corner for current line number
3. **Use Ctrl + F** to search for specific text

### Finding Specific Code Sections:
```python
# Search for these phrases to find the right locations:

# For anomaly types:
Search: "self.anomaly_types"

# For classification rules:
Search: "Simple classification rules"

# For model parameters:
Search: "IsolationForest"

# For feature extraction:
Search: "def extract_features"
```

## 🚨 **IMPORTANT: What NOT to Edit**

### ❌ **Don't Edit These:**
- `venv/` folder (virtual environment)
- Import statements at the top of files (unless you know what you're doing)
- Function definitions (def function_name) unless adding new ones
- Class structure (indentation is critical in Python)

### ✅ **Safe to Edit:**
- Parameter values (numbers in parentheses)
- Dictionary values and new entries
- Comments (lines starting with #)
- Adding new functions at the end of files
- Creating entirely new files

## 💡 **Quick Examples for Common Tasks**

### **Task 1: Change How Sensitive Detection Is**
**File:** `anomaly_detector.py`
**Find:** `contamination=0.1`
**Change to:** `contamination=0.05` (more sensitive) or `contamination=0.2` (less sensitive)

### **Task 2: Add a New Command**
**File:** `main.py`
**Find:** The section with other commands (around line 172)
**Add:** New parser for your command

### **Task 3: Test Your Changes**
**Terminal:** Run this after making changes:
```bash
python main.py detect --image sample_data/test/test_image.jpg
```

## 🔧 **Backup Strategy**
Before making changes:
1. **Copy the original file** (right-click → copy → paste → rename to `filename_backup.py`)
2. **Or use Git** if you know it
3. **Or just copy the whole project folder**

## 🆘 **If Something Breaks**
1. **Check the error message** - it usually tells you the line number
2. **Compare with the backup** you made
3. **Undo changes** (Ctrl + Z in VSCode)
4. **Restart from the backup**

---

## 📋 **Quick Reference: Where Does What Go?**

| What You Want to Do | File to Edit | Search For |
|-------------------|--------------|------------|
| Change sensitivity | `anomaly_detector.py` | `contamination=` |
| Add anomaly type | `anomaly_detector.py` | `self.anomaly_types` |
| Modify classification | `anomaly_detector.py` | `Simple classification rules` |
| Add new command | `main.py` | `subparsers.add_parser` |
| Create test script | **NEW FILE** | `your_script.py` |
| Run the program | **TERMINAL** | `python main.py` |

Remember: Most of the time, you'll be using **terminal commands** to run the program, not editing code!
