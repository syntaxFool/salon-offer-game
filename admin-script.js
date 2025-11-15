// Password protection
const ADMIN_PASSWORD = 'salon2025'; // Change this to your desired password

function checkPassword() {
    const savedAuth = sessionStorage.getItem('adminAuth');
    if (savedAuth === ADMIN_PASSWORD) {
        return true;
    }
    
    const password = prompt('Enter admin password to access this page:');
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', password);
        return true;
    } else if (password !== null) {
        alert('Incorrect password. Access denied.');
    }
    window.location.href = 'index.html';
    return false;
}

// Check password on page load
if (!checkPassword()) {
    throw new Error('Access denied');
}

// Default configuration
const defaultConfig = {
    offers: [
        { text: "10% OFF", description: "10% off your next service", color: "#264653", textColor: "#ffffff", weight: 35, subtext: "", subtext2: "" },
        { text: "15% OFF", description: "15% off your next service", color: "#2a9d8f", textColor: "#ffffff", weight: 10, subtext: "", subtext2: "" },
        { text: "20% OFF", description: "20% off your next service", color: "#e76f51", textColor: "#000000", weight: 8, subtext: "", subtext2: "" },
        { text: "25% OFF", description: "25% off your next service", color: "#f4a261", textColor: "#000000", weight: 5, subtext: "", subtext2: "" },
        { text: "30% OFF", description: "30% off your next service", color: "#e63946", textColor: "#ffffff", weight: 2, subtext: "", subtext2: "" },
        { text: "35% OFF", description: "35% off your next service", color: "#c1121f", textColor: "#ffffff", weight: 2, subtext: "", subtext2: "" },
        { text: "40% OFF", description: "40% off your next service", color: "#8338ec", textColor: "#ffffff", weight: 2, subtext: "", subtext2: "" },
        { text: "FREE", description: "Free manicure service", color: "#fb5607", textColor: "#000000", weight: 8, subtext: "Manicure", subtext2: "" },
        { text: "FREE", description: "Free blowout service", color: "#3a86ff", textColor: "#ffffff", weight: 12, subtext: "Blowout", subtext2: "" },
        { text: "FREE", description: "Free deep conditioning treatment", color: "#06a77d", textColor: "#ffffff", weight: 5, subtext: "Deep", subtext2: "Condition" },
        { text: "FREE", description: "Free scalp massage (15 min)", color: "#ff006e", textColor: "#ffffff", weight: 10, subtext: "Scalp", subtext2: "Massage" },
        { text: "50% OFF", description: "50% off your next haircut", color: "#ffbe0b", textColor: "#000000", weight: 1, subtext: "Haircut", subtext2: "" }
    ],
    appearance: {
        headerText: "🌟 Thank You for Your Visit! 🌟",
        subtitleText: "Spin the wheel to reveal your exclusive offer for next time!",
        footerText: "We appreciate your business! See you soon! 💇‍♀️✨",
        spinDuration: 4000,
        confettiCount: 50
    },
    logging: {
        enabled: true,
        googleSheetUrl: ''
    }
};

// Load configuration from localStorage or use default
function loadConfig() {
    try {
        const saved = localStorage.getItem('salonWheelConfig');
        return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultConfig));
    } catch (error) {
        console.error('Error loading config:', error);
        return JSON.parse(JSON.stringify(defaultConfig));
    }
}

// Save configuration to localStorage
function saveConfig(config) {
    try {
        localStorage.setItem('salonWheelConfig', JSON.stringify(config));
    } catch (error) {
        showStatus('❌ Error saving: ' + error.message, 'error');
    }
}

// Current configuration
let config = loadConfig();

// Calculate total weight
function calculateTotalWeight() {
    return config.offers.reduce((sum, offer) => sum + offer.weight, 0);
}

