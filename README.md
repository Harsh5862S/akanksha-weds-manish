# Akanksha Weds Manish — Wedding Invitation Website

A responsive, multi-section wedding invitation built with plain HTML, CSS and JavaScript. All invitation details are transcribed from the supplied three-page PDF.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a browser.

For a local development server, you can also run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Deploy on Render (Static Site)
1. Push the contents of this folder to a GitHub repository.
2. In Render, choose **New + → Static Site** and connect that repository.
3. Set **Root Directory** to the project folder if it is inside a larger repository; otherwise leave it blank.
4. Set **Build Command** to blank (or `echo "Static site"` if the form requires a value).
5. Set **Publish Directory** to `.`.
6. Click **Create Static Site**. Render will provide the public URL.

No Node.js, backend, database, or environment variables are required.

## Included interactions
- Interactive scratch-off gold foil reveal on the 5 December 2026 date panel (mouse or touch).
- Live countdown to the wedding date/time.
- Copy venue address.
- Download an `.ics` calendar event.
- Print the invitation.

## Source details retained
- Akanksha (D/o. Smt. Suman & Sh. Rajeev Sharma)
- Manish (S/o. Smt. Surkhsha Devi & Sh. Rajinder Thakur)
- Friday, 4th December, 2026 — Ladies Sangeet, 8.00 p.m.
- Saturday, 5th December, 2026 — Reception of Barat, 8.00 p.m.; Dinner, 9.00 p.m.; Doli — Taaron ki chhaon mein
- Savitrii Lawns, Railway Road, Karnal
- Special invitation from Atharv, Ivaan
- Smt. Shanti Devi, H. No. 821/3, New Prem Colony, Karnal
- Mob.: 94163-68711, 72064-84408

The spelling “Surkhsha” and venue spelling “SAVITRII LAWNS” are retained as printed in the PDF.


## Latest updates
- Page order is now: wedding date/scratch reveal first, programme second, family invitation third.
- Added the supplied `Din Shagna Da` MP3 as optional looping background music. Visitors start/pause it using the floating music control; audible autoplay is not forced by browsers.
- Music file is stored at `assets/din-shagna-da.mp3`.


## Latest updates
- Section order: wedding date/scratch reveal first, family invitation second, programme/venue third.
- Background music attempts to autoplay on page load and starts on the visitor's first interaction if the browser blocks audible autoplay. A music toggle remains available.
- Browsers may block audible autoplay unless the visitor has interacted with the page or previously allowed sound. This browser policy cannot be reliably overridden by website code.


## Typography refinement
The bride and groom names use the Allura script font so the capital A in “Akanksha” has a clearer, more recognizable letterform.
