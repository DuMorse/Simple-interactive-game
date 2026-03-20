(function () {
  const TOTAL_MS = 20 * 60 * 1000;
  let remaining = TOTAL_MS;
  let timerId = null;
  let running = false;

  window.__DEFEAT__ = false;
  window.__VICTORY__ = false;

  const display = document.getElementById('display');
  const circle = document.getElementById('circle');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const skipBtn = document.getElementById('skipBtn');
  const statusText = document.getElementById('statusText');
  const overlayDefeat = document.getElementById('overlay-defeat');
  const overlayVictory = document.getElementById('overlay-victory');
  const dismissDefeat = document.getElementById('dismissDefeat');
  const dismissVictory = document.getElementById('dismissVictory');
  const forceVictory = document.getElementById('forceVictory');
  const forceDefeat = document.getElementById('forceDefeat');
  const autoReset = document.getElementById('autoReset');
  const confettiContainer = document.getElementById('confetti');

  function formatMs(ms) {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function updateUI() {
    display.textContent = formatMs(remaining);
    const perc = 1 - remaining / TOTAL_MS;
    const deg = Math.min(360, Math.max(0, perc * 360));
    circle.style.setProperty('--p', deg + 'deg');
    statusText.textContent = running
      ? 'Contando...'
      : remaining === TOTAL_MS
      ? 'Pronto — pressione Start.'
      : 'Pausado';
  }

  function tick() {
    const now = Date.now();
    const last = tick._last || now;
    const delta = now - last;
    tick._last = now;
    remaining = Math.max(0, remaining - delta);
    updateUI();
    if (remaining <= 0) {
      stopTimer();
      onTimerEnd();
    } else timerId = requestAnimationFrame(tick);
  }

  function startTimer() {
    if (running) return;
    running = true;
    tick._last = Date.now();
    timerId = requestAnimationFrame(tick);
    updateUI();
  }

  function stopTimer() {
    running = false;
    if (timerId) cancelAnimationFrame(timerId);
    timerId = null;
    tick._last = null;
    updateUI();
  }

  function resetTimer() {
    stopTimer();
    remaining = TOTAL_MS;
    updateUI();
  }

  function onTimerEnd() {
    window.__DEFEAT__ = true;
    showDefeat();
    socket.emit("timerZero");
    if (autoReset.checked) setTimeout(() => resetTimer(), 1500);
  }

  function showDefeat() {
    overlayDefeat.classList.add('show');
    spawnConfetti(20);
  }

  function showVictory() {
    overlayVictory.classList.add('show');
    spawnConfetti(60);
  }

  function hideOverlays() {
    overlayDefeat.classList.remove('show');
    overlayVictory.classList.remove('show');
    clearConfetti();
  }

  function spawnConfetti(n = 40) {
    clearConfetti();
    confettiContainer.style.display = 'block';
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      el.style.left = Math.random() * 100 + '%';
      el.style.top = -(Math.random() * 20 + 5) + 'vh';
      el.style.background = randomColor();
      el.style.animationDelay = Math.random() * 600 + 'ms';
      confettiContainer.appendChild(el);
    }
  }

  function clearConfetti() {
    confettiContainer.innerHTML = '';
    confettiContainer.style.display = 'none';
  }

  function randomColor() {
    const palette = ['#ff7aa2', '#ffd166', '#9ad3bc', '#89b4ff', '#b38cff'];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', () => (running ? stopTimer() : startTimer()));
  resetBtn.addEventListener('click', resetTimer);
  skipBtn.addEventListener('click', () => {
    remaining = 0;
    updateUI();
    onTimerEnd();
  });
  forceVictory.addEventListener('click', showVictory);
  forceDefeat.addEventListener('click', showDefeat);
  dismissVictory.addEventListener('click', hideOverlays);
  dismissDefeat.addEventListener('click', hideOverlays);

  updateUI();
})();


window.addEventListener("load", () => {
  const pcID = 6;

  const socket = io("http://192.168.137.1:3000");

  socket.on("connect", () => {
    console.log("✅ Conectado ao servidor com ID:", pcID);
  });

  socket.on("disconnect", () => {
    console.log("❌ Desconectado do servidor");
  });

  socket.on("activate", (data) => {
    console.log("Recebido activate:", data);
    if (data.next === pcID) {
      fim.style.display = "none";
    } else {
      fim.style.display = "flex";
    }
  });

  socket.on("end", (data) => {
  if (data.result === "green") {
    document.body.style.backgroundColor = "green";
  } else if (data.result === "red") {
    document.body.style.backgroundColor = "red";
  }
});

});