// Market Trends JavaScript
// Handles dynamic market data, price trends, and insights

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('market') || document.querySelector('.price-table')) {
        initializeMarketTrends();
    }
});

function initializeMarketTrends() {
    console.log('📊 Initializing Market Trends...');

    // Load market data
    loadMarketPrices();
    loadPriceChart();
    loadMarketInsights();

    // Set up real-time updates
    startPriceUpdates();

    // Set up interactive features
    setupMarketFilters();
    setupChartControls();
}

function loadMarketPrices() {
    const marketData = generateMarketData();
    displayPriceTable(marketData);
    updateDashboardStats(marketData);
}

function generateMarketData() {
    const baseData = [
        { name: 'Rice (Basmati)', variety: 'Premium Grade', basePrice: 2850, emoji: '🌾' },
        { name: 'Maize (Hybrid)', variety: 'Yellow Corn', basePrice: 1950, emoji: '🌽' },
        { name: 'Wheat (Durum)', variety: 'Hard Wheat', basePrice: 2250, emoji: '🌾' },
        { name: 'Tomato', variety: 'Fresh Grade A', basePrice: 4200, emoji: '🍅' },
        { name: 'Potato', variety: 'Fresh Medium', basePrice: 1850, emoji: '🥔' },
        { name: 'Onion', variety: 'Red Onion', basePrice: 2300, emoji: '🧅' },
        { name: 'Cotton', variety: 'Long Staple', basePrice: 5800, emoji: '🌿' },
        { name: 'Sugarcane', variety: 'Co-86032', basePrice: 3200, emoji: '🎋' }
    ];

    return baseData.map(crop => {
        const changePercent = (Math.random() - 0.5) * 20; // -10% to +10%
        const currentPrice = Math.round(crop.basePrice * (1 + changePercent / 100));
        const volume = Math.floor(Math.random() * 2000) + 500; // 500-2500 tons

        return {
            name: crop.name,
            variety: crop.variety,
            currentPrice: currentPrice,
            basePrice: crop.basePrice,
            change: Math.round(changePercent * 10) / 10,
            direction: changePercent > 2 ? 'up' : changePercent < -2 ? 'down' : 'stable',
            volume: volume,
            emoji: crop.emoji,
            lastUpdated: new Date()
        };
    });
}

function displayPriceTable(data) {
    const tableBody = document.querySelector('.table-body');
    if (!tableBody) return;

    tableBody.innerHTML = data.map(crop => `
        <div class="price-row" data-crop="${crop.name.toLowerCase()}">
            <div class="crop-cell">
                <span class="crop-icon">${crop.emoji}</span>
                <div class="crop-info">
                    <span class="crop-name">${crop.name}</span>
                    <span class="crop-variety">${crop.variety}</span>
                </div>
            </div>
            <span class="price-cell">₹${crop.currentPrice.toLocaleString()}/quintal</span>
            <span class="change-cell ${crop.direction}">
                ${crop.change > 0 ? '+' : ''}${crop.change}% ${getDirectionArrow(crop.direction)}
            </span>
            <span class="volume-cell">${crop.volume.toLocaleString()} tons</span>
            <button class="action-btn no-loading" onclick="viewCropDetails('${crop.name}')">View Details</button>
        </div>
    `).join('');

    // Add click handlers for rows
    document.querySelectorAll('.price-row').forEach(row => {
        row.addEventListener('click', function() {
            const cropName = this.dataset.crop;
            highlightCropInChart(cropName);
        });
    });
}

function getDirectionArrow(direction) {
    switch(direction) {
        case 'up': return '↗';
        case 'down': return '↘';
        default: return '→';
    }
}

