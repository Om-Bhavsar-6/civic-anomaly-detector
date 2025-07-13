import os
import tkinter as tk
from tkinter import messagebox, ttk
from tkinter import filedialog
import threading
from anomaly_detector import AnomalyDetector

def create_sample():
    """Create sample data folders"""
    try:
        os.makedirs('sample_data/normal', exist_ok=True)
        os.makedirs('sample_data/anomalies', exist_ok=True)
        messagebox.showinfo("Success", "Sample data folders created successfully!")
    except Exception as e:
        messagebox.showerror("Error", f"Failed to create folders: {str(e)}")

def browse_folder():
    """Browse and select a folder"""
    folder_path = filedialog.askdirectory()
    if folder_path:
        folder_var.set(folder_path)

def update_progress(current, total):
    """Update progress bar"""
    progress_var.set((current / total) * 100)
    progress_label.config(text=f"Processing: {current}/{total} images")
    root.update_idletasks()

def analyze_folder():
    """Analyze folder for anomalies using the AnomalyDetector"""
    folder_path = folder_var.get()
    if not folder_path:
        messagebox.showwarning("Warning", "Please select a folder first!")
        return
    
    # Disable the analyze button during processing
    analyze_button.config(state='disabled')
    progress_frame.grid(row=10, column=0, columnspan=3, padx=10, pady=5, sticky=(tk.W, tk.E))
    
    def run_analysis():
        try:
            global detector
            if 'detector' not in globals():
                detector = AnomalyDetector()
            results = detector.analyze_folder(folder_path, progress_callback=update_progress)
            
            # Hide progress bar
            progress_frame.grid_forget()
            
            # Check if results contain an error
            if isinstance(results, dict) and 'error' in results:
                messagebox.showerror("Error", results['error'])
                return
            
            # Show results
            summary = detector.get_summary()
            
            # Create results window
            show_results_window(summary, results)
            
        except Exception as e:
            progress_frame.grid_forget()
            messagebox.showerror("Error", f"Analysis failed: {str(e)}")
        finally:
            analyze_button.config(state='normal')
    
    # Run analysis in a separate thread to avoid freezing the UI
    threading.Thread(target=run_analysis, daemon=True).start()

def show_results_window(summary, results):
    """Display analysis results in a new window"""
    results_window = tk.Toplevel(root)
    results_window.title("Analysis Results")
    results_window.geometry("600x500")
    
    # Create notebook for tabs
    notebook = ttk.Notebook(results_window)
    notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
    
    # Summary tab
    summary_frame = ttk.Frame(notebook)
    notebook.add(summary_frame, text="Summary")
    
    summary_text = tk.Text(summary_frame, wrap=tk.WORD, font=('Courier', 10))
    summary_scrollbar = ttk.Scrollbar(summary_frame, orient=tk.VERTICAL, command=summary_text.yview)
    summary_text.configure(yscrollcommand=summary_scrollbar.set)
    
    summary_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    summary_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    summary_text.insert(tk.END, summary)
    summary_text.config(state='disabled')
    
    # Detailed results tab
    details_frame = ttk.Frame(notebook)
    notebook.add(details_frame, text="Detailed Results")
    
    # Create treeview for detailed results
    columns = ('Filename', 'Anomaly Score', 'Status', 'Brightness', 'Contrast', 'Edge Density')
    tree = ttk.Treeview(details_frame, columns=columns, show='headings')
    
    for col in columns:
        tree.heading(col, text=col)
        tree.column(col, width=100)
    
    details_scrollbar = ttk.Scrollbar(details_frame, orient=tk.VERTICAL, command=tree.yview)
    tree.configure(yscrollcommand=details_scrollbar.set)
    
    tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
    details_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    # Populate tree with results
    for result in results:
        status = "ANOMALY" if result['is_anomaly'] else "Normal"
        tree.insert('', tk.END, values=(
            result['filename'],
            result['anomaly_score'],
            status,
            result['features']['brightness'],
            result['features']['contrast'],
            result['features']['edge_density']
        ))
    
    # Configure row colors
    tree.tag_configure('anomaly', background='#ffcccc')
    tree.tag_configure('normal', background='#ccffcc')
    
    # Apply tags
    for i, result in enumerate(results):
        item = tree.get_children()[i]
        tag = 'anomaly' if result['is_anomaly'] else 'normal'
        tree.item(item, tags=(tag,))

