// Disease Detection JavaScript
// Handles plant disease detection functionality

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.upload-box') || document.querySelector('#detect-btn')) {
        initializeDiseaseDetection();
    }
});

function initializeDiseaseDetection() {
    console.log('🔍 Initializing Disease Detection...');

    // Set up file upload
    setupFileUpload();

    // Set up detection button
    setupDetectionButton();

    // Override form processing for this page
    window.processForm = processDiseaseForm;

    // Load detection history
    loadDetectionHistory();
}

function setupFileUpload() {
    const uploadBox = document.querySelector('.upload-box');
    const fileInput = document.getElementById('plant-image') || createFileInput();

    if (!uploadBox) return;

    // Create file input if it doesn't exist
    if (!document.getElementById('plant-image')) {
        uploadBox.appendChild(fileInput);
    }

    // Handle drag and drop
    uploadBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#f0fdf4';
        this.style.borderColor = '#16a34a';
    });

    uploadBox.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '';
        this.style.borderColor = '';
    });

    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '';
        this.style.borderColor = '';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    // Handle click to browse
    uploadBox.addEventListener('click', function() {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
}

function createFileInput() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'plant-image';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    return fileInput;
}

function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
        AgriSense.showNotification('Please select an image file', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        AgriSense.showNotification('File size too large. Please select an image under 10MB', 'error');
        return;
    }

    // Update upload box to show selected file
    const uploadBox = document.querySelector('.upload-box');
    const reader = new FileReader();

    reader.onload = function(e) {
        uploadBox.innerHTML = `
            <img src="${e.target.result}" alt="Selected plant image" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
            <p style="margin-top: 10px; color: #16a34a; font-weight: 600;">✓ Image Selected</p>
            <p style="font-size: 0.875rem; color: #6b7280;">${file.name}</p>
        `;
    };

    reader.readAsDataURL(file);

    // Store file reference
    window.selectedFile = file;

    // Enable detection button
    const detectBtn = document.querySelector('.detect-btn, #detect-btn');
    if (detectBtn) {
        detectBtn.disabled = false;
        detectBtn.textContent = 'Detect Disease 🔍';
    }
}

function setupDetectionButton() {
    const detectBtn = document.querySelector('.detect-btn, #detect-btn');

    if (!detectBtn) return;

    detectBtn.addEventListener('click', function(e) {
        e.preventDefault();
        runDiseaseDetection();
    });
}

function processDiseaseForm(form) {
    runDiseaseDetection();
}

function runDiseaseDetection() {
    if (!window.selectedFile) {
        AgriSense.showNotification('Please select an image first', 'warning');
        return;
    }

    const cropType = document.getElementById('crop-type')?.value || 'unknown';

    AgriSense.showNotification('Analyzing plant image...', 'info');

    // Simulate AI processing
    setTimeout(() => {
        const result = simulateDisease(cropType);
        displayDetectionResult(result);
        saveDetectionToHistory(result);
        AgriSense.showNotification('Analysis complete!', 'success');
    }, 3000);
}

function simulateDisease(cropType) {
    const diseases = {
        tomato: [
            {
                name: 'Early Blight',
                confidence: 94,
                severity: 'Moderate',
                symptoms: 'Dark spots with concentric rings on older leaves, yellowing around spots',
                treatment: 'Apply fungicides containing chlorothalonil or copper. Remove affected leaves and ensure good air circulation.',
                prevention: 'Rotate crops, space plants properly, avoid overhead watering, remove plant debris'
            },
            {
                name: 'Late Blight',
                confidence: 87,
                severity: 'Severe',
                symptoms: 'Water-soaked spots that turn brown, white fuzzy growth on leaf undersides',
                treatment: 'Apply fungicides immediately, remove affected plants, improve ventilation',
                prevention: 'Use disease-resistant varieties, avoid overhead watering, ensure good drainage'
            },
            {
                name: 'Healthy Plant',
                confidence: 96,
                severity: 'None',
                symptoms: 'No visible disease symptoms detected',
                treatment: 'Continue regular monitoring and good cultural practices',
                prevention: 'Maintain proper watering, fertilization, and pest management'
            }
        ],
        rice: [
            {
                name: 'Brown Spot',
                confidence: 91,
                severity: 'Moderate',
                symptoms: 'Small brown spots on leaves, may have yellow halos',
                treatment: 'Apply appropriate fungicides, improve field drainage',
                prevention: 'Balanced fertilization, proper water management, use resistant varieties'
            },
            {
                name: 'Blast Disease',
                confidence: 88,
                severity: 'Severe',
                symptoms: 'Diamond-shaped lesions with gray centers on leaves',
                treatment: 'Apply systemic fungicides, adjust nitrogen fertilization',
                prevention: 'Use resistant varieties, balanced nutrition, proper field sanitation'
            }
        ],
        wheat: [
            {
                name: 'Rust',
                confidence: 89,
                severity: 'Severe',
                symptoms: 'Orange to reddish-brown pustules on leaves and stems',
                treatment: 'Apply fungicides containing triazoles, monitor field regularly',
                prevention: 'Use resistant varieties, avoid excessive nitrogen, proper crop rotation'
            }
        ]
    };

    const cropDiseases = diseases[cropType.toLowerCase()] || diseases.tomato;
    const randomDisease = cropDiseases[Math.floor(Math.random() * cropDiseases.length)];

    return {
        id: generateId(),
        cropType: cropType,
        predictedDisease: randomDisease.name,
        confidence: randomDisease.confidence,
        severity: randomDisease.severity,
        symptoms: randomDisease.symptoms,
        treatment: randomDisease.treatment,
        prevention: randomDisease.prevention,
        timestamp: new Date(),
        imageUrl: URL.createObjectURL(window.selectedFile)
    };
}

function displayDetectionResult(result) {
    // Update preview box
    const previewBox = document.querySelector('.preview-box');
    if (previewBox) {
        previewBox.innerHTML = `
            <img src="${result.imageUrl}" alt="Analyzed plant" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;">
        `;
    }

    // Update results
    updateResultSection('Predicted Disease', result.predictedDisease);
    updateResultSection('Confidence Score', `${result.confidence}%`);

    // Update recommended actions
    const actionsList = document.querySelector('.recommended-list');
    if (actionsList) {
        actionsList.innerHTML = `
            <li><strong>Severity:</strong> ${result.severity}</li>
            <li><strong>Immediate Action:</strong> ${result.treatment}</li>
            <li><strong>Prevention:</strong> ${result.prevention}</li>
        `;
    }

    // Update description
    const descriptionContent = document.querySelector('.description-content');
    if (descriptionContent) {
        descriptionContent.innerHTML = `
            <h4 style="color: #16a34a; margin-bottom: 10px;">🔍 Analysis Results</h4>
            <p><strong>Disease:</strong> ${result.predictedDisease}</p>
            <p><strong>Confidence:</strong> ${result.confidence}%</p>
            <p><strong>Severity:</strong> ${result.severity}</p>
            <br>
            <h4 style="color: #16a34a; margin-bottom: 10px;">📋 Symptoms</h4>
            <p>${result.symptoms}</p>
            <br>
            <h4 style="color: #16a34a; margin-bottom: 10px;">💊 Treatment</h4>
            <p>${result.treatment}</p>
            <br>
            <h4 style="color: #16a34a; margin-bottom: 10px;">🛡️ Prevention</h4>
            <p>${result.prevention}</p>
        `;
    }
}

function updateResultSection(title, value) {
    const sections = document.querySelectorAll('.result-section h3');
    sections.forEach(section => {
        if (section.textContent.includes(title)) {
            const valueElement = section.nextElementSibling;
            if (valueElement && valueElement.classList.contains('result-value')) {
                valueElement.textContent = value;

                // Add color based on content
                if (title === 'Confidence Score') {
                    const confidence = parseInt(value);
                    if (confidence >= 80) valueElement.style.color = '#16a34a';
                    else if (confidence >= 60) valueElement.style.color = '#f59e0b';
                    else valueElement.style.color = '#dc2626';
                }
            }
        }
    });
}

function saveDetectionToHistory(result) {
    let history = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
    history.unshift(result);

    // Keep only last 10 detections
    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    localStorage.setItem('detectionHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

function loadDetectionHistory() {
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyGrid = document.querySelector('.history-grid');
    if (!historyGrid) return;

    const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]');

    if (history.length === 0) {
        historyGrid.innerHTML = '<p style="text-align: center; color: #6b7280;">No previous detections found</p>';
        return;
    }

    historyGrid.innerHTML = history.map((detection, index) => `
        <div class="history-card" onclick="showDetectionDetails('${detection.id}')">
            <div class="history-img">
                <span>📸</span>
            </div>
            <div class="history-title">${detection.predictedDisease}</div>
            <div class="history-date">${formatDate(detection.timestamp)}</div>
            <div style="font-size: 0.75rem; color: #16a34a; font-weight: 600;">${detection.confidence}% confidence</div>
        </div>
    `).join('');
}

function showDetectionDetails(id) {
    const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
    const detection = history.find(d => d.id === id);

    if (detection) {
        displayDetectionResult(detection);
        AgriSense.showNotification('Previous detection loaded', 'info');
    }
}

// Utility function
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function generateId() {
    return 'det_' + Math.random().toString(36).substr(2, 9);
}
