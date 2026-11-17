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


// Scratch-to-reveal date: works with mouse, touch and stylus.
(() => {
  const canvas = document.getElementById('scratchLayer');
  const wrapper = document.getElementById('scratchDate');
  const hint = document.getElementById('scratchHint');
  if (!canvas || !wrapper) return;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let drawing = false;
  let lastCheck = 0;

  function paintCover() {
    const rect = wrapper.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#8d642d');
    gradient.addColorStop(.45, '#d6b36e');
    gradient.addColorStop(1, '#9b713b');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = 'rgba(255,255,255,.28)';
    for (let x = 8; x < rect.width; x += 18) {
      ctx.fillRect(x, 0, 1, rect.height);
    }
    ctx.globalCompositeOperation = 'destination-out';
  }
  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  function erase(event) {
    const p = point(event);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  function revealIfEnough() {
    const now = Date.now();
    if (now - lastCheck < 250 || wrapper.classList.contains('revealed')) return;
    lastCheck = now;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4 * 12) if (pixels[i] < 80) transparent++;
    if (transparent / (pixels.length / (4 * 12)) > .48) {
      wrapper.classList.add('revealed');
      canvas.style.transition = 'opacity .5s ease';
      canvas.style.opacity = '0';
      window.setTimeout(() => { canvas.hidden = true; }, 550);
    }
  }
  canvas.addEventListener('pointerdown', event => {
    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    erase(event);
    event.preventDefault();
  });
  canvas.addEventListener('pointermove', event => {
    if (!drawing) return;
    erase(event);
    revealIfEnough();
    event.preventDefault();
  });
  const stop = () => { drawing = false; revealIfEnough(); };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);
  if (hint) hint.textContent = '✦ SCRATCH TO REVEAL ✦';
  paintCover();
  window.addEventListener('resize', () => { if (!wrapper.classList.contains('revealed')) paintCover(); });
})();

// Visitor-initiated background music (browsers block audible autoplay).
(() => {
  const music = document.getElementById('weddingMusic');
  const button = document.getElementById('musicToggle');
  if (!music || !button) return;
  const label = button.querySelector('.music-label');
  button.addEventListener('click', async () => {
    if (music.paused) {
      try {
        await music.play();
        button.classList.add('is-playing');
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-label', 'Pause wedding background music');
        if (label) label.textContent = 'Pause music';
      } catch (error) {
        if (label) label.textContent = 'Tap to play music';
      }
    } else {
      music.pause();
      button.classList.remove('is-playing');
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Play wedding background music');
      if (label) label.textContent = 'Play wedding music';
    }
  });
})();
