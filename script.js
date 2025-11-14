// Salon offers and discounts - WCAG AA compliant palette
const offers = [
    { text: "10% OFF", description: "10% off your next service", color: "#264653", textColor: "#ffffff" },
    { text: "15% OFF", description: "15% off your next service", color: "#2a9d8f", textColor: "#ffffff" },
    { text: "20% OFF", description: "20% off your next service", color: "#e76f51", textColor: "#000000" },
    { text: "25% OFF", description: "25% off your next service", color: "#f4a261", textColor: "#000000" },
    { text: "30% OFF", description: "30% off your next service", color: "#e63946", textColor: "#ffffff" },
    { text: "FREE", description: "Free manicure service", subtext: "Manicure", color: "#8338ec", textColor: "#ffffff" },
    { text: "FREE", description: "Free blowout service", subtext: "Blowout", color: "#fb5607", textColor: "#000000" },
    { text: "5% OFF", description: "5% off your next service", color: "#3a86ff", textColor: "#ffffff" },
    { text: "50% OFF", description: "50% off your next haircut", subtext: "Haircut", color: "#ffbe0b", textColor: "#000000" },
    { text: "FREE", description: "Free deep conditioning treatment", subtext: "Deep", subtext2: "Condition", color: "#06a77d", textColor: "#ffffff" },
    { text: "35% OFF", description: "35% off your next service", color: "#c1121f", textColor: "#ffffff" },
    { text: "FREE", description: "Free scalp massage (15 min)", subtext: "Scalp", subtext2: "Massage", color: "#ff006e", textColor: "#ffffff" }
];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const modal = document.getElementById('resultModal');
const closeModalButton = document.getElementById('closeModal');
const offerResult = document.getElementById('offerResult');
const offerCode = document.getElementById('offerCode');

let currentRotation = 0;
let isSpinning = false;

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

    // Random number of rotations (3-6 full spins)
    const minSpins = 3;
    const maxSpins = 6;
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    
    // Random final position
    const randomAngle = Math.random() * 2 * Math.PI;
    const totalRotation = spins * 2 * Math.PI + randomAngle;
    
    const duration = 4000; // 4 seconds
    const startTime = Date.now();
    const startRotation = currentRotation;

    function animate() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + totalRotation * easeOut;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Normalize rotation
            currentRotation = currentRotation % (2 * Math.PI);
            
            // Determine winning segment
            // The pointer is at the top (12 o'clock), pointing down
            // We need to find which segment is at the top position
            const segmentAngle = (2 * Math.PI) / offers.length;
            
            // Since the wheel rotates clockwise and the pointer is at top
            // We need to find which segment starts at or before the top position
            // Top is at -PI/2 (or 3*PI/2) in standard coordinates
            const pointerAngle = -Math.PI / 2;
            
            // Normalize the current rotation to positive
            const normalizedRotation = ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            
            // Calculate which segment is at the pointer
            // Subtract the rotation from pointer position to find the segment
            let angle = ((pointerAngle - normalizedRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
            const winningIndex = Math.floor(angle / segmentAngle) % offers.length;
            const winningOffer = offers[winningIndex];
            
            // Show result
            setTimeout(() => {
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
