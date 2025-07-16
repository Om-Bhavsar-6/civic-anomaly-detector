# Civic Anomaly Detector

Civic Anomaly Detector is a Flask-based web application designed to detect and visualize anomalies in civic data. This project aims to provide an intuitive interface for users to explore and analyze civic data anomalies.

## Project Structure

```
civic_anomaly_detector
├── src
│   ├── app.py                # Entry point of the application
│   ├── controllers           # Contains route handling logic
│   ├── models                # Defines data models and database interactions
│   ├── static                # Contains static files (CSS, JS)
│   ├── templates             # Contains HTML templates
│   └── utils                 # Utility functions and classes
├── tests                     # Test cases for the application
├── README.md                 # Project documentation
└── requirements.txt          # Project dependencies
```

## Installation

To set up the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd civic_anomaly_detector
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Usage

To run the application, execute the following command:

```
python src/app.py
```

Visit `http://127.0.0.1:5000` in your web browser to access the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.