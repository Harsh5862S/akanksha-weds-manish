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
