// Default configuration
const defaultConfig = {
    offers: [
        { text: "10% OFF", description: "10% off your next service", color: "#264653", textColor: "#ffffff", weight: 10, subtext: "", subtext2: "" },
        { text: "15% OFF", description: "15% off your next service", color: "#2a9d8f", textColor: "#ffffff", weight: 8, subtext: "", subtext2: "" },
        { text: "20% OFF", description: "20% off your next service", color: "#e76f51", textColor: "#000000", weight: 6, subtext: "", subtext2: "" },
        { text: "25% OFF", description: "25% off your next service", color: "#f4a261", textColor: "#000000", weight: 4, subtext: "", subtext2: "" },
        { text: "30% OFF", description: "30% off your next service", color: "#e63946", textColor: "#ffffff", weight: 2, subtext: "", subtext2: "" },
        { text: "FREE", description: "Free manicure service", color: "#8338ec", textColor: "#ffffff", weight: 3, subtext: "Manicure", subtext2: "" },
        { text: "FREE", description: "Free blowout service", color: "#fb5607", textColor: "#000000", weight: 3, subtext: "Blowout", subtext2: "" },
        { text: "5% OFF", description: "5% off your next service", color: "#3a86ff", textColor: "#ffffff", weight: 80, subtext: "", subtext2: "" },
        { text: "50% OFF", description: "50% off your next haircut", color: "#ffbe0b", textColor: "#000000", weight: 1, subtext: "Haircut", subtext2: "" },
        { text: "FREE", description: "Free deep conditioning treatment", color: "#06a77d", textColor: "#ffffff", weight: 3, subtext: "Deep", subtext2: "Condition" },
        { text: "35% OFF", description: "35% off your next service", color: "#c1121f", textColor: "#ffffff", weight: 2, subtext: "", subtext2: "" },
        { text: "FREE", description: "Free scalp massage (15 min)", color: "#ff006e", textColor: "#ffffff", weight: 3, subtext: "Scalp", subtext2: "Massage" }
    ],
    appearance: {
        headerText: "🌟 Thank You for Your Visit! 🌟",
        subtitleText: "Spin the wheel to reveal your exclusive offer for next time!",
        footerText: "We appreciate your business! See you soon! 💇‍♀️✨",
        spinDuration: 4000,
        confettiCount: 50
    }
};

// Load configuration from localStorage or use default
function loadConfig() {
    const saved = localStorage.getItem('salonWheelConfig');
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultConfig));
}

// Save configuration to localStorage
function saveConfig(config) {
    localStorage.setItem('salonWheelConfig', JSON.stringify(config));
}

// Current configuration
let config = loadConfig();

// Calculate total weight
function calculateTotalWeight() {
    return config.offers.reduce((sum, offer) => sum + offer.weight, 0);
}

// Render statistics
function renderStats() {
    const totalWeight = calculateTotalWeight();
    const statsContainer = document.getElementById('statsContainer');
    
    const statsHTML = config.offers.map(offer => {
        const percentage = ((offer.weight / totalWeight) * 100).toFixed(2);
        return `
            <div class="stat-card">
                <div class="label">${offer.text}${offer.subtext ? ' ' + offer.subtext : ''}</div>
                <div class="percentage">${percentage}%</div>
                <div class="value">Weight: ${offer.weight}</div>
            </div>
        `;
    }).join('');
    
    statsContainer.innerHTML = statsHTML;
}

// Render offer card
function renderOfferCard(offer, index) {
    return `
        <div class="offer-card" data-index="${index}">
            <div class="offer-header">
                <span class="offer-number">Offer #${index + 1}</span>
                <button class="btn btn-danger delete-offer" data-index="${index}">🗑️ Delete</button>
            </div>
            <div class="offer-grid">
                <div class="form-group">
                    <label>Display Text</label>
                    <input type="text" class="offer-text" value="${offer.text}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" class="offer-description" value="${offer.description}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Weight (Probability)</label>
                    <input type="number" class="offer-weight" value="${offer.weight}" min="1" max="100" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Background Color</label>
                    <input type="color" class="offer-color" value="${offer.color}" data-index="${index}">
                    <div class="color-preview" style="background-color: ${offer.color}; color: ${offer.textColor};">Preview</div>
                </div>
                <div class="form-group">
                    <label>Text Color</label>
                    <select class="offer-textcolor" data-index="${index}">
                        <option value="#ffffff" ${offer.textColor === '#ffffff' ? 'selected' : ''}>White</option>
                        <option value="#000000" ${offer.textColor === '#000000' ? 'selected' : ''}>Black</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Subtext Line 1 (optional)</label>
                    <input type="text" class="offer-subtext" value="${offer.subtext || ''}" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>Subtext Line 2 (optional)</label>
                    <input type="text" class="offer-subtext2" value="${offer.subtext2 || ''}" data-index="${index}">
                </div>
            </div>
        </div>
    `;
}

// Render all offers
function renderOffers() {
    const container = document.getElementById('offersContainer');
    container.innerHTML = config.offers.map((offer, index) => renderOfferCard(offer, index)).join('');
    attachOfferEventListeners();
}

// Render appearance settings
function renderAppearance() {
    document.getElementById('headerText').value = config.appearance.headerText;
    document.getElementById('subtitleText').value = config.appearance.subtitleText;
    document.getElementById('footerText').value = config.appearance.footerText;
    document.getElementById('spinDuration').value = config.appearance.spinDuration;
    document.getElementById('confettiCount').value = config.appearance.confettiCount;
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
            const card = e.target.closest('.offer-card');
            const preview = card.querySelector('.color-preview');
            preview.style.backgroundColor = e.target.value;
        });
    });
    
    // Text color selects
    document.querySelectorAll('.offer-textcolor').forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            config.offers[index].textColor = e.target.value;
            const card = e.target.closest('.offer-card');
            const preview = card.querySelector('.color-preview');
            preview.style.color = e.target.value;
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
    const newOffer = {
        text: "NEW OFFER",
        description: "New offer description",
        color: "#333333",
        textColor: "#ffffff",
        weight: 5,
        subtext: "",
        subtext2: ""
    };
    config.offers.push(newOffer);
    renderOffers();
    renderStats();
    showStatus('➕ New offer added', 'info');
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