function updateDashboardStats(data) {
    const upTrends = data.filter(crop => crop.direction === 'up').length;
    const downTrends = data.filter(crop => crop.direction === 'down').length;
    const totalCrops = data.length;

    // Update dashboard cards
    updateDashboardCard('Market Index', `+${((upTrends - downTrends) / totalCrops * 5).toFixed(1)}%`);
    updateDashboardCard('Price Stability', upTrends > downTrends ? 'Bullish' : downTrends > upTrends ? 'Bearish' : 'Stable');
    updateDashboardCard('Demand Outlook', 'Strong');
    updateDashboardCard('Active Markets', totalCrends.toString());
}

function updateDashboardCard(title, value) {
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        const cardTitle = card.querySelector('.card-title');
        if (cardTitle && cardTitle.textContent.includes(title)) {
            const cardValue = card.querySelector('.card-value');
            if (cardValue) {
                cardValue.textContent = value;

                // Add animation
                cardValue.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    cardValue.style.transform = 'scale(1)';
                }, 200);
            }
        }
    });
}

function loadPriceChart() {
    const chartContainer = document.querySelector('.chart-visual');
    if (!chartContainer) return;

    // Generate sample price data for the chart
    const priceData = generateChartData('rice', 7);
    displayPriceChart(priceData);
}

function generateChartData(crop, days) {
    const data = [];
    const basePrice = 2850; // Base price for rice
    let currentPrice = basePrice;

    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Generate realistic price variation
        const variation = (Math.random() - 0.5) * 0.1; // ±5% daily variation
        currentPrice = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, currentPrice * (1 + variation)));

        data.push({
            date: date,
            price: Math.round(currentPrice),
            day: date.toLocaleDateString('en-IN', { weekday: 'short' })
        });
    }

    return data;
}

function displayPriceChart(data) {
    const chartBars = document.querySelector('.chart-bars');
    const chartLabels = document.querySelector('.chart-labels');

    if (!chartBars || !chartLabels) return;

    const maxPrice = Math.max(...data.map(d => d.price));
    const minPrice = Math.min(...data.map(d => d.price));
    const priceRange = maxPrice - minPrice;

    // Update chart bars
    chartBars.innerHTML = data.map((point, index) => {
        const height = priceRange > 0 ? ((point.price - minPrice) / priceRange) * 80 + 20 : 50;
        const isLatest = index === data.length - 1;

        return `
            <div class="price-bar ${isLatest ? 'active' : ''}" 
                 style="height: ${height}%" 
                 data-value="${point.price}"
                 data-date="${point.date.toLocaleDateString()}"
                 onmouseover="showPriceTooltip(this, '${point.price}', '${point.date.toLocaleDateString()}')"
                 onmouseout="hidePriceTooltip()">
            </div>
        `;
    }).join('');

    // Update chart labels
    chartLabels.innerHTML = data.map(point => 
        `<span>${point.day}</span>`
    ).join('');

    // Update chart statistics
    updateChartStats(data);
}

