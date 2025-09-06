// Crop Recommendation JavaScript
// Handles intelligent crop recommendation functionality

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.recommend-btn') || window.location.pathname.includes('crop')) {
        initializeCropRecommendation();
    }
});

function initializeCropRecommendation() {
    console.log('🌾 Initializing Crop Recommendation...');

    // Override form processing for this page
    window.processForm = processCropForm;

    // Load recommendation history
    loadRecommendationHistory();

    // Set up form enhancements
    setupFormEnhancements();
}

function setupFormEnhancements() {
    // Add real-time validation
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });

    // pH level guidance
    const phInput = document.getElementById('ph-level');
    if (phInput) {
        phInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            let message = '';
            let color = '#6b7280';

            if (value < 5.5) {
                message = 'Very acidic - may need lime treatment';
                color = '#dc2626';
            } else if (value < 6.0) {
                message = 'Acidic - suitable for acid-loving crops';
                color = '#f59e0b';
            } else if (value <= 7.0) {
                message = 'Optimal pH for most crops';
                color = '#16a34a';
            } else if (value <= 8.0) {
                message = 'Slightly alkaline - good for many crops';
                color = '#f59e0b';
            } else {
                message = 'Very alkaline - may limit crop options';
                color = '#dc2626';
            }

            showInputHint(this, message, color);
        });
    }

    // Farm size guidance
    const farmSizeInput = document.getElementById('farm-size');
    if (farmSizeInput) {
        farmSizeInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            let message = '';

            if (value < 1) {
                message = 'Small scale - focus on high-value crops';
            } else if (value <= 5) {
                message = 'Medium scale - diverse crop options';
            } else {
                message = 'Large scale - consider mechanization-friendly crops';
            }

            showInputHint(this, message, '#16a34a');
        });
    }
}

function showInputHint(input, message, color) {
    // Remove existing hint
    const existingHint = input.parentNode.querySelector('.input-hint');
    if (existingHint) {
        existingHint.remove();
    }

    // Add new hint
    const hint = document.createElement('div');
    hint.className = 'input-hint';
    hint.textContent = message;
    hint.style.cssText = `
        font-size: 0.75rem;
        color: ${color};
        margin-top: 0.25rem;
        font-style: italic;
    `;

    input.parentNode.insertBefore(hint, input.nextSibling);
}

function processCropForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate required fields
    const requiredFields = ['location', 'farm-size', 'soil-type'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        AgriSense.showNotification('Please fill in all required fields', 'warning');
        return;
    }

    // Show processing message
    AgriSense.showNotification('Analyzing your farm conditions...', 'info');

    // Simulate AI processing
    setTimeout(() => {
        const recommendations = generateCropRecommendations(data);
        displayRecommendations(recommendations);
        saveRecommendationToHistory(data, recommendations);
        AgriSense.showNotification('Recommendations ready!', 'success');
    }, 2500);
}

