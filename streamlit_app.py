
import streamlit as st
import os
import tempfile
import zipfile
from pathlib import Path
import pandas as pd
from anomaly_detector import AnomalyDetector
import plotly.express as px
import plotly.graph_objects as go

def create_sample_folders():
    """Create sample data folders"""
    try:
        os.makedirs('sample_data/normal', exist_ok=True)
        os.makedirs('sample_data/anomalies', exist_ok=True)
        return True, "Sample data folders created successfully!"
    except Exception as e:
        return False, f"Failed to create folders: {str(e)}"

def process_uploaded_files(uploaded_files, temp_dir):
    """Process uploaded files and save them to temp directory"""
    file_paths = []
    for uploaded_file in uploaded_files:
        file_path = os.path.join(temp_dir, uploaded_file.name)
        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        file_paths.append(file_path)
    return file_paths

def create_visualizations(results):
    """Create visualizations for the analysis results"""
    if not results:
        return None, None, None
    
    # Prepare data for visualization
    df = pd.DataFrame(results)
    
    # Anomaly distribution pie chart
    anomaly_counts = df['is_anomaly'].value_counts()
    labels = []
    values = []
    
    for is_anomaly, count in anomaly_counts.items():
        if is_anomaly:
            labels.append('Anomaly')
        else:
            labels.append('Normal')
        values.append(count)
    
    fig_pie = px.pie(
        values=values,
        names=labels,
        title="Distribution of Images",
        color_discrete_map={'Normal': 'green', 'Anomaly': 'red'}
    )
    
    # Anomaly scores histogram
    fig_hist = px.histogram(
        df, 
        x='anomaly_score', 
        nbins=20,
        title="Distribution of Anomaly Scores",
        color='is_anomaly',
        color_discrete_map={True: 'red', False: 'green'}
    )
    
    # Extract brightness feature for scatter plot
    df['brightness'] = df['features'].apply(lambda x: x['brightness'])
    df['contrast'] = df['features'].apply(lambda x: x['contrast'])
    
    # Features scatter plot
    fig_scatter = px.scatter(
        df,
        x='brightness',
        y='anomaly_score',
        color='is_anomaly',
        hover_data=['filename', 'contrast'],
        title="Brightness vs Anomaly Score",
        color_discrete_map={True: 'red', False: 'green'}
    )
    
    return fig_pie, fig_hist, fig_scatter

