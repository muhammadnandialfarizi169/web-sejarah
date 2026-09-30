/* =====================================================
   SCRIPT.JS — Logika Game Minahasa Quest
   ===================================================== */

/* ============ DATA 10 KARAKTER + PERNYATAAN ============ */
const quests = [
  {
    id: 1,
    character: { name: "Misionaris Portugis", role: "Penyebar Agama Katolik", color: "#22d3ee", speech: "Dengarkan kisahku..." },
    statement: "Penyebaran agama Katolik di Minahasa oleh Portugis dilanjutkan oleh Spanyol sejak tahun 1580.",
    answer: true,
    explanation: "Benar! Portugis memulai penyebaran agama Katolik di Minahasa, lalu dilanjutkan oleh Spanyol sejak tahun 1580."
  },
  {
    id: 2,
    character: { name: "Kepala Suku Minahasa", role: "Pemimpin Rakyat", color: "#f59e0b", speech: "Kami menerima mereka dulu..." },
    statement: "Pada awalnya, keberadaan Spanyol diterima dengan baik oleh rakyat Minahasa.",
    answer: true,
    explanation: "Benar! Awalnya hubungan rakyat Minahasa dengan Spanyol berjalan baik sebelum tentara Spanyol bertindak sewenang-wenang."
  },
  {
    id: 3,
    character: { name: "Christoval Suarez", role: "Pemimpin Armada Spanyol", color: "#dc2626", speech: "Aku datang membawa armada!" },
    statement: "Pada tahun 1606, armada yang dipimpin Christoval Suarez mendarat di Minahasa.",
    answer: true,
    explanation: "Benar! Christoval Suarez memimpin armada Spanyol yang mendarat di Minahasa pada tahun 1606."
  },
  {
    id: 4,
    character: { name: "Petani Minahasa", role: "Rakyat Biasa", color: "#16a34a", speech: "Kami sangat menderita..." },
    statement: "Tindakan para tentara Spanyol membuat rakyat Minahasa merasa sakit hati.",
    answer: true,
    explanation: "Benar! Tindakan tentara Spanyol yang merugikan dan menyakiti masyarakat membuat rakyat Minahasa sakit hati."
  },
  {
    id: 5,
    character: { name: "Pahlawan Minahasa", role: "Pemimpin Perlawanan", color: "#7c3aed", speech: "Saatnya melawan!" },
    statement: "Pada tahun 1644, rakyat Minahasa mengangkat senjata untuk melawan Spanyol.",
    answer: true,
    explanation: "Benar! Pada tahun 1644, rakyat Minahasa mulai mengangkat senjata untuk melawan Spanyol."
  },
  {
    id: 6,
    character: { name: "Tentara Spanyol", role: "Tentara Penjajah", color: "#94a3b8", speech: "Kami datang untuk berperang!" },
    statement: "Spanyol datang ke Minahasa pada tahun 1606 untuk memulai peperangan dengan rakyat Minahasa.",
    answer: false,
    explanation: "Salah! Spanyol awalnya datang untuk menyebarkan agama Katolik dan menjalin hubungan, bukan untuk memulai peperangan."
  },
  {
    id: 7,
    character: { name: "Misionaris Spanyol", role: "Penyebar Agama", color: "#fbbf24", speech: "Mereka tidak menyukai agama kami?" },
    statement: "Ketidaksenangan rakyat Minahasa terhadap tentara Spanyol terjadi karena rakyat Minahasa tidak menyukai agama Katolik.",
    answer: false,
    explanation: "Salah! Rakyat Minahasa tidak menyukai tindakan tentara Spanyol, bukan karena agama Katoliknya."
  },
  {
    id: 8,
    character: { name: "Pemimpin Tomohon", role: "Korban Kekerasan", color: "#dc2626", speech: "Aku dipukul dan dilukai!" },
    statement: "Tentara Spanyol memukul dan melukai salah seorang pemimpin rakyat Minahasa di Tomohon pada tahun 1644.",
    answer: false,
    explanation: "Salah! Sesuai kunci jawaban kuis, pernyataan ini SALAH. Meskipun peristiwa ini adalah pemicu perlawanan, tapi dalam konteks kuis ini jawabannya adalah SALAH (kemungkinan karena pernyataan tidak sesuai detail materi yang diberikan)."
  },
  {
    id: 9,
    character: { name: "Utusan Minahasa", role: "Pencari Bantuan", color: "#2563eb", speech: "Kami butuh bantuan..." },
    statement: "Rakyat Minahasa meminta bantuan kepada Portugis untuk mengusir Spanyol.",
    answer: false,
    explanation: "Salah! Rakyat Minahasa meminta bantuan kepada Belanda, bukan Portugis."
  },
  {
    id: 10,
    character: { name: "Panglima Belanda", role: "Sekutu Minahasa", color: "#f59e0b", speech: "Spanyol telah terusir!" },
    statement: "Setelah Spanyol berhasil diusir dari Minahasa, penjajahan Belanda dimulai.",
    answer: false,
    explanation: "Salah! Kunci jawaban soal ini adalah SALAH sesuai kuis asli."
  }
];

