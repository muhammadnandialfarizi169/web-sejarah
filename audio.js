/* =====================================================
   AUDIO.JS — Sistem Musik & Sound Effect Web Audio API
   ===================================================== */

let audioCtx = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let musicPlaying = false;
let musicInterval = null;
let audioEnabled = true;

/* ============ INISIALISASI ============ */
function initAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(audioCtx.destination);

    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.15;
    musicGain.connect(masterGain);

    sfxGain = audioCtx.createGain();
    sfxGain.gain.value = 0.4;
    sfxGain.connect(masterGain);
  } catch (e) {
    console.warn('Audio tidak didukung.', e);
  }
}

/* ============ PLAY TONE ============ */
function playTone(freq, duration, type, gain, targetGain, delay) {
  if (!audioCtx || !audioEnabled) return;
  type = type || 'sine';
  gain = gain || 0.3;
  delay = delay || 0;

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  const now = audioCtx.currentTime + delay;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gainNode);
  gainNode.connect(targetGain || sfxGain);
  osc.start(now);
  osc.stop(now + duration + 0.1);
}

/* ============ SFX ============ */
function sfxClick() {
  if (!audioCtx || !audioEnabled) return;
  playTone(800, 0.08, 'square', 0.15);
  playTone(1200, 0.06, 'square', 0.1, null, 0.02);
}

function sfxWhoosh() {
  if (!audioCtx || !audioEnabled) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(200, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.3);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(100, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(sfxGain);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);
}

function sfxCorrect() {
  if (!audioCtx || !audioEnabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, i) => playTone(freq, 0.18, 'sine', 0.25, null, i * 0.08));
}

function sfxWrong() {
  if (!audioCtx || !audioEnabled) return;
  const notes = [392.00, 349.23, 293.66];
  notes.forEach((freq, i) => playTone(freq, 0.22, 'triangle', 0.28, null, i * 0.1));
}

function sfxLevelUp() {
  if (!audioCtx || !audioEnabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  notes.forEach((freq, i) => {
    playTone(freq, 0.4, 'sine', 0.3, null, i * 0.09);
    playTone(freq * 2, 0.3, 'triangle', 0.1, null, i * 0.09 + 0.01);
  });
}

function sfxVictory() {
  if (!audioCtx || !audioEnabled) return;
  const melody = [
    { f: 523.25, d: 0.15, t: 0 },
    { f: 523.25, d: 0.15, t: 0.15 },
    { f: 523.25, d: 0.15, t: 0.3 },
    { f: 659.25, d: 0.3, t: 0.45 },
    { f: 587.33, d: 0.3, t: 0.75 },
    { f: 659.25, d: 0.2, t: 1.05 },
    { f: 783.99, d: 0.6, t: 1.25 },
  ];
  melody.forEach(({ f, d, t }) => {
    playTone(f, d, 'square', 0.2, null, t);
    playTone(f * 0.5, d, 'sine', 0.15, null, t);
  });
}

function sfxGameOver() {
  if (!audioCtx || !audioEnabled) return;
  const notes = [440, 415.30, 392, 349.23, 293.66, 261.63];
  notes.forEach((freq, i) => playTone(freq, 0.35, 'sawtooth', 0.18, null, i * 0.12));
}

function sfxStart() {
  if (!audioCtx || !audioEnabled) return;
  playTone(261.63, 0.2, 'square', 0.2, null, 0);
  playTone(329.63, 0.2, 'square', 0.2, null, 0.15);
  playTone(392.00, 0.3, 'square', 0.25, null, 0.3);
  playTone(523.25, 0.5, 'sine', 0.3, null, 0.5);
}

/* ============ BACKGROUND MUSIC ============ */
const musicNotes = [
  // Bass
  { f: 130.81, d: 1.2, t: 0 },
  { f: 130.81, d: 1.2, t: 1.5 },
  { f: 146.83, d: 1.2, t: 3 },
  { f: 146.83, d: 1.2, t: 4.5 },
  { f: 164.81, d: 1.2, t: 6 },
  { f: 164.81, d: 1.2, t: 7.5 },
  { f: 110.00, d: 1.2, t: 9 },
  { f: 110.00, d: 1.2, t: 10.5 },
  // Melodi
  { f: 523.25, d: 0.6, t: 0 },
  { f: 587.33, d: 0.6, t: 0.7 },
  { f: 659.25, d: 1.0, t: 1.4 },
  { f: 523.25, d: 0.6, t: 2.5 },
  { f: 587.33, d: 1.0, t: 3.2 },
  { f: 659.25, d: 0.6, t: 4.3 },
  { f: 783.99, d: 1.4, t: 5.0 },
  { f: 659.25, d: 0.6, t: 6.5 },
  { f: 587.33, d: 0.6, t: 7.2 },
  { f: 523.25, d: 1.4, t: 7.9 },
  // Harmony
  { f: 261.63, d: 1.0, t: 1.4 },
  { f: 293.66, d: 1.0, t: 3.2 },
  { f: 329.63, d: 1.0, t: 5.0 },
  { f: 392.00, d: 1.4, t: 6.5 },
  { f: 261.63, d: 1.4, t: 7.9 },
];

function playMusicLoop() {
  if (!audioCtx || !audioEnabled) return;
  musicNotes.forEach(({ f, d, t }) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = f;

    const startTime = audioCtx.currentTime + t;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
    gain.gain.linearRampToValueAtTime(0.08, startTime + d * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + d);

    osc.connect(gain);
    gain.connect(musicGain);
    osc.start(startTime);
    osc.stop(startTime + d + 0.1);
  });
}

function startMusic() {
  if (musicPlaying || !audioCtx) return;
  musicPlaying = true;
  playMusicLoop();
  musicInterval = setInterval(() => {
    if (audioEnabled && musicPlaying) playMusicLoop();
  }, 12000);
}

function stopMusic() {
  musicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

/* ============ CONTROL ============ */
function toggleAudio() {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

  audioEnabled = !audioEnabled;

  const btn = document.getElementById('audioBtn');
  const icon = document.getElementById('audioIcon');

  if (audioEnabled) {
    if (btn) btn.classList.add('playing');
    if (icon) icon.textContent = '🔊';
    startMusic();
    sfxStart();
  } else {
    if (btn) btn.classList.remove('playing');
    if (icon) icon.textContent = '🔇';
    stopMusic();
  }
}

/* ============ PERMISSION BANNER ============ */
function showAudioPermission() {
  const banner = document.createElement('div');
  banner.className = 'audio-permission';
  banner.innerHTML = '<span class="perm-icon">🎵</span> Klik untuk mengaktifkan musik & suara';
  banner.onclick = () => {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    audioEnabled = true;
    const btn = document.getElementById('audioBtn');
    const icon = document.getElementById('audioIcon');
    if (btn) btn.classList.add('playing');
    if (icon) icon.textContent = '🔊';
    setTimeout(() => {
      startMusic();
      sfxStart();
    }, 100);
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 500);
  };
  document.body.appendChild(banner);
  setTimeout(() => banner.classList.add('show'), 1500);
}

window.addEventListener('load', () => {
  setTimeout(showAudioPermission, 2500);
});

document.addEventListener('click', function once() {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  document.removeEventListener('click', once);
}, { once: true });