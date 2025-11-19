// Load configuration from localStorage or use defaults
function loadGameConfig() {
    // Default configuration with logging
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
            googleSheetUrl: 'https://script.google.com/macros/s/AKfycbzWUt986C1kl76LJX0xjhom6n2Ro-9gbBgVnhFJOMpoFpWOWHwuHnTdti-wlKdcWRt3gQ/exec'
        }
    };
    
    try {
        const saved = localStorage.getItem('salonWheelConfig');
        if (saved) {
            const parsedConfig = JSON.parse(saved);
            // Merge with defaults to ensure logging object exists
            return {
                ...defaultConfig,
                ...parsedConfig,
                logging: { ...defaultConfig.logging, ...(parsedConfig.logging || {}) }
            };
        }
    } catch (error) {
        console.warn('LocalStorage unavailable or error:', error);
    }
    
    return defaultConfig;

const gameConfig = loadGameConfig();
const offers = gameConfig.offers;

// ============================================
// One Spin Per Person Feature
// ============================================

// Generate browser fingerprint for user identification
function generateUserFingerprint() {
    const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        screenDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
    };
    
    // Create a simple hash from fingerprint
    let hash = '';
    for (let key in fingerprint) {
        hash += JSON.stringify(fingerprint[key]);
    }
    
    // Simple string hash function
    let hashValue = 0;
    for (let i = 0; i < hash.length; i++) {
        const char = hash.charCodeAt(i);
        hashValue = ((hashValue << 5) - hashValue) + char;
        hashValue = hashValue & hashValue; // Convert to 32bit integer
    }
    return hashValue.toString(36);
}

// Check if user has already spun
function hasUserSpun() {
    try {
        const fingerprint = generateUserFingerprint();
        const spunUsers = JSON.parse(localStorage.getItem('salonWheelSpunUsers') || '{}');
        return spunUsers.hasOwnProperty(fingerprint);
    } catch (error) {
        console.warn('Error checking spin history:', error);
        return false;
    }
}

// Record that user has spun
function recordUserSpin() {
    try {
        const fingerprint = generateUserFingerprint();
        const spunUsers = JSON.parse(localStorage.getItem('salonWheelSpunUsers') || '{}');
        spunUsers[fingerprint] = {
            timestamp: new Date().toISOString(),
            offer: offerResult.textContent,
            code: offerCode.textContent
        };
        localStorage.setItem('salonWheelSpunUsers', JSON.stringify(spunUsers));
    } catch (error) {
        console.warn('Error recording spin:', error);
    }
}

// Get user's previous spin info
function getUserPreviousSpin() {
    try {
        const fingerprint = generateUserFingerprint();
        const spunUsers = JSON.parse(localStorage.getItem('salonWheelSpunUsers') || '{}');
        return spunUsers[fingerprint] || null;
    } catch (error) {
        console.warn('Error retrieving spin info:', error);
        return null;
    }
}

// Sound state
let soundEnabled = true;
let audioContext = null;

// Load celebration sound
const winSound = new Audio('Crowd Celebration 10.mp3');
winSound.volume = 0.5; // 50% volume

// Initialize audio context on first user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Create tick sound
function playTickSound() {
    if (!soundEnabled) return;
    try {
        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
        // Silent fail
    }
}

// Create win sound (celebration melody)
function playWinSound() {
    if (!soundEnabled) return;
    try {
        // Play the crowd celebration MP3
        winSound.currentTime = 0;
        winSound.play().catch(err => {
            console.warn('Could not play win sound:', err);
        });
    } catch (e) {
        // Silent fail
    }
}

// Apply appearance settings
document.addEventListener('DOMContentLoaded', () => {
    if (gameConfig.appearance) {
        const h1 = document.querySelector('h1');
        const subtitle = document.querySelector('.subtitle');
        const footer = document.querySelector('footer p');
        
        if (h1) h1.textContent = gameConfig.appearance.headerText;
        if (subtitle) subtitle.textContent = gameConfig.appearance.subtitleText;
        if (footer) footer.textContent = gameConfig.appearance.footerText;
    }
    
    // Hide loading spinner
    setTimeout(() => {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }, 500);
    
    // Check if user has already spun
    checkAndDisableSpin();
});

// Calculate total weight for probability
const totalWeight = offers.reduce((sum, offer) => sum + offer.weight, 0);