function generateCropRecommendations(farmData) {
    const cropDatabase = {
        rice: {
            name: 'Rice (Basmati)',
            varieties: ['Basmati 385', 'Pusa Basmati 1121', 'Traditional Basmati'],
            optimalConditions: {
                temperature: [20, 35],
                rainfall: [1000, 2000],
                pH: [5.5, 7.0],
                soilTypes: ['clay', 'loamy'],
                seasons: ['kharif']
            },
            economicData: {
                marketPrice: 2850,
                yieldRange: [4.5, 6.0],
                profitMargin: 'High',
                marketDemand: 'Very High'
            }
        },
        wheat: {
            name: 'Wheat (Durum)',
            varieties: ['HD-2967', 'PBW-343', 'WH-542'],
            optimalConditions: {
                temperature: [15, 25],
                rainfall: [300, 800],
                pH: [6.0, 7.5],
                soilTypes: ['loamy', 'clay'],
                seasons: ['rabi']
            },
            economicData: {
                marketPrice: 2250,
                yieldRange: [2.5, 4.0],
                profitMargin: 'Moderate',
                marketDemand: 'High'
            }
        },
        maize: {
            name: 'Maize (Hybrid)',
            varieties: ['NK-6240', 'DKC-9108', 'P-3396'],
            optimalConditions: {
                temperature: [18, 32],
                rainfall: [500, 1200],
                pH: [6.0, 7.5],
                soilTypes: ['loamy', 'sandy'],
                seasons: ['kharif', 'rabi']
            },
            economicData: {
                marketPrice: 1950,
                yieldRange: [3.0, 5.0],
                profitMargin: 'Moderate',
                marketDemand: 'High'
            }
        },
        tomato: {
            name: 'Tomato (Hybrid)',
            varieties: ['Arka Rakshak', 'Pusa Ruby', 'Himsona'],
            optimalConditions: {
                temperature: [18, 28],
                rainfall: [600, 1000],
                pH: [6.0, 7.0],
                soilTypes: ['loamy', 'sandy'],
                seasons: ['kharif', 'rabi', 'zaid']
            },
            economicData: {
                marketPrice: 4200,
                yieldRange: [25, 40],
                profitMargin: 'Very High',
                marketDemand: 'Very High'
            }
        },
        potato: {
            name: 'Potato',
            varieties: ['Kufri Pukhraj', 'Kufri Badshah', 'Kufri Chipsona'],
            optimalConditions: {
                temperature: [15, 25],
                rainfall: [500, 800],
                pH: [5.5, 6.5],
                soilTypes: ['loamy', 'sandy'],
                seasons: ['rabi']
            },
            economicData: {
                marketPrice: 1850,
                yieldRange: [15, 25],
                profitMargin: 'Moderate',
                marketDemand: 'High'
            }
        },
        sugarcane: {
            name: 'Sugarcane',
            varieties: ['Co-86032', 'Co-0238', 'Co-1148'],
            optimalConditions: {
                temperature: [20, 35],
                rainfall: [1000, 1500],
                pH: [6.0, 8.0],
                soilTypes: ['loamy', 'clay'],
                seasons: ['kharif']
            },
            economicData: {
                marketPrice: 3200,
                yieldRange: [60, 80],
                profitMargin: 'High',
                marketDemand: 'High'
            }
        }
    };

    const recommendations = [];

    Object.entries(cropDatabase).forEach(([cropKey, crop]) => {
        const score = calculateCompatibilityScore(crop, farmData);
        if (score > 40) { // Only show crops with reasonable compatibility
            recommendations.push({
                id: generateId(),
                cropName: crop.name,
                variety: crop.varieties[0],
                matchPercentage: Math.round(score),
                expectedYield: `${crop.economicData.yieldRange[0]}-${crop.economicData.yieldRange[1]} tons/hectare`,
                marketPrice: crop.economicData.marketPrice,
                profitMargin: crop.economicData.profitMargin,
                suitabilityReason: generateSuitabilityReason(crop, farmData, score),
                growingTips: generateGrowingTips(crop, farmData),
                marketDemand: crop.economicData.marketDemand,
                bestVarieties: crop.varieties.slice(0, 3)
            });
        }
    });

    // Sort by compatibility score
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return {
        id: generateId(),
        farmData: farmData,
        recommendations: recommendations.slice(0, 3), // Top 3 recommendations
        analysisSummary: generateAnalysisSummary(farmData, recommendations),
        timestamp: new Date()
    };
}

function calculateCompatibilityScore(crop, farmData) {
    let score = 0;
    let maxScore = 0;

    // Temperature compatibility (20 points)
    if (farmData.temperature) {
        const temp = parseFloat(farmData.temperature);
        const tempRange = crop.optimalConditions.temperature;
        if (temp >= tempRange[0] && temp <= tempRange[1]) {
            score += 20;
        } else if (Math.abs(temp - tempRange[0]) <= 5 || Math.abs(temp - tempRange[1]) <= 5) {
            score += 10;
        }
    }
    maxScore += 20;

    // Rainfall compatibility (20 points)
    if (farmData.rainfall) {
        const rainfall = parseFloat(farmData.rainfall);
        const rainRange = crop.optimalConditions.rainfall;
        if (rainfall >= rainRange[0] && rainfall <= rainRange[1]) {
            score += 20;
        } else if (Math.abs(rainfall - rainRange[0]) <= 200 || Math.abs(rainfall - rainRange[1]) <= 200) {
            score += 10;
        }
    }
    maxScore += 20;

    // pH compatibility (15 points)
    if (farmData['ph-level']) {
        const pH = parseFloat(farmData['ph-level']);
        const pHRange = crop.optimalConditions.pH;
        if (pH >= pHRange[0] && pH <= pHRange[1]) {
            score += 15;
        } else if (Math.abs(pH - pHRange[0]) <= 0.5 || Math.abs(pH - pHRange[1]) <= 0.5) {
            score += 7;
        }
    }
    maxScore += 15;

    // Soil type compatibility (15 points)
    if (farmData['soil-type'] && crop.optimalConditions.soilTypes.includes(farmData['soil-type'])) {
        score += 15;
    }
    maxScore += 15;

    // Season compatibility (10 points)
    if (farmData.season && crop.optimalConditions.seasons.includes(farmData.season)) {
        score += 10;
    }
    maxScore += 10;

    // Farm size consideration (10 points)
    if (farmData['farm-size']) {
        const farmSize = parseFloat(farmData['farm-size']);
        if (farmSize >= 5) {
            score += 10;
        } else if (farmSize >= 2) {
            score += 5;
        }
    }
    maxScore += 10;

    // Budget consideration (10 points)
    if (farmData.budget) {
        score += 8; // Assuming most crops are within budget range
    }
    maxScore += 10;

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
}

function generateSuitabilityReason(crop, farmData, score) {
    const reasons = [];

    if (farmData['soil-type'] && crop.optimalConditions.soilTypes.includes(farmData['soil-type'])) {
        reasons.push(`excellent soil compatibility (${farmData['soil-type']})`);
    }

    if (farmData.season && crop.optimalConditions.seasons.includes(farmData.season)) {
        reasons.push(`optimal planting season (${farmData.season]})`);
    }

    if (farmData['ph-level']) {
        const pH = parseFloat(farmData['ph-level']);
        const pHRange = crop.optimalConditions.pH;
        if (pH >= pHRange[0] && pH <= pHRange[1]) {
            reasons.push('ideal pH conditions');
        }
    }

    if (reasons.length === 0) {
        return 'Basic compatibility with your farm conditions';
    }

    return 'Suitable due to: ' + reasons.join(', ');
}

