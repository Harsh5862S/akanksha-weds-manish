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
  let checkCounter = 0;

  function paintCover() {
    const rect = wrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#9b713e');
    gradient.addColorStop(.45, '#e0c080');
    gradient.addColorStop(1, '#9b713e');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    for (let x = -rect.height; x < rect.width; x += 12) {
      ctx.save();
      ctx.translate(x, 0);
      ctx.rotate(-.55);
      ctx.fillRect(0, 0, 2, rect.height * 2);
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'destination-out';
    revealed = false;
    wrap.classList.remove('is-revealed');
  }

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function scratchTo(point) {
    const radius = Math.max(13, Math.min(22, canvas.clientHeight * .34));
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
    if (++checkCounter % 8 === 0) checkReveal();
  }

  function checkReveal() {
    if (revealed || !canvas.width || !canvas.height) return;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    // Sample every 32nd pixel for a quick estimate of cleared area.
    for (let i = 3; i < pixels.length; i += 128) {
      if (pixels[i] < 80) transparent++;
    }
    const samples = Math.ceil(pixels.length / 128);
    if (transparent / samples > .43) {
      revealed = true;
      wrap.classList.add('is-revealed');
    }
  }

  canvas.addEventListener('pointerdown', event => {
    if (revealed) return;
    drawing = true;
    lastPoint = null;
    canvas.setPointerCapture?.(event.pointerId);
    scratchTo(pointFromEvent(event));
    event.preventDefault();
  });
  canvas.addEventListener('pointermove', event => {
    if (!drawing || revealed) return;
    scratchTo(pointFromEvent(event));
    event.preventDefault();
  });
  const stopDrawing = () => { drawing = false; lastPoint = null; checkReveal(); };
  canvas.addEventListener('pointerup', stopDrawing);
  canvas.addEventListener('pointercancel', stopDrawing);
  canvas.addEventListener('lostpointercapture', stopDrawing);

  // Initialize after layout/fonts settle so the canvas matches the visible date panel.
  const init = () => requestAnimationFrame(paintCover);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(init);
  else window.addEventListener('load', init, { once: true });
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (revealed) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(paintCover, 150);
  });
})();