def create_ui():
    """Create the main UI"""
    global folder_var, root, analyze_button, progress_frame, progress_var, progress_label, detector
    
    # Initialize detector globally
    detector = AnomalyDetector()
    
    root = tk.Tk()
    root.title("Civic Anomaly Detector")
    root.geometry("600x500")
    root.resizable(True, True)
    
    # Create main frame
    main_frame = ttk.Frame(root, padding="10")
    main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
    
    # Configure grid weights
    root.columnconfigure(0, weight=1)
    root.rowconfigure(0, weight=1)
    main_frame.columnconfigure(1, weight=1)
    
    # Title
    title_label = ttk.Label(main_frame, text="Civic Anomaly Detector", font=('Arial', 16, 'bold'))
    title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
    
    # Setup section
    setup_label = ttk.Label(main_frame, text="Setup:", font=('Arial', 12, 'bold'))
    setup_label.grid(row=1, column=0, columnspan=3, sticky=tk.W, pady=(0, 10))
    
    create_button = ttk.Button(main_frame, text="Create Sample Data Folders", command=create_sample)
    create_button.grid(row=2, column=0, columnspan=3, pady=5, sticky=(tk.W, tk.E))

    # Model training section
    model_frame = ttk.LabelFrame(main_frame, text="Model Training", padding=5)
    model_frame.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5)

    train_button = ttk.Button(model_frame, text="Train Model", command=lambda: threading.Thread(
        target=lambda: messagebox.showinfo("Training", detector.train_model()),
        daemon=True
    ).start())
    train_button.grid(row=0, column=0, padx=5, pady=2, sticky=tk.W)

    load_button = ttk.Button(model_frame, text="Load Model", command=lambda: messagebox.showinfo(
        "Model Status",
        detector.load_model()
    ))
    load_button.grid(row=0, column=1, padx=5, pady=2, sticky=tk.W)

    model_status = ttk.Label(model_frame, text="Model: Not Loaded")
    model_status.grid(row=0, column=2, padx=5, pady=2, sticky=tk.W)

    # Update model status
    def update_model_status():
        if detector.model is not None:
            model_status.config(text="Model: Loaded")
        else:
            model_status.config(text="Model: Not Loaded")

    # Separator
    separator = ttk.Separator(main_frame, orient='horizontal')
    separator.grid(row=4, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=20)
    
    # Analysis section
    analysis_label = ttk.Label(main_frame, text="Analysis:", font=('Arial', 12, 'bold'))
    analysis_label.grid(row=5, column=0, columnspan=3, sticky=tk.W, pady=(0, 10))
    
    # Folder selection
    folder_label = ttk.Label(main_frame, text="Select folder to analyze:")
    folder_label.grid(row=6, column=0, sticky=tk.W, pady=5)
    
    folder_var = tk.StringVar()
    folder_entry = ttk.Entry(main_frame, textvariable=folder_var, width=40)
    folder_entry.grid(row=6, column=1, sticky=(tk.W, tk.E), padx=(10, 5), pady=5)
    
    browse_button = ttk.Button(main_frame, text="Browse", command=browse_folder)
    browse_button.grid(row=6, column=2, padx=(5, 0), pady=5)
    
    # Analyze button
    analyze_button = ttk.Button(main_frame, text="Analyze for Anomalies", command=analyze_folder)
    analyze_button.grid(row=7, column=0, columnspan=3, pady=20, sticky=(tk.W, tk.E))
    
    # Progress bar section (initially hidden)
    progress_frame = ttk.Frame(main_frame)
    progress_var = tk.DoubleVar()
    progress_bar = ttk.Progressbar(progress_frame, variable=progress_var, maximum=100)
    progress_bar.pack(fill=tk.X, pady=5)
    progress_label = ttk.Label(progress_frame, text="")
    progress_label.pack()
    
    # Status/Info section
    info_label = ttk.Label(main_frame, text="Instructions:", font=('Arial', 12, 'bold'))
    info_label.grid(row=11, column=0, columnspan=3, sticky=tk.W, pady=(20, 5))
    
    info_text = tk.Text(main_frame, height=6, width=60, wrap=tk.WORD)
    info_text.grid(row=12, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=5)
    
    # Add scrollbar for text
    scrollbar = ttk.Scrollbar(main_frame, orient=tk.VERTICAL, command=info_text.yview)
    scrollbar.grid(row=12, column=3, sticky=(tk.N, tk.S), pady=5)
    info_text.configure(yscrollcommand=scrollbar.set)
    
    # Add instructions text
    instructions = """1. Click 'Create Sample Data Folders' to set up the required directory structure.

2. Place your normal civic images in the 'sample_data/normal' folder.

3. Place any known anomaly images in the 'sample_data/anomalies' folder.

4. Click 'Train Model' to train the ML model on normal images (optional but recommended).

5. Select a folder containing images to analyze and click 'Analyze for Anomalies'.

6. The system will process the images and identify potential anomalies."""
    
    info_text.insert(tk.END, instructions)
    info_text.configure(state='disabled')  # Make it read-only
    
    # Configure grid weights for resizing
    main_frame.rowconfigure(12, weight=1)
    
    root.mainloop()

if __name__ == '__main__':
    create_ui()