function showPriceTooltip(element, price, date) {
    // Remove existing tooltip
    hidePriceTooltip();

    const tooltip = document.createElement('div');
    tooltip.id = 'price-tooltip';
    tooltip.innerHTML = `
        <div style="background: #1f2937; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; white-space: nowrap;">
            <div>₹${parseInt(price).toLocaleString()}</div>
            <div style="opacity: 0.8;">${date}</div>
        </div>
    `;

    tooltip.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 10px;
        z-index: 1000;
        pointer-events: none;
    `;

    element.appendChild(tooltip);
}

function hidePriceTooltip() {
    const tooltip = document.getElementById('price-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function updateChartStats(data) {
    const prices = data.map(d => d.price);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    const statsItems = document.querySelectorAll('.stat-item');
    if (statsItems.length >= 3) {
        statsItems[0].textContent = `High: ₹${high.toLocaleString()}`;
        statsItems[1].textContent = `Low: ₹${low.toLocaleString()}`;
        statsItems[2].textContent = `Avg: ₹${avg.toLocaleString()}`;
    }
}

function loadMarketInsights() {
    const insights = generateMarketInsights();
    displayMarketInsights(insights);
}

function generateMarketInsights() {
    const insightTemplates = [
        {
            title: 'Seasonal Harvest Impact on Rice Prices',
            content: 'With the onset of harvest season in major rice-producing states, market prices are expected to stabilize. Early reports indicate good quality yields, which should help meet domestic demand.',
            category: 'opportunity',
            badge: '✅ Opportunity',
            timeAgo: '2 hours ago'
        },
        {
            title: 'Weather Alert Affects Tomato Supply',
            content: 'Unexpected weather patterns in key tomato-growing regions have reduced supply by 15%. Prices have surged accordingly, creating potential opportunities for farmers with good storage facilities.',
            category: 'hot',
            badge: '🔥 Hot Trend',
            timeAgo: '4 hours ago'
        },
        {
            title: 'Cotton Export Demand Rising',
            content: 'International demand for cotton has increased by 8% this quarter. Export opportunities are expanding, particularly for premium quality cotton varieties.',
            category: 'analysis',
            badge: '📊 Analysis',
            timeAgo: '6 hours ago'
        },
        {
            title: 'Monsoon Forecast Update',
            content: 'Latest meteorological reports suggest normal to above-normal rainfall in most agricultural regions. Farmers should prepare for optimal kharif planting conditions.',
            category: 'warning',
            badge: '⚠️ Weather Alert',
            timeAgo: '8 hours ago'
        }
    ];

    return insightTemplates.map(template => ({
        ...template,
        id: generateId(),
        source: 'AgriSense Market Intelligence'
    }));
}

function displayMarketInsights(insights) {
    const insightsGrid = document.querySelector('.insights-grid');
    if (!insightsGrid) return;

    insightsGrid.innerHTML = insights.map(insight => `
        <div class="insight-card ${insight.category}">
            <div class="insight-badge">${insight.badge}</div>
            <h3 class="insight-title">${insight.title}</h3>
            <p class="insight-content">${insight.content}</p>
            <div class="insight-meta">
                <span class="insight-source">${insight.source}</span>
                <span class="insight-time">${insight.timeAgo}</span>
            </div>
        </div>
    `).join('');
}

function setupMarketFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');

    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            applyFilters();
        });
    });
}

function applyFilters() {
    const cropFilter = document.querySelector('.filter-select:first-of-type')?.value || 'all';
    const timeFilter = document.querySelector('.filter-select:last-of-type')?.value || 'today';

    const rows = document.querySelectorAll('.price-row');

    rows.forEach(row => {
        let show = true;

        if (cropFilter !== 'all') {
            const cropName = row.querySelector('.crop-name').textContent.toLowerCase();
            show = show && (
                (cropFilter === 'cereals' && (cropName.includes('rice') || cropName.includes('wheat') || cropName.includes('maize'))) ||
                (cropFilter === 'vegetables' && (cropName.includes('tomato') || cropName.includes('potato') || cropName.includes('onion'))) ||
                (cropFilter === 'cash_crops' && (cropName.includes('cotton') || cropName.includes('sugarcane')))
            );
        }

        row.style.display = show ? 'grid' : 'none';
    });

    AgriSense.showNotification(`Filtered by: ${cropFilter} (${timeFilter})`, 'info');
}

function setupChartControls() {
    const timeButtons = document.querySelectorAll('.time-btn');
    const chartSelect = document.querySelector('.chart-select');

    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            timeButtons.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Update chart based on selected time period
            const period = this.textContent;
            const days = period === '7D' ? 7 : period === '1M' ? 30 : period === '3M' ? 90 : 365;

            const crop = chartSelect?.value.toLowerCase().replace(' ', '') || 'rice';
            const chartData = generateChartData(crop, Math.min(days, 30)); // Limit to 30 days for demo

            displayPriceChart(chartData);
            AgriSense.showNotification(`Chart updated for ${period}`, 'info');
        });
    });

    if (chartSelect) {
        chartSelect.addEventListener('change', function() {
            const crop = this.value.toLowerCase().replace(' ', '');
            const activePeriod = document.querySelector('.time-btn.active')?.textContent || '7D';
            const days = activePeriod === '7D' ? 7 : activePeriod === '1M' ? 30 : 7;

            const chartData = generateChartData(crop, days);
            displayPriceChart(chartData);

            // Update chart title
            const chartTitle = document.querySelector('.chart-title');
            if (chartTitle) {
                chartTitle.textContent = `${this.value} Price Movement - Last ${activePeriod}`;
            }
        });
    }
}

function startPriceUpdates() {
    // Simulate real-time price updates every 30 seconds
    setInterval(() => {
        updateRandomPrices();
    }, 30000);
}

function updateRandomPrices() {
    const rows = document.querySelectorAll('.price-row');
    if (rows.length === 0) return;

    // Update 1-2 random prices
    const numberOfUpdates = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numberOfUpdates; i++) {
        const randomRow = rows[Math.floor(Math.random() * rows.length)];
        const priceCell = randomRow.querySelector('.price-cell');
        const changeCell = randomRow.querySelector('.change-cell');

        if (priceCell && changeCell) {
            // Generate small price change
            const currentPrice = parseInt(priceCell.textContent.replace(/[^\d]/g, ''));
            const changePercent = (Math.random() - 0.5) * 2; // ±1% change
            const newPrice = Math.round(currentPrice * (1 + changePercent / 100));

            // Update price with animation
            priceCell.style.transform = 'scale(1.1)';
            priceCell.style.color = changePercent > 0 ? '#16a34a' : '#dc2626';

            setTimeout(() => {
                priceCell.textContent = `₹${newPrice.toLocaleString()}/quintal`;
                priceCell.style.transform = 'scale(1)';
                priceCell.style.color = '';

                // Update change indicator
                const direction = changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'stable';
                changeCell.className = `change-cell ${direction}`;
                changeCell.textContent = `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}% ${getDirectionArrow(direction)}`;
            }, 200);
        }
    }
}

function viewCropDetails(cropName) {
    AgriSense.showNotification(`Loading detailed analysis for ${cropName}...`, 'info');

    // Simulate loading detailed crop information
    setTimeout(() => {
        const modal = createDetailModal(cropName);
        document.body.appendChild(modal);
    }, 1000);
}

function createDetailModal(cropName) {
    const modal = document.createElement('div');
    modal.className = 'crop-detail-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${cropName} Market Analysis</h3>
                <button onclick="this.closest('.crop-detail-modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="detail-grid">
                    <div class="detail-section">
                        <h4>Price Trend</h4>
                        <p>Current trend shows ${Math.random() > 0.5 ? 'upward' : 'stable'} movement</p>
                    </div>
                    <div class="detail-section">
                        <h4>Supply Status</h4>
                        <p>Supply levels are ${Math.random() > 0.5 ? 'adequate' : 'tight'} for the season</p>
                    </div>
                    <div class="detail-section">
                        <h4>Demand Forecast</h4>
                        <p>Expected ${Math.random() > 0.5 ? 'strong' : 'moderate'} demand in coming weeks</p>
                    </div>
                    <div class="detail-section">
                        <h4>Trading Recommendation</h4>
                        <p>${Math.random() > 0.5 ? 'Good time to sell' : 'Hold for better prices'}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    return modal;
}

function highlightCropInChart(cropName) {
    console.log(`Highlighting ${cropName} in chart`);
    // This would update the chart to show data for the selected crop
}

function generateId() {
    return 'market_' + Math.random().toString(36).substr(2, 9);
}

// Export price update function for manual refresh
window.refreshMarketData = function() {
    AgriSense.showNotification('Refreshing market data...', 'info');
    setTimeout(() => {
        loadMarketPrices();
        AgriSense.showNotification('Market data updated!', 'success');
    }, 1000);
};
