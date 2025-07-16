document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('imageInput');
    const files = fileInput.files;
    
    if (files.length === 0) {
        alert('Please select at least one image');
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images[]', files[i]);
    }

    // Show loading spinner
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('results').classList.add('d-none');

    try {
        const response = await fetch('/api/analyze-batch', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        displayResults(data.results);
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        document.getElementById('loading').classList.add('d-none');
    }
});

function displayResults(results) {
    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = '';

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <p><strong>File:</strong> ${result.filename}</p>
            <p><strong>Anomaly Score:</strong> 
                <span class="anomaly-score ${result.is_anomaly ? 'anomaly-true' : 'anomaly-false'}">
                    ${result.anomaly_score.toFixed(4)}
                </span>
            </p>
            <p><strong>Is Anomaly:</strong> 
                <span class="${result.is_anomaly ? 'anomaly-true' : 'anomaly-false'}">
                    ${result.is_anomaly ? 'Yes' : 'No'}
                </span>
            </p>
        `;
        resultContent.appendChild(resultItem);
    });

    document.getElementById('results').classList.remove('d-none');
}