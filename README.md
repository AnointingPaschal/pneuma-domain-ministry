# Pneuma Domain Ministry

A beautiful, single-page church website for **Pneuma Domain Ministry** —
*A Place of Healing, Hope & Grace*.

Built with React + Vite. No backend, no new dependencies, no API keys.

## What is on the site

- Sticky navbar with mobile menu and a gold “Plan Your Visit” button
- Hero with a worship image, service-time chips, and Psalm 147:3 —
  “He heals the brokenhearted and binds up their wounds.”
- Welcome / About, with Faith, Healing and Community values
- Service times: Sundays 9:00 AM & 11:30 AM, Wednesdays 6:00 PM prayer
- Night of Grace featured event — Sunday, December 6, 2026, 6:00–9:00 PM
- Ministries: Kids, Youth, Worship & Music, Prayer & Healing, Outreach, Media
- Latest sermons, upcoming events, giving, and a Plan Your Visit / contact form
- Footer with scripture and contact details

The contact form has no backend: submitting it shows a thank-you state in React.
“Reserve a Seat” and “Give Today” open a pre-filled email to the ministry.

## Design — logo palette & animations

The site uses the ministry's real logo (`public/logo.png`, a transparent
PNG) in the navbar, footer, and as the favicon. Its colours are the site
palette: PDM blue `#2D72B7` (primary, headings, buttons), deep navy
`#0F2A44` / `#123A63` (dark sections), flame red `#E21D24` (sparingly —
Night of Grace accents and the flame), swoosh gold `#F5C400`
(underlines, dividers, highlights), on an ivory `#FDF8F0` background.

Effects and animations — pure CSS + React, no new dependencies:

- Scroll-reveal sections and cards via `IntersectionObserver`
  (fade + rise, staggered)
- Hero with a slow Ken Burns zoom, blue gradient overlay, gold swoosh
  divider echoing the logo, floating flame dots, and staggered
  headline words animating in on load; gentle parallax on scroll
- Animated stat counters that count up when visible
- Cards with hover lift, gold/red top-border sweep, and image zoom
- Navbar that gains a shadow on scroll, with an animated gold/blue/red
  swoosh line and gold underline sweeps on links
- Scripture ticker (marquee) of welcome words; button hover lift/glow
- `prefers-reduced-motion` disables the animations

Images are hosted Unsplash photos loaded by URL. The logo's blue
lettering sits on a white/ivory pill in the navbar and footer so it
stays readable on the dark footer background.

## How to run

```bash
npm install
npm run dev
```

Open the local address Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

The production output is written to `dist/`. Preview it with:

```bash
npm run preview
```

## Deploy

This project is set up to be served as a static site, for example with
Cloudflare Pages: connect the GitHub repo, set the build command to
`npm run build` and the output directory to `dist`.

## Placeholders — to be confirmed

Some details are plausible placeholders until the ministry confirms them.
They are noted in comments in `src/App.jsx` and are **not** labelled as
placeholders on the page itself:

- Venue: Grace Chapel (address to be confirmed)
- Contact: hello@pneumadomain.org (placeholder)
- Service times, Night of Grace date, sermon titles/preachers/dates, and
  the stats (12+ years, 500+ families, 40+ ministries) are illustrative