/* ============ STATE ============ */
let currentQuest = 0;
let userAnswers = new Array(quests.length).fill(null);
let correctCount = 0;
let wrongCount = 0;
let earnedXP = 0;
let totalXP = 0;
let userLevel = 1;
let isAnswered = false;

/* ============ LOADING ============ */
window.addEventListener('load', () => {
  const bar = document.getElementById('loadingBar');
  const screen = document.getElementById('loadingScreen');
  let progress = 0;

  const interval = setInterval(() => {
    progress += 15;
    if (bar) bar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (screen) screen.classList.add('hidden');
        initGame();
      }, 400);
    }
  }, 150);
});

/* ============ INIT ============ */
function initGame() {
  createParticles();
  createStars();
  setupCursor();
  setupScrollReveal();
  setupNavScroll();
  renderDots();
  updateXPDisplay();
  generateQR();
}

/* ============ PARTICLES ============ */
function createParticles() {
  const container = document.getElementById('particlesBg');
  if (!container) return;
  const colors = ['#22d3ee', '#f59e0b', '#dc2626', '#7c3aed'];

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle-item';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 15 + 15) + 's';
    p.style.animationDelay = (Math.random() * 15) + 's';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.boxShadow = '0 0 8px ' + p.style.background;
    container.appendChild(p);
  }
}

/* ============ STARS ============ */
function createStars() {
  const container = document.getElementById('heroStars');
  if (!container) return;

  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 60 + '%';
    star.style.animationDelay = (Math.random() * 3) + 's';
    star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
    container.appendChild(star);
  }
}

/* ============ CURSOR ============ */
function setupCursor() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('button, a, .nav-item, .qp-btn, .option-btn')) {
      glow.classList.add('hover');
    } else {
      glow.classList.remove('hover');
    }
  });
}

/* ============ SCROLL REVEAL ============ */
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

/* ============ NAV SCROLL ============ */
function setupNavScroll() {
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav');
      let sectionId = '';

      if (target === 'home') sectionId = 'heroSection';
      else if (target === 'materi') sectionId = 'materiSection';
      else if (target === 'quiz') sectionId = 'quizSection';

      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      document.querySelectorAll('[data-nav]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  window.addEventListener('scroll', () => {
    const sections = [
      { id: 'heroSection', nav: 'home' },
      { id: 'materiSection', nav: 'materi' },
      { id: 'quizSection', nav: 'quiz' }
    ];

    let active = 'home';
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200) active = s.nav;
      }
    });

    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-nav') === active) btn.classList.add('active');
    });
  });
}

/* ============ NAVIGASI HERO ============ */
function startAdventure() {
  const quizEl = document.getElementById('quizSection');
  if (quizEl) quizEl.scrollIntoView({ behavior: 'smooth' });
}