function generateGrowingTips(crop, farmData) {
    const tips = [];

    // Season tips
    tips.push(`Plant during ${crop.optimalConditions.seasons.join(' or ')} season`);

    // pH tips
    const pHRange = crop.optimalConditions.pH;
    tips.push(`Maintain soil pH between ${pHRange[0]}-${pHRange[1]}`);

    // Soil-specific tips
    if (farmData['soil-type'] === 'clay') {
        tips.push('Ensure proper drainage to prevent waterlogging');
    } else if (farmData['soil-type'] === 'sandy') {
        tips.push('Regular irrigation and organic matter addition recommended');
    }

    // Rainfall tips
    if (farmData.rainfall) {
        const rainfall = parseFloat(farmData.rainfall);
        if (rainfall < 500) {
            tips.push('Supplemental irrigation will be necessary');
        } else if (rainfall > 1500) {
            tips.push('Focus on drainage and disease prevention');
        }
    }

    // Market tips
    tips.push('Monitor market prices for optimal selling time');

    return tips;
}

function generateAnalysisSummary(farmData, recommendations) {
    if (recommendations.length === 0) {
        return 'Based on your farm conditions, we recommend consulting with local agricultural experts for specialized crop selection advice.';
    }

    const bestCrop = recommendations[0];
    let summary = `Based on your farm conditions, ${bestCrop.cropName} shows the highest compatibility (${bestCrop.matchPercentage}% match). `;

    if (farmData['soil-type'] === 'clay') {
        summary += 'Your clay soil provides good water retention suitable for water-loving crops. ';
    } else if (farmData['soil-type'] === 'sandy') {
        summary += 'Sandy soil offers good drainage, ideal for root crops and those sensitive to waterlogging. ';
    } else if (farmData['soil-type'] === 'loamy') {
        summary += 'Loamy soil provides the best of both worlds - good drainage and water retention. ';
    }

    if (recommendations.length > 1) {
        summary += `Consider crop rotation with ${recommendations[1].cropName} for soil health benefits.`;
    }

    return summary;
}

function displayRecommendations(data) {
    const recommendationsGrid = document.querySelector('.recommendations-grid');
    if (!recommendationsGrid) return;

    recommendationsGrid.innerHTML = data.recommendations.map((rec, index) => `
        <div class="recommendation-card ${index === 0 ? 'best-match' : ''}">
            ${index === 0 ? '<div class="match-badge">Best Match</div>' : ''}
            <div class="crop-visual">${getCropEmoji(rec.cropName)}</div>
            <h3 class="crop-name">${rec.cropName}</h3>
            <div class="match-score">${rec.matchPercentage}% Match</div>

            <div class="crop-details">
                <div class="detail-item">
                    <span class="detail-label">Best Variety:</span>
                    <span class="detail-value">${rec.variety}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Expected Yield:</span>
                    <span class="detail-value">${rec.expectedYield}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Market Price:</span>
                    <span class="detail-value">${AgriSense.formatCurrency(rec.marketPrice)}/quintal</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Profit Margin:</span>
                    <span class="detail-value profit-${rec.profitMargin.toLowerCase().replace(' ', '-')}">${rec.profitMargin}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Market Demand:</span>
                    <span class="detail-value">${rec.marketDemand}</span>
                </div>
            </div>

            <div style="margin-top: 1rem;">
                <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">💡 Growing Tips:</h4>
                <ul style="font-size: 0.75rem; color: #6b7280; margin-left: 1rem;">
                    ${rec.growingTips.slice(0, 3).map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    // Update analysis summary
    const analysisNote = document.querySelector('.analysis-note p');
    if (analysisNote) {
        analysisNote.innerHTML = `<strong>Analysis:</strong> ${data.analysisSummary}`;
    }
}

function getCropEmoji(cropName) {
    const emojis = {
        'rice': '🌾',
        'wheat': '🌾', 
        'maize': '🌽',
        'tomato': '🍅',
        'potato': '🥔',
        'sugarcane': '🎋'
    };

    const key = Object.keys(emojis).find(k => cropName.toLowerCase().includes(k));
    return emojis[key] || '🌱';
}

function saveRecommendationToHistory(farmData, recommendations) {
    let history = JSON.parse(localStorage.getItem('recommendationHistory') || '[]');
    history.unshift(recommendations);

    // Keep only last 10 recommendations
    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    localStorage.setItem('recommendationHistory', JSON.stringify(history));
}

function loadRecommendationHistory() {
    // This would display history if there's a history section on the page
    console.log('Recommendation history loaded');
}

function generateId() {
    return 'crop_' + Math.random().toString(36).substr(2, 9);
}
