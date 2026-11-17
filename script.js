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

// Interactive scratch-off reveal for the wedding date.
(() => {
  const canvas = document.getElementById("scratchLayer");
  const wrapper = document.getElementById("scratchDate");
  const hint = document.getElementById("scratchHint");
  if (!canvas || !wrapper) return;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  let isDrawing = false;
  let lastPoint = null;
  let checkCounter = 0;
  let revealed = false;

  function paintScratchSurface() {
    const bounds = wrapper.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * ratio);
    canvas.height = Math.round(bounds.height * ratio);
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const gradient = context.createLinearGradient(0, 0, bounds.width, bounds.height);
    gradient.addColorStop(0, "#d8bd82");
    gradient.addColorStop(.48, "#a8793e");
    gradient.addColorStop(1, "#e8d09b");
    context.globalCompositeOperation = "source-over";
    context.fillStyle = gradient;
    context.fillRect(0, 0, bounds.width, bounds.height);

    // Fine flecks give the gold coating a tactile, foil-like finish.
    for (let i = 0; i < 100; i++) {
      const x = (i * 47.37) % bounds.width;
      const y = (i * 23.91) % bounds.height;
      context.fillStyle = i % 2 ? "rgba(255,250,220,.25)" : "rgba(75,35,20,.12)";
      context.beginPath();
      context.arc(x, y, i % 3 === 0 ? 1.1 : .6, 0, Math.PI * 2);
      context.fill();
    }
    context.globalCompositeOperation = "source-over";
    context.strokeStyle = "rgba(255,248,225,.65)";
    context.lineWidth = 1;
    context.strokeRect(.5, .5, bounds.width - 1, bounds.height - 1);
  }

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function scratchLine(from, to) {
    context.save();
    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 34;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    context.restore();
  }

  function revealIfMostlyScratched() {
    checkCounter++;
    if (checkCounter % 5 !== 0 || revealed) return;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    // Sample every 16th pixel for a fast estimate on mobile devices.
    for (let i = 3; i < pixels.length; i += 64) {
      if (pixels[i] < 80) transparent++;
    }
    const clearedRatio = transparent / (pixels.length / 64);
    if (clearedRatio > .42) {
      revealed = true;
      wrapper.classList.add("is-revealed");
      if (hint) hint.textContent = "DATE REVEALED ♥";
      window.setTimeout(() => canvas.remove(), 550);
    }
  }

  canvas.addEventListener("pointerdown", event => {
    if (revealed) return;
    isDrawing = true;
    lastPoint = pointFromEvent(event);
    wrapper.classList.add("is-scratching");
    canvas.setPointerCapture(event.pointerId);
    scratchLine(lastPoint, lastPoint);
  });

  canvas.addEventListener("pointermove", event => {
    if (!isDrawing || revealed) return;
    const nextPoint = pointFromEvent(event);
    scratchLine(lastPoint, nextPoint);
    lastPoint = nextPoint;
    revealIfMostlyScratched();
  });

  function stopScratching() { isDrawing = false; lastPoint = null; }
  canvas.addEventListener("pointerup", stopScratching);
  canvas.addEventListener("pointercancel", stopScratching);
  canvas.addEventListener("lostpointercapture", stopScratching);

  paintScratchSurface();
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => { if (!revealed) paintScratchSurface(); }).observe(wrapper);
  } else {
    window.addEventListener("resize", () => { if (!revealed) paintScratchSurface(); });
  }
})();
