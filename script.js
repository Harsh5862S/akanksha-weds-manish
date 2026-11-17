const weddingDate = new Date("2026-12-05T20:00:00+05:30").getTime();

function updateCountdown() {
  const remaining = weddingDate - Date.now();
  const values = remaining > 0
    ? {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000)
      }
    : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  Object.entries(values).forEach(([unit, value]) => {
    const node = document.getElementById(unit);
    if (node) node.textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

const toast = document.getElementById("toast");
function notify(message) {
  toast.textContent = message;
  window.setTimeout(() => { toast.textContent = ""; }, 2800);
}

document.getElementById("copyAddress").addEventListener("click", async () => {
  const address = "Savitrii Lawns, Railway Road, Karnal";
  try {
    await navigator.clipboard.writeText(address);
    notify("Venue address copied.");
  } catch {
    notify(address);
  }
});

document.getElementById("printInvite").addEventListener("click", () => window.print());

document.getElementById("addCalendar").addEventListener("click", () => {
  const event = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Akanksha Weds Manish//Wedding Invitation//EN",
    "BEGIN:VEVENT",
    "UID:akanksha-manish-wedding-20261205",
    "DTSTAMP:20261117T000000Z",
    "DTSTART:20261205T143000Z",
    "DTEND:20261205T180000Z",
    "SUMMARY:Akanksha Weds Manish",
    "LOCATION:Savitrii Lawns\\, Railway Road\\, Karnal",
    "DESCRIPTION:Wedding celebration of Akanksha and Manish.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([event], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Akanksha-Weds-Manish.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  notify("Wedding date calendar file downloaded.");
});


// Try audible autoplay on page load. Browsers may block it until the visitor interacts.
(() => {
  const music = document.getElementById('weddingMusic');
  const button = document.getElementById('musicToggle');
  if (!music || !button) return;
  const label = button.querySelector('.music-label');
  function playing() {
    button.classList.add('is-playing');
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', 'Pause wedding background music');
    if (label) label.textContent = 'Pause music';
  }
  function paused() {
    button.classList.remove('is-playing');
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Play wedding background music');
    if (label) label.textContent = 'Play wedding music';
  }
  async function startMusic() {
    try { await music.play(); playing(); return true; }
    catch (error) { if (label) label.textContent = 'Tap anywhere for music'; return false; }
  }
  // First attempt: play as soon as the invitation page opens.
  startMusic();
  // Fallback: browsers often require a visitor gesture before audible playback.
  const firstGesture = async () => {
    if (music.paused) await startMusic();
    if (!music.paused) {
      document.removeEventListener('pointerdown', firstGesture, true);
      document.removeEventListener('keydown', firstGesture, true);
    }
  };
  document.addEventListener('pointerdown', firstGesture, true);
  document.addEventListener('keydown', firstGesture, true);
  button.addEventListener('click', async () => {
    if (music.paused) await startMusic();
    else { music.pause(); paused(); }
  });
  music.addEventListener('play', playing);
  music.addEventListener('pause', paused);
})();


// Scratch-card interaction for the wedding date (mouse, touch and pen).
(() => {
  const wrap = document.getElementById('scratchDate');
  const canvas = document.getElementById('scratchLayer');
  if (!wrap || !canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  let drawing = false;
  let lastPoint = null;
  let revealed = false;
  let resizeObserver;

  function paintCover() {
    if (revealed) return;
    const rect = wrap.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#8d642e');
    gradient.addColorStop(0.48, '#e6c987');
    gradient.addColorStop(1, '#9c713b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Subtle metallic texture on the scratch-off surface.
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,.22)';
    ctx.lineWidth = 1;
    for (let x = -rect.height; x < rect.width + rect.height; x += 11) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + rect.height * 0.45, rect.height);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalCompositeOperation = 'destination-out';
    wrap.classList.remove('is-revealed');
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function eraseAt(point) {
    const radius = Math.max(16, Math.min(24, canvas.clientHeight * 0.42));
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = radius * 2;
    if (lastPoint) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    lastPoint = point;
  }

  function checkReveal() {
    if (revealed || !canvas.width || !canvas.height) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    let samples = 0;
    // Inspect every 16th pixel to estimate how much of the coating was erased.
    for (let pixel = 0; pixel < data.length; pixel += 64) {
      samples++;
      if (data[pixel + 3] < 100) transparent++;
    }
    if (samples && transparent / samples >= 0.38) {
      revealed = true;
      drawing = false;
      wrap.classList.add('is-revealed');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  canvas.addEventListener('pointerdown', event => {
    if (revealed) return;
    drawing = true;
    lastPoint = null;
    if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
    eraseAt(getPoint(event));
    event.preventDefault();
  });

  canvas.addEventListener('pointermove', event => {
    if (!drawing || revealed) return;
    eraseAt(getPoint(event));
    event.preventDefault();
  });

  function finishScratch() {
    if (!drawing) return;
    drawing = false;
    lastPoint = null;
    checkReveal();
  }
  canvas.addEventListener('pointerup', finishScratch);
  canvas.addEventListener('pointercancel', finishScratch);
  canvas.addEventListener('lostpointercapture', finishScratch);

  function initialize() {
    requestAnimationFrame(() => requestAnimationFrame(paintCover));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      if (!revealed) paintCover();
    });
    resizeObserver.observe(wrap);
  } else {
    window.addEventListener('resize', () => {
      if (!revealed) paintCover();
    });
  }
})();