// Auto-fix weights to total 100%
function autoFixWeights() {
    const total = calculateTotalWeight();
    if (total === 0) return;
    
    // Proportionally adjust weights to total 100
    const scaleFactor = 100 / total;
    let adjustedTotal = 0;
    
    config.offers.forEach((offer, index) => {
        if (index < config.offers.length - 1) {
            offer.weight = Math.round(offer.weight * scaleFactor);
            adjustedTotal += offer.weight;
        }
    });
    
    // Adjust last offer to ensure exactly 100
    config.offers[config.offers.length - 1].weight = 100 - adjustedTotal;
    
    renderOffers();
    renderStats();
    showStatus('✅ Weights adjusted to total 100%', 'success');
}

// Render statistics
function renderStats() {
    const totalWeight = calculateTotalWeight();
    const statsContainer = document.getElementById('statsContainer');
    
    // Add warning if total doesn't equal 100
    let warningHTML = '';
    if (totalWeight !== 100) {
        warningHTML = `
            <div style="background: #fff3cd; border-left: 5px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                <strong>⚠️ Warning:</strong> Total weight is ${totalWeight}%. It should equal 100%.
                <button id="autoFixBtn" style="margin-left: 15px; padding: 8px 15px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Auto-Fix to 100%</button>
            </div>
        `;
    }
    
    const statsHTML = config.offers.map(offer => {
        return `
            <div class="stat-card">
                <div class="label">${offer.text}${offer.subtext ? ' ' + offer.subtext : ''}</div>
                <div class="percentage">${offer.weight}%</div>
                <div class="value">Win Chance</div>
            </div>
        `;
    }).join('');
    
    statsContainer.innerHTML = warningHTML + statsHTML;
    
    // Add auto-fix button listener
    const autoFixBtn = document.getElementById('autoFixBtn');
    if (autoFixBtn) {
        autoFixBtn.addEventListener('click', autoFixWeights);
    }
}

// Render offer row for table
function renderOfferRow(offer, index) {
    return `
        <tr data-index="${index}">
            <td>${index + 1}</td>
            <td>
                <input type="text" class="offer-text" value="${offer.text}" data-index="${index}">
            </td>
            <td>
                <input type="text" class="offer-description" value="${offer.description}" data-index="${index}">
            </td>
            <td>
                <input type="number" class="offer-weight" value="${offer.weight}" min="0" max="100" data-index="${index}">
            </td>
            <td>
                <input type="text" class="offer-subtext" value="${offer.subtext || ''}" data-index="${index}" placeholder="Optional">
            </td>
            <td>
                <input type="text" class="offer-subtext2" value="${offer.subtext2 || ''}" data-index="${index}" placeholder="Optional">
            </td>
            <td>
                <input type="color" class="offer-color" value="${offer.color}" data-index="${index}">
            </td>
            <td>
                <select class="offer-textcolor" data-index="${index}">
                    <option value="#ffffff" ${offer.textColor === '#ffffff' ? 'selected' : ''}>White</option>
                    <option value="#000000" ${offer.textColor === '#000000' ? 'selected' : ''}>Black</option>
                </select>
            </td>
            <td>
                <button class="btn-delete delete-offer" data-index="${index}">🗑️ Delete</button>
            </td>
        </tr>
    `;
}

// Render all offers in table
function renderOffers() {
    const tableBody = document.getElementById('offersTableBody');
    tableBody.innerHTML = config.offers.map((offer, index) => renderOfferRow(offer, index)).join('');
    attachOfferEventListeners();
}

// Render appearance settings
function renderAppearance() {
    document.getElementById('headerText').value = config.appearance.headerText;
    document.getElementById('subtitleText').value = config.appearance.subtitleText;
    document.getElementById('footerText').value = config.appearance.footerText;
    document.getElementById('spinDuration').value = config.appearance.spinDuration;
    document.getElementById('confettiCount').value = config.appearance.confettiCount;
    
    // Render logging settings
    if (config.logging) {
        document.getElementById('googleSheetUrl').value = config.logging.googleSheetUrl || '';
        document.getElementById('enableLogging').checked = config.logging.enabled !== false;
    }
}