// Function to select weighted random offer
function selectWeightedOffer() {
    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    
    for (let i = 0; i < offers.length; i++) {
        cumulativeWeight += offers[i].weight;
        if (random < cumulativeWeight) {
            return i;
        }
    }
    return 0; // Fallback
}

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const modal = document.getElementById('resultModal');
const closeModalButton = document.getElementById('closeModal');
const saveOfferButton = document.getElementById('saveOffer');
const offerResult = document.getElementById('offerResult');
const offerCode = document.getElementById('offerCode');

let currentRotation = 0;
let isSpinning = false;

// Confetti configuration
function createConfetti() {
    const confettiCount = gameConfig.appearance?.confettiCount || 50;
    const colors = ['#d4af37', '#f4d03f', '#ff006e', '#3a86ff', '#06a77d', '#fb5607'];
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = (Math.random() * 0.5) + 's';
            
            // Random shapes
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// Create sparkles around the wheel
function createSparkles(x, y) {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = x + (Math.random() * 40 - 20) + 'px';
            sparkle.style.top = y + (Math.random() * 40 - 20) + 'px';
            document.querySelector('.wheel-container').appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1000);
        }, i * 50);
    }
}

// Draw the wheel
function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    const numSegments = offers.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    offers.forEach((offer, index) => {
        const startAngle = index * anglePerSegment + currentRotation;
        const endAngle = startAngle + anglePerSegment;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = offer.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text with proper multi-line layout
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        
        // Rotate text to read from outside to center
        ctx.rotate(Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = offer.textColor;
        
        // Use larger, consistent font size
        const mainFontSize = 16;
        const subFontSize = 14;
        
        ctx.font = `bold ${mainFontSize}px Arial, sans-serif`;
        ctx.shadowColor = offer.textColor === '#ffffff' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        const textRadius = radius * 0.65;
        
        // Handle multi-line text for longer offers
        if (offer.subtext2) {
            // Three lines: FREE / Word1 / Word2
            ctx.fillText(offer.text, 0, -textRadius - 18);
            ctx.font = `bold ${subFontSize}px Arial, sans-serif`;
            ctx.fillText(offer.subtext, 0, -textRadius);
            ctx.fillText(offer.subtext2, 0, -textRadius + 18);
        } else if (offer.subtext) {
            // Two lines: FREE / Word or 50% OFF / Haircut
            ctx.fillText(offer.text, 0, -textRadius - 10);
            ctx.font = `bold ${subFontSize}px Arial, sans-serif`;
            ctx.fillText(offer.subtext, 0, -textRadius + 10);
        } else {
            // Single line: percentage discounts
            ctx.fillText(offer.text, 0, -textRadius);
        }
        
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 5;
    ctx.stroke();
}

// Generate random offer code
function generateOfferCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SALON-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Check and disable spin button if user already spun
function checkAndDisableSpin() {
    if (hasUserSpun()) {
        spinButton.disabled = true;
        spinButton.textContent = 'ALREADY SPUN';
        spinButton.style.opacity = '0.6';
        spinButton.style.cursor = 'not-allowed';
        spinButton.title = 'You have already used your one spin!';
        
        const previousSpin = getUserPreviousSpin();
        if (previousSpin) {
            const spinDate = new Date(previousSpin.timestamp).toLocaleDateString();
            spinButton.title = `You already spun on ${spinDate}!`;
        }
    }
}

// Spin the wheel
function spinWheel() {
    // Check if user already spun
    if (hasUserSpun()) {
        alert('You have already used your one spin! Each person gets only one spin.');
        return;
    }
    
    if (isSpinning) return;
    
    isSpinning = true;
    spinButton.disabled = true;
    spinButton.textContent = 'SPINNING...';
    
    // Add glow effect to wheel
    canvas.classList.add('spinning');
    
    // Select winning offer based on weighted probability
    const targetOfferIndex = selectWeightedOffer();
    const segmentAngle = (2 * Math.PI) / offers.length;
    
    // Random number of full rotations (3-6 spins)
    const minSpins = 3;
    const maxSpins = 6;
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    
    // Calculate what rotation will make the target segment land under the pointer
    // Pointer is at -PI/2 (top)
    // After rotation, segment targetOfferIndex should be centered under the pointer
    // Segment targetOfferIndex center = targetOfferIndex * segmentAngle + segmentAngle/2 + finalRotation
    // We want: targetOfferIndex * segmentAngle + segmentAngle/2 + finalRotation = -PI/2 (mod 2*PI)
    // So: finalRotation = -PI/2 - targetOfferIndex * segmentAngle - segmentAngle/2
    
    const targetFinalRotation = -Math.PI / 2 - targetOfferIndex * segmentAngle - segmentAngle / 2;
    
    // Add random offset within the segment for natural variation
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.7;
    
    // Normalize to [0, 2*PI)
    const normalizedTarget = ((targetFinalRotation + randomOffset) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    
    // Add full spins
    const totalRotation = spins * 2 * Math.PI + (normalizedTarget - (currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI));
    const duration = gameConfig.appearance?.spinDuration || 4000; // From config
    const startTime = Date.now();
    const startRotation = currentRotation;
    
    // For tick sounds
    let lastSegment = -1;

    function animate() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + totalRotation * easeOut;
        drawWheel();
        
        // Trigger tick sound when crossing segment boundaries
        const currentSegment = Math.floor((currentRotation % (2 * Math.PI)) / segmentAngle);
        if (currentSegment !== lastSegment && progress < 0.95) {
            playTickSound();
            lastSegment = currentSegment;
            
            // Create sparkles occasionally during spin
            if (Math.random() > 0.7) {
                const rect = canvas.getBoundingClientRect();
                createSparkles(rect.width / 2, rect.height / 2);
            }
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Remove glow effect
            canvas.classList.remove('spinning');
            
            // Don't normalize - keep the final rotation as is for accurate calculation
            const finalRotation = currentRotation;
            const segmentAngle = (2 * Math.PI) / offers.length;
            
            // Calculate which segment is under the pointer after rotation
            // Pointer is at top (270 degrees or -PI/2 or 3*PI/2)
            const pointerAngle = -Math.PI / 2;
            
            // Normalize the pointer angle relative to the current rotation
            const relativePointerAngle = ((pointerAngle - finalRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
            
            // Find which segment this angle falls into
            const landedSegmentIndex = Math.floor(relativePointerAngle / segmentAngle) % offers.length;
            
            // Normalize rotation for next spin
            currentRotation = finalRotation % (2 * Math.PI);
            
            // Use whatever segment the wheel actually landed on - SIMPLE!
            const winningOffer = offers[landedSegmentIndex];
            
            // Show result with effects
            setTimeout(() => {
                playWinSound();
                createConfetti();
                showResult(winningOffer);
                isSpinning = false;
                spinButton.disabled = false;
                spinButton.textContent = 'SPIN AGAIN';
            }, 500);
        }
    }

    animate();
}

// Show result modal
function showResult(offer) {
    const code = generateOfferCode();
    offerResult.textContent = offer.description;
    offerCode.textContent = code;
    modal.classList.add('show');
    
    // Record that this user has spun
    recordUserSpin();
    
    // Disable spin button for future attempts
    spinButton.disabled = true;
    spinButton.textContent = 'ALREADY SPUN';
    spinButton.style.opacity = '0.6';
    spinButton.style.cursor = 'not-allowed';
    
    // Log to Google Sheets
    logSpinToGoogleSheets(offer, code);
}

// Log spin to Google Sheets
function logSpinToGoogleSheets(offer, code) {
    // Check if logging is enabled
    if (!gameConfig.logging || !gameConfig.logging.enabled || !gameConfig.logging.googleSheetUrl) {
        console.log('Logging disabled or URL not configured', {
            hasLogging: !!gameConfig.logging,
            enabled: gameConfig.logging?.enabled,
            hasUrl: !!gameConfig.logging?.googleSheetUrl
        });
        return;
    }
    
    try {
        // Detect device type
        const deviceType = /mobile/i.test(navigator.userAgent) ? 'Mobile' : 
                          /tablet/i.test(navigator.userAgent) ? 'Tablet' : 'Desktop';
        
        // Detect browser
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';
        if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
        else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
        else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
        else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) browser = 'IE';
        
        // Prepare data
        const data = {
            offerText: offer.text + (offer.subtext ? ' ' + offer.subtext : '') + (offer.subtext2 ? ' ' + offer.subtext2 : ''),
            offerDescription: offer.description,
            offerCode: code,
            deviceType: deviceType,
            browser: browser,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            userAgent: userAgent
        };
        
        console.log('Sending to Google Sheets:', data);
        
        // Send to Google Sheets (async, fire and forget)
        fetch(gameConfig.logging.googleSheetUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(() => {
            console.log('✅ Spin logged to Google Sheets');
        }).catch(err => {
            console.warn('Failed to log spin:', err);
        });
    } catch (error) {
        console.warn('Error logging spin:', error);
    }
}

// Close modal
function closeModal() {
    modal.classList.remove('show');
}

// Generate offer HTML for print/save
function generateOfferHTML(offerText, code) {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Your Salon Offer - ${code}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px 20px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .offer-container {
                    background: white;
                    padding: 50px 40px;
                    border-radius: 20px;
                    max-width: 600px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    border: 3px solid #d4af37;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #f0f0f0;
                }
                h1 { 
                    color: #d4af37; 
                    font-size: 2.5em; 
                    margin-bottom: 10px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                }
                .salon-name {
                    color: #764ba2;
                    font-size: 1.2em;
                    font-weight: 600;
                    margin-top: 10px;
                }
                .offer-section {
                    text-align: center;
                    margin: 40px 0;
                }
                .offer-label {
                    color: #666;
                    font-size: 1em;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 15px;
                    font-weight: 600;
                }
                .offer { 
                    font-size: 2.2em; 
                    font-weight: bold; 
                    color: #667eea; 
                    margin: 20px 0;
                    padding: 25px;
                    background: linear-gradient(135deg, #ffd700 0%, #f4d03f 100%);
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
                    border: 3px solid #d4af37;
                }
                .code-section {
                    text-align: center;
                    margin: 30px 0;
                    padding: 25px;
                    background: #f9f9f9;
                    border-radius: 10px;
                }
                .code-label {
                    color: #666;
                    font-size: 0.9em;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .code { 
                    font-size: 1.8em; 
                    font-weight: bold;
                    color: #d4af37;
                    font-family: 'Courier New', monospace;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    border: 2px dashed #d4af37;
                    letter-spacing: 3px;
                }
                .details {
                    margin: 30px 0;
                    padding: 20px;
                    background: #fff9e6;
                    border-left: 4px solid #d4af37;
                    border-radius: 5px;
                }
                .details-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    color: #333;
                }
                .details-label {
                    font-weight: 600;
                    color: #666;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #f0f0f0;
                    color: #999;
                    font-size: 0.95em;
                }
                .thank-you {
                    color: #667eea;
                    font-weight: 600;
                    font-size: 1.1em;
                    margin-top: 15px;
                }
                @media print {
                    body { 
                        background: white;
                        padding: 20px;
                    }
                    .offer-container {
                        box-shadow: none;
                        border: 2px solid #d4af37;
                    }
                }
                @media (max-width: 600px) {
                    body { padding: 20px 10px; }
                    .offer-container { padding: 30px 20px; }
                    h1 { font-size: 2em; }
                    .offer { font-size: 1.6em; }
                    .code { font-size: 1.4em; }
                }
            </style>
        </head>
        <body>
            <div class="offer-container">
                <div class="header">
                    <h1>🎉 Congratulations! 🎉</h1>
                    <div class="salon-name">Your Salon Special Offer</div>
                </div>
                
                <div class="offer-section">
                    <div class="offer-label">Your Exclusive Offer</div>
                    <div class="offer">${offerText}</div>
                </div>
                
                <div class="code-section">
                    <div class="code-label">Redemption Code</div>
                    <div class="code">${code}</div>
                </div>
                
                <div class="details">
                    <div class="details-item">
                        <span class="details-label">📅 Issued:</span>
                        <span>${today}</span>
                    </div>
                    <div class="details-item">
                        <span class="details-label">⏰ Valid Until:</span>
                        <span>Your Next Visit</span>
                    </div>
                    <div class="details-item">
                        <span class="details-label">📋 How to Redeem:</span>
                        <span>Show this code at checkout</span>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Terms & Conditions: One offer per visit. Cannot be combined with other promotions.</p>
                    <p class="thank-you">Thank you for choosing our salon! 💇‍♀️✨</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Print offer
function printOffer() {
    const printWindow = window.open('', '_blank');
    const offerText = offerResult.textContent;
    const code = offerCode.textContent;
    
    printWindow.document.write(generateOfferHTML(offerText, code));
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Save offer as PDF
function saveOffer() {
    const offerText = offerResult.textContent;
    const code = offerCode.textContent;
    
    // Open in new window with instructions
    const saveWindow = window.open('', '_blank');
    saveWindow.document.write(generateOfferHTML(offerText, code));
    saveWindow.document.close();
    
    // Show save dialog after short delay
    setTimeout(() => {
        saveWindow.print(); // User can choose "Save as PDF" in print dialog
    }, 500);
}

// Event listeners
spinButton.addEventListener('click', () => {
    initAudioContext(); // Initialize audio on first click
    spinWheel();
});

closeModalButton.addEventListener('click', closeModal);

if (saveOfferButton) {
    saveOfferButton.addEventListener('click', saveOffer);
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Initial draw
drawWheel();
