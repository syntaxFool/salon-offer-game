// Load configuration from localStorage or use defaults
function loadGameConfig() {
    const saved = localStorage.getItem('salonWheelConfig');
    if (saved) {
        return JSON.parse(saved);
    }
    // Default configuration
    return {
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
        }
    };
}

const gameConfig = loadGameConfig();
const offers = gameConfig.offers;

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

// Sound trigger points (placeholder - can be hooked up to actual sound files)
function playTickSound() {
    // Add your sound file here: new Audio('tick.mp3').play();
    console.log('🔊 Tick!');
}

function playWinSound() {
    // Add your sound file here: new Audio('win.mp3').play();
    console.log('🔊 Winner!');
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

// Spin the wheel
function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinButton.disabled = true;
    spinButton.textContent = 'SPINNING...';
    
    // Add glow effect to wheel
    canvas.classList.add('spinning');
    
    // Pre-determine the winning offer based on weighted probability
    const targetOfferIndex = selectWeightedOffer();
    const segmentAngle = (2 * Math.PI) / offers.length;
    
    console.log('Selected offer index:', targetOfferIndex, 'Offer:', offers[targetOfferIndex].text, offers[targetOfferIndex].subtext);
    
    // The pointer is at the top (12 o'clock position = -PI/2)
    // When currentRotation = 0, segment 0 starts at angle 0 (3 o'clock)
    // We need to rotate so that the target segment is under the pointer
    
    // The pointer in fixed coordinates is at -PI/2
    // For the target segment to be under the pointer, we need:
    // targetSegmentStart + currentRotation = -PI/2 - segmentAngle/2 (to center it)
    // So: currentRotation = -PI/2 - segmentAngle/2 - targetSegmentStart
    
    const targetSegmentStart = targetOfferIndex * segmentAngle;
    const randomOffsetWithinSegment = (Math.random() - 0.5) * segmentAngle * 0.6;
    const targetRotation = -Math.PI / 2 - segmentAngle / 2 - targetSegmentStart + randomOffsetWithinSegment;

    // Random number of full rotations (3-6 spins)
    const minSpins = 3;
    const maxSpins = 6;
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    
    // Calculate total rotation needed
    const currentNormalized = ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    // We need to get from currentNormalized to targetRotation
    // Since targetRotation might be negative, normalize it first
    const targetNormalized = ((targetRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    // Calculate shortest rotation to target
    let rotationNeeded = targetNormalized - currentNormalized;
    if (rotationNeeded < 0) {
        rotationNeeded += 2 * Math.PI;
    }
    
    const totalRotation = spins * 2 * Math.PI + rotationNeeded;
    
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
            
            // Normalize rotation
            currentRotation = currentRotation % (2 * Math.PI);
            
            // Calculate which segment is under the pointer after rotation
            // Pointer is at top (270 degrees or -PI/2 or 3*PI/2)
            const pointerAngle = -Math.PI / 2;
            
            // Each segment starts at: index * segmentAngle + currentRotation
            // The pointer points to angle -PI/2 in the canvas coordinate system
            // We need to find which segment contains this angle
            
            // Normalize the pointer angle relative to the current rotation
            const relativePointerAngle = ((pointerAngle - currentRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
            
            // Find which segment this angle falls into
            const landedSegmentIndex = Math.floor(relativePointerAngle / segmentAngle);
            
            console.log('Landed on segment:', landedSegmentIndex, 'Expected:', targetOfferIndex);
            console.log('Landed offer:', offers[landedSegmentIndex].text, offers[landedSegmentIndex].subtext);
            
            // Use the pre-determined winning offer
            const winningOffer = offers[targetOfferIndex];
            
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
    offerResult.textContent = offer.description;
    offerCode.textContent = generateOfferCode();
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    modal.classList.remove('show');
}

// Event listeners
spinButton.addEventListener('click', spinWheel);
closeModalButton.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Initial draw
drawWheel();