// Attach event listeners to offer inputs
function attachOfferEventListeners() {
    // Text inputs
    document.querySelectorAll('.offer-text').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            config.offers[index].text = e.target.value;
            renderStats();
        });
    });
    
    // Description inputs
    document.querySelectorAll('.offer-description').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            config.offers[index].description = e.target.value;
        });
    });
    
    // Weight inputs
    document.querySelectorAll('.offer-weight').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            config.offers[index].weight = parseInt(e.target.value) || 1;
            renderStats();
        });
    });
    
    // Color inputs
    document.querySelectorAll('.offer-color').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            config.offers[index].color = e.target.value;
        });
    });
    
    // Text color selects
    document.querySelectorAll('.offer-textcolor').forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            config.offers[index].textColor = e.target.value;
        });
    });
    
    // Subtext inputs
    document.querySelectorAll('.offer-subtext').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            config.offers[index].subtext = e.target.value;
        });
    });
    
    document.querySelectorAll('.offer-subtext2').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            config.offers[index].subtext2 = e.target.value;
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-offer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (confirm('Are you sure you want to delete this offer?')) {
                config.offers.splice(index, 1);
                renderOffers();
                renderStats();
            }
        });
    });
}

// Show status message
function showStatus(message, type = 'success') {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 3000);
}

// Save configuration
document.getElementById('saveBtn').addEventListener('click', () => {
    // Update appearance settings
    config.appearance.headerText = document.getElementById('headerText').value;
    config.appearance.subtitleText = document.getElementById('subtitleText').value;
    config.appearance.footerText = document.getElementById('footerText').value;
    config.appearance.spinDuration = parseInt(document.getElementById('spinDuration').value);
    config.appearance.confettiCount = parseInt(document.getElementById('confettiCount').value);
    
    // Update logging settings
    if (!config.logging) config.logging = {};
    config.logging.googleSheetUrl = document.getElementById('googleSheetUrl').value.trim();
    config.logging.enabled = document.getElementById('enableLogging').checked;
    
    saveConfig(config);
    showStatus('✅ Configuration saved successfully!', 'success');
});

// Reset to default
document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset to default configuration? This cannot be undone.')) {
        config = JSON.parse(JSON.stringify(defaultConfig));
        saveConfig(config);
        renderOffers();
        renderStats();
        renderAppearance();
        showStatus('🔄 Reset to default configuration', 'info');
    }
});

// Export configuration
document.getElementById('exportBtn').addEventListener('click', () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'salon-wheel-config.json';
    link.click();
    URL.revokeObjectURL(url);
    showStatus('📥 Configuration exported', 'success');
});

// Import configuration
document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                config = imported;
                saveConfig(config);
                renderOffers();
                renderStats();
                renderAppearance();
                showStatus('📤 Configuration imported successfully!', 'success');
            } catch (error) {
                showStatus('❌ Invalid configuration file', 'error');
            }
        };
        reader.readAsText(file);
    }
});

// Add new offer
document.getElementById('addOfferBtn').addEventListener('click', () => {
    if (config.offers.length >= 12) {
        showStatus('⚠️ Maximum 12 offers allowed', 'error');
        return;
    }
    
    const newOffer = {
        text: "NEW OFFER",
        description: "New offer description",
        color: "#333333",
        textColor: "#ffffff",
        weight: 0,
        subtext: "",
        subtext2: ""
    };
    config.offers.push(newOffer);
    renderOffers();
    renderStats();
    showStatus('➕ New offer added. Adjust weights to total 100%', 'info');
});

// Appearance settings listeners
document.getElementById('headerText').addEventListener('input', () => {
    config.appearance.headerText = document.getElementById('headerText').value;
});

document.getElementById('subtitleText').addEventListener('input', () => {
    config.appearance.subtitleText = document.getElementById('subtitleText').value;
});

document.getElementById('footerText').addEventListener('input', () => {
    config.appearance.footerText = document.getElementById('footerText').value;
});

document.getElementById('spinDuration').addEventListener('input', () => {
    config.appearance.spinDuration = parseInt(document.getElementById('spinDuration').value);
});

document.getElementById('confettiCount').addEventListener('input', () => {
    config.appearance.confettiCount = parseInt(document.getElementById('confettiCount').value);
});

// Initialize
renderOffers();
renderStats();
renderAppearance();