def main():
    st.set_page_config(
        page_title="Civic Anomaly Detector",
        page_icon="🏛️",
        layout="wide"
    )
    
    st.title("🏛️ Civic Anomaly Detector")
    st.markdown("### Detect anomalies in civic infrastructure images")
    
    # Sidebar for setup
    with st.sidebar:
        st.header("Setup")
        
        if st.button("Create Sample Data Folders"):
            success, message = create_sample_folders()
            if success:
                st.success(message)
            else:
                st.error(message)
        
        st.markdown("---")
        
        st.header("Instructions")
        st.markdown("""
        1. **Setup**: Click 'Create Sample Data Folders' to set up directory structure
        2. **Upload**: Upload images using the file uploader below
        3. **Analyze**: Click 'Analyze Images' to detect anomalies
        4. **Review**: Check the results and visualizations
        """)
    
    # Main content area
    tab1, tab2, tab3 = st.tabs(["Upload & Analyze", "Results", "Visualizations"])
    
    with tab1:
        st.header("Upload Images for Analysis")
        
        uploaded_files = st.file_uploader(
            "Choose image files",
            type=['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'tif'],
            accept_multiple_files=True,
            help="Upload one or more images to analyze for anomalies"
        )
        
        if uploaded_files:
            st.write(f"Uploaded {len(uploaded_files)} files")
            
            # Show preview of uploaded files
            cols = st.columns(min(len(uploaded_files), 4))
            for i, uploaded_file in enumerate(uploaded_files[:4]):
                with cols[i]:
                    st.image(uploaded_file, caption=uploaded_file.name, width=150)
            
            if len(uploaded_files) > 4:
                st.write(f"... and {len(uploaded_files) - 4} more files")
            
            if st.button("Analyze Images", type="primary"):
                with st.spinner("Analyzing images for anomalies..."):
                    # Create temporary directory
                    with tempfile.TemporaryDirectory() as temp_dir:
                        # Save uploaded files
                        file_paths = process_uploaded_files(uploaded_files, temp_dir)
                        
                        # Initialize detector and analyze
                        detector = AnomalyDetector()
                        
                        # Create progress bar
                        progress_bar = st.progress(0)
                        status_text = st.empty()
                        
                        def update_progress(current, total):
                            progress = current / total
                            progress_bar.progress(progress)
                            status_text.text(f"Processing: {current}/{total} images")
                        
                        try:
                            results = detector.analyze_folder(temp_dir, progress_callback=update_progress)
                            
                            progress_bar.empty()
                            status_text.empty()
                            
                            # Check if results contain an error
                            if isinstance(results, dict) and 'error' in results:
                                st.error(results['error'])
                                return
                            
                            # Store results in session state
                            st.session_state.analysis_results = results
                            st.session_state.analysis_summary = detector.get_summary()
                            
                            st.success("Analysis completed!")
                            st.balloons()
                            
                        except Exception as e:
                            st.error(f"Analysis failed: {str(e)}")
    
    with tab2:
        st.header("Analysis Results")
        
        if 'analysis_results' in st.session_state:
            # Display summary
            st.subheader("Summary")
            st.text(st.session_state.analysis_summary)
            
            # Display detailed results
            st.subheader("Detailed Results")
            
            results_data = []
            for result in st.session_state.analysis_results:
                results_data.append({
                    'Filename': result['filename'],
                    'Anomaly Score': result['anomaly_score'],
                    'Status': 'ANOMALY' if result['is_anomaly'] else 'Normal',
                    'Brightness': result['features']['brightness'],
                    'Contrast': result['features']['contrast'],
                    'Edge Density': result['features']['edge_density']
                })
            
            df = pd.DataFrame(results_data)
            
            # Style the dataframe
            def highlight_anomalies(row):
                return ['background-color: #ffcccc' if row['Status'] == 'ANOMALY' 
                       else 'background-color: #ccffcc' for _ in row]
            
            styled_df = df.style.apply(highlight_anomalies, axis=1)
            st.dataframe(styled_df, use_container_width=True)
            
            # Download results as CSV
            csv = df.to_csv(index=False)
            st.download_button(
                label="Download Results as CSV",
                data=csv,
                file_name="anomaly_analysis_results.csv",
                mime="text/csv"
            )
            
        else:
            st.info("No analysis results available. Please upload and analyze images first.")
    
    with tab3:
        st.header("Visualizations")
        
        if 'analysis_results' in st.session_state:
            results = st.session_state.analysis_results
            
            # Create visualizations
            fig_pie, fig_hist, fig_scatter = create_visualizations(results)
            
            col1, col2 = st.columns(2)
            
            with col1:
                if fig_pie:
                    st.plotly_chart(fig_pie, use_container_width=True)
            
            with col2:
                if fig_hist:
                    st.plotly_chart(fig_hist, use_container_width=True)
            
            # Statistics
            st.subheader("Statistics")
            total_images = len(results)
            anomalies = sum(1 for r in results if r['is_anomaly'])
            normal = total_images - anomalies
            
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.metric("Total Images", total_images)
            with col2:
                st.metric("Normal Images", normal)
            with col3:
                st.metric("Anomalies Detected", anomalies)
            with col4:
                anomaly_rate = (anomalies / total_images * 100) if total_images > 0 else 0
                st.metric("Anomaly Rate", f"{anomaly_rate:.1f}%")
            
        else:
            st.info("No analysis results available. Please upload and analyze images first.")

if __name__ == "__main__":
    main()