function scrollToMateri() {
  const el = document.getElementById('materiSection');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ============ DOTS ============ */
function renderDots() {
  const dots = document.getElementById('qpDots');
  if (!dots) return;

  dots.innerHTML = quests.map((_, i) => {
    let cls = 'qp-dot';
    if (i === currentQuest) cls += ' current';
    if (userAnswers[i] !== null) {
      cls += userAnswers[i] === quests[i].answer ? ' correct' : ' wrong';
    }
    return `<span class="${cls}"></span>`;
  }).join('');
}

/* ============ START QUIZ ============ */
function startQuiz() {
  if (typeof sfxClick === 'function') sfxClick();
  if (typeof sfxStart === 'function') sfxStart();

  const startEl = document.getElementById('quizStart');
  const arenaEl = document.getElementById('quizArena');
  if (startEl) startEl.style.display = 'none';
  if (arenaEl) arenaEl.style.display = 'block';

  currentQuest = 0;
  userAnswers = new Array(quests.length).fill(null);
  correctCount = 0;
  wrongCount = 0;
  earnedXP = 0;

  renderQuest();
  if (arenaEl) arenaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============ RENDER QUEST ============ */
function renderQuest() {
  const quest = quests[currentQuest];
  if (!quest) return;

  if (typeof sfxWhoosh === 'function') sfxWhoosh();

  isAnswered = userAnswers[currentQuest] !== null;

  const stage = document.getElementById('characterStage');
  if (stage) {
    stage.innerHTML = `
      <div class="character-card">
        <div class="character-avatar-large">
          ${getCharacterSVG(quest.character)}
        </div>
        <div class="character-name-tag">${quest.character.name}</div>
        <div class="character-role-tag">${quest.character.role}</div>
        <div class="character-speech">💬 ${quest.character.speech}</div>
      </div>
    `;
  }

  const badge = document.getElementById('qpBadge');
  const textEl = document.getElementById('qpText');
  if (badge) badge.textContent = `Pernyataan #${currentQuest + 1}`;
  if (textEl) textEl.textContent = quest.statement;

  const options = document.getElementById('qpOptions');
  if (options) {
    const benarBtn = options.querySelector('.qp-benar');
    const salahBtn = options.querySelector('.qp-salah');

    benarBtn.disabled = false;
    salahBtn.disabled = false;

    benarBtn.classList.remove('selected-benar', 'selected-salah', 'dimmed');
    salahBtn.classList.remove('selected-benar', 'selected-salah', 'dimmed');

    if (isAnswered) {
      benarBtn.disabled = true;
      salahBtn.disabled = true;

      if (userAnswers[currentQuest] === true) {
        benarBtn.classList.add('selected-benar');
        salahBtn.classList.add('dimmed');
      } else {
        salahBtn.classList.add('selected-salah');
        benarBtn.classList.add('dimmed');
      }

      showFeedback();
    } else {
      hideFeedback();
    }
  }

  const fill = document.getElementById('arenaProgressFill');
  if (fill) fill.style.width = ((currentQuest) / quests.length * 100) + '%';

  const currentEl = document.getElementById('currentQuest');
  if (currentEl) currentEl.textContent = currentQuest + 1;

  const xpEl = document.getElementById('earnedXP');
  if (xpEl) xpEl.textContent = earnedXP;

  renderDots();
}

/* ============ ANSWER ============ */
function answerQuestion(userAnswer) {
  if (isAnswered) return;

  userAnswers[currentQuest] = userAnswer;
  isAnswered = true;

  const correct = userAnswer === quests[currentQuest].answer;

  if (correct) {
    correctCount++;
    earnedXP += 10;
    totalXP += 10;
    checkLevelUp();
    if (typeof sfxCorrect === 'function') sfxCorrect();
  } else {
    wrongCount++;
    earnedXP += 2;
    totalXP += 2;
    if (typeof sfxWrong === 'function') sfxWrong();
  }

  updateXPDisplay();

  const benarBtn = document.querySelector('.qp-benar');
  const salahBtn = document.querySelector('.qp-salah');

  if (userAnswer === true) {
    benarBtn.classList.add('selected-benar');
    salahBtn.classList.add('dimmed');
  } else {
    salahBtn.classList.add('selected-salah');
    benarBtn.classList.add('dimmed');
  }

  benarBtn.disabled = true;
  salahBtn.disabled = true;

  showFeedback();
  renderDots();
}

/* ============ FEEDBACK ============ */
function showFeedback() {
  const quest = quests[currentQuest];
  const userAns = userAnswers[currentQuest];
  const isCorrect = userAns === quest.answer;

  const feedback = document.getElementById('qpFeedback');
  const iconEl = document.getElementById('feedbackIcon');
  const titleEl = document.getElementById('feedbackTitle');
  const textEl = document.getElementById('feedbackText');
  const nextBtn = document.getElementById('feedbackNext');

  if (!feedback) return;

  feedback.style.display = 'flex';
  feedback.className = 'qp-feedback ' + (isCorrect ? 'correct' : 'wrong');

  if (iconEl) iconEl.textContent = isCorrect ? '✓' : '✕';
  if (titleEl) titleEl.textContent = isCorrect ? '🎉 Tepat Sekali!' : '❌ Kurang Tepat';
  if (textEl) textEl.textContent = quest.explanation;

  if (nextBtn) {
    nextBtn.textContent = currentQuest === quests.length - 1 ? 'Lihat Hasil →' : 'Lanjut →';
  }
}

function hideFeedback() {
  const feedback = document.getElementById('qpFeedback');
  if (feedback) feedback.style.display = 'none';
}

/* ============ NEXT ============ */
function nextQuest() {
  if (typeof sfxClick === 'function') sfxClick();
  if (currentQuest === quests.length - 1) {
    showResult();
  } else {
    currentQuest++;
    isAnswered = false;
    renderQuest();
    window.scrollTo({ top: document.getElementById('quizArena').offsetTop - 100, behavior: 'smooth' });
  }
}

/* ============ XP ============ */
function updateXPDisplay() {
  const xpEl = document.getElementById('xpValue');
  const levelEl = document.getElementById('levelValue');
  if (xpEl) xpEl.textContent = totalXP;
  if (levelEl) levelEl.textContent = userLevel;
}

function checkLevelUp() {
  const newLevel = Math.floor(totalXP / 30) + 1;
  if (newLevel > userLevel) {
    userLevel = newLevel;
    updateXPDisplay();
    showLevelUpToast(userLevel);
    if (typeof sfxLevelUp === 'function') sfxLevelUp();
  }
}

function showLevelUpToast(level) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; top: 100px; left: 50%;
    transform: translateX(-50%) translateY(-30px);
    padding: 15px 30px;
    background: linear-gradient(135deg, #f59e0b, #dc2626);
    color: white; border-radius: 50px;
    font-family: Cinzel, serif; font-weight: 900;
    font-size: 1.2em;
    box-shadow: 0 15px 40px rgba(245,158,11,0.6);
    z-index: 10000; opacity: 0; transition: all 0.5s;
    letter-spacing: 2px;
  `;
  toast.innerHTML = `⭐ LEVEL ${level} ⭐`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 50);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-30px)';
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

/* ============ RESULT ============ */
function showResult() {
  const arena = document.getElementById('quizArena');
  const result = document.getElementById('quizResult');
  if (arena) arena.style.display = 'none';
  if (result) result.style.display = 'block';

  const score = correctCount;
  const scoreEl = document.getElementById('finalScoreValue');
  if (scoreEl) scoreEl.textContent = score;

  const correctStat = document.getElementById('correctStat');
  const wrongStat = document.getElementById('wrongStat');
  const xpStat = document.getElementById('xpStat');
  if (correctStat) correctStat.textContent = correctCount;
  if (wrongStat) wrongStat.textContent = wrongCount;
  if (xpStat) xpStat.textContent = earnedXP;

  const heading = document.getElementById('resultHeading');
  const desc = document.getElementById('resultDesc');
  const rating = document.getElementById('resultRating');

  let stars = '⭐';
  let title = 'Misi Selesai!';
  let description = '';

  if (score === 10) {
    stars = '⭐⭐⭐⭐⭐';
    title = '🏆 PAHLAWAN LEGENDARIS! 🏆';
    description = 'Sempurna! Kamu menguasai seluruh kisah perlawanan rakyat Minahasa dengan luar biasa. Minahasa bangga padamu!';
    fireConfetti(150);
    if (typeof sfxVictory === 'function') sfxVictory();
  } else if (score >= 8) {
    stars = '⭐⭐⭐⭐';
    title = '🎉 Pejuang Hebat!';
    description = 'Luar biasa! Pemahamanmu tentang sejarah Minahasa sangat baik. Sedikit lagi menuju sempurna!';
    fireConfetti(80);
    if (typeof sfxVictory === 'function') sfxVictory();
  } else if (score >= 6) {
    stars = '⭐⭐⭐';
    title = '👍 Pejuang Muda';
    description = 'Bagus! Kamu sudah cukup memahami kisah ini. Baca materi sekali lagi untuk hasil lebih baik.';
    if (typeof sfxCorrect === 'function') sfxCorrect();
  } else if (score >= 4) {
    stars = '⭐⭐';
    title = '📚 Murid Sejarah';
    description = 'Kamu sudah berusaha! Pelajari kembali materi dengan teliti lalu coba lagi ya.';
    if (typeof sfxWrong === 'function') sfxWrong();
  } else {
    stars = '⭐';
    title = '💪 Jangan Menyerah!';
    description = 'Setiap pejuang pernah gagal. Baca materinya sekali lagi dan ulangi misi ini. Kamu pasti bisa!';
    if (typeof sfxGameOver === 'function') sfxGameOver();
  }

  if (heading) heading.textContent = title;
  if (desc) desc.textContent = description;
  if (rating) rating.textContent = stars;

  renderReview();

  if (result) result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============ REVIEW ============ */
function renderReview() {
  const container = document.getElementById('reviewItems');
  if (!container) return;

  container.innerHTML = quests.map((q, i) => {
    const userAns = userAnswers[i];
    const isCorrect = userAns === q.answer;

    return `
      <div class="review-item ${isCorrect ? 'correct' : 'wrong'}" style="animation-delay: ${i * 0.05}s">
        <span class="ri-label ${isCorrect ? 'ri-label-correct' : 'ri-label-wrong'}">
          ${isCorrect ? '✅ Benar' : '❌ Salah'} — Pernyataan #${i + 1}
        </span>
        <p class="ri-text">${q.statement}</p>
        <div class="ri-answers">
          <span>Jawabanmu: <strong>${userAns ? 'Benar' : 'Salah'}</strong></span>
          <span>Kunci: <strong>${q.answer ? 'Benar' : 'Salah'}</strong></span>
        </div>
      </div>
    `;
  }).join('');
}

function toggleReview() {
  const panel = document.getElementById('reviewPanel');
  if (!panel) return;

  if (panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    panel.style.display = 'none';
  }
}

/* ============ RESTART ============ */
function restartQuiz() {
  if (typeof sfxClick === 'function') sfxClick();
  if (typeof sfxStart === 'function') sfxStart();

  const result = document.getElementById('quizResult');
  const arena = document.getElementById('quizArena');
  const review = document.getElementById('reviewPanel');

  if (result) result.style.display = 'none';
  if (review) review.style.display = 'none';
  if (arena) arena.style.display = 'block';

  currentQuest = 0;
  userAnswers = new Array(quests.length).fill(null);
  correctCount = 0;
  wrongCount = 0;
  earnedXP = 0;
  isAnswered = false;

  renderQuest();
  if (arena) arena.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============ CHARACTER SVG ============ */
function getCharacterSVG(char) {
  const color = char.color || '#22d3ee';
  const initial = char.name.split(' ').map(w => w[0]).join('').substring(0, 2);
  const id = char.name.replace(/\s/g, '');

  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad-${id}" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.1"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#grad-${id})" stroke="${color}" stroke-width="2"/>
      <circle cx="50" cy="50" r="42" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.5"/>
      <circle cx="50" cy="50" r="38" fill="${color}" opacity="0.15"/>
      <text x="50" y="62" text-anchor="middle" fill="${color}" font-family="Cinzel, serif" font-size="30" font-weight="900">${initial}</text>
    </svg>
  `;
}

/* ============ CONFETTI ============ */
function fireConfetti(count) {
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  const colors = ['#22d3ee', '#f59e0b', '#dc2626', '#7c3aed', '#16a34a', '#2563eb'];

  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.top = '-20px';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = (Math.random() * 2 + 2) + 's';
    c.style.animationDelay = (Math.random() * 0.8) + 's';
    c.style.width = c.style.height = (Math.random() * 8 + 6) + 'px';
    if (Math.random() > 0.5) c.style.borderRadius = '50%';
    container.appendChild(c);

    setTimeout(() => c.remove(), 5000);
  }
}

/* ============ QR ============ */
function generateQR() {
  const url = window.location.href;
  const urlText = document.getElementById('qrUrlText');
  const qrEl = document.getElementById('qrcode');

  if (urlText) urlText.textContent = url;

  if (qrEl && typeof QRCode !== 'undefined') {
    qrEl.innerHTML = '';
    new QRCode(qrEl, {
      text: url,
      width: 180,
      height: 180,
      colorDark: '#0b1120',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }
}