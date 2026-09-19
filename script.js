// Gestion du curseur personnalisé
const cursor = document.getElementById('custom-cursor');
window.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// Effet particules / grille interactive en arrière-plan (Canvas)
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

for (let i = 0; i < 40; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5
    });
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}
animate();

// Audio UI discret (Optionnel / Web Audio API)
let audioCtx = null;
let soundEnabled = false;
const soundToggle = document.getElementById('sound-toggle');

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        soundToggle.textContent = "AUDIO: ON";
        soundToggle.classList.add('border-neoncyan', 'text-neoncyan');
    } else {
        if (audioCtx) audioCtx.close();
        soundToggle.textContent = "AUDIO: OFF";
        soundToggle.classList.remove('border-neoncyan', 'text-neoncyan');
    }
});

function playBeep(freq = 440, duration = 0.05) {
    if (!soundEnabled || !audioCtx) return;
    try {
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => playBeep(587.33)); // Note Ré
});
