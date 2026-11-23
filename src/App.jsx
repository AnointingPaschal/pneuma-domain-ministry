import { useEffect, useRef, useState } from 'react'
import './App.css'

/*
  Pneuma Domain Ministry — single-page church website.
  Logo: public/logo.png (the real PDM logo, transparent PNG).
  Palette sampled from the logo: blue #2D72B7, flame red #E21D24,
  swoosh gold #F5C400, deep navy #0F2A44 / #123A63, ivory #FDF8F0.
  Placeholder details (to be confirmed with the ministry — not shown as
  "placeholder" text on the page, only noted here):
  - Service times: Sundays 9:00am & 11:30am, Wednesdays 6:00pm prayer.
  - Night of Grace: Sunday, December 6, 2026, 6:00–9:00pm. Corrected
    from "Friday, December 6" because December 6, 2026 is a Sunday.
  - Venue: Grace Chapel (address to be confirmed).
  - Contact: hello@pneumadomain.org (placeholder).
  - Stats (12+ years, 500+ families, 40+ ministries) are illustrative.
  - Sermon titles, preachers, dates and durations are placeholders.
*/

const U = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

const IMAGES = {
  hero: U('photo-1438032005730-c779502df39b', 2000),
  interior: U('photo-1473177104440-ffee2f376098'),
  community: U('photo-1529156069898-49953e39b3ac'),
  kids: U('photo-1503454537195-1dcabb73ffb9', 1200),
  prayer: U('photo-1548625149-fc4a29cf7092', 1200),
  music: U('photo-1470225620780-dba8ba36b745', 1200),
  bible: U('photo-1504052434569-70ad5836ab65', 1200),
  hands: U('photo-1507692049790-de58290a4334', 1200),
}

const NAV_LINKS = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Services', '#services'],
  ['Ministries', '#ministries'],
  ['Events', '#events'],
  ['Sermons', '#sermons'],
  ['Give', '#give'],
  ['Contact', '#contact'],
]

const MINISTRIES = [
  { icon: '✿', name: 'Kids', text: 'A safe, joyful place where children discover God’s love through stories, songs and hands-on learning.', img: IMAGES.kids },
  { icon: '✦', name: 'Youth', text: 'A community for teenagers and young adults to grow in faith, friendship and purpose.', img: IMAGES.community },
  { icon: '♪', name: 'Worship & Music', text: 'Voices and instruments lifted together — a choir and band that lead us into God’s presence.', img: IMAGES.music },
  { icon: '✝', name: 'Prayer & Healing', text: 'Intercession, healing prayer and quiet space to bring every burden before God.', img: IMAGES.prayer },
  { icon: '♥', name: 'Outreach', text: 'Serving our neighbours with food, visits and practical help — love in action, beyond our walls.', img: IMAGES.hands },
  { icon: '▶', name: 'Media', text: 'Sharing sermons, worship and the Night of Grace online so no one has to miss a moment.', img: IMAGES.bible },
]

const SERMONS = [
  { img: IMAGES.bible, title: 'He Heals the Brokenhearted', preacher: 'Pastor — Pneuma Domain Ministry', date: 'Nov 16, 2026', duration: '42 min', tag: 'Healing' },
  { img: IMAGES.hands, title: 'Hope That Does Not Disappoint', preacher: 'Pastor — Pneuma Domain Ministry', date: 'Nov 9, 2026', duration: '38 min', tag: 'Hope' },
  { img: IMAGES.music, title: 'Grace Upon Grace', preacher: 'Pastor — Pneuma Domain Ministry', date: 'Nov 2, 2026', duration: '45 min', tag: 'Grace' },
]

const EVENTS = [
  { day: '06', month: 'Dec', year: '2026', title: 'Night of Grace', time: '6:00–9:00 PM', place: 'Grace Chapel', desc: 'An Evening of Healing, Hope & Grace — worship, prayer and testimonies.' },
  { day: '21', month: 'Dec', year: '2026', title: 'Christmas Carol Service', time: '5:00 PM', place: 'Grace Chapel', desc: 'Carols, candles and the Christmas story, for the whole family.' },
  { day: '01', month: 'Jan', year: '2027', title: 'New Year Prayer', time: '9:00 AM', place: 'Grace Chapel', desc: 'Begin the year together in prayer, thanksgiving and fresh vision.' },
  { day: '18', month: 'Jan', year: '2027', title: 'Baptism Sunday', time: '11:30 AM Service', place: 'Grace Chapel', desc: 'Celebrating new life in Christ as believers are baptised.' },
]

/* Count up when the stat scrolls into view. */
function AnimatedNumber({ end, suffix }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const duration = 1400
          const tick = (now) => {
            const p = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(end * eased))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end])
  return (
    <strong ref={ref}>
      {value}
      {suffix}
    </strong>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroY, setHeroY] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  /* Navbar state + gentle hero parallax, throttled with requestAnimationFrame. */
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24)
        setHeroY(window.scrollY)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Scroll-reveal: add .revealed to every .reveal element as it enters view. */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const tickerItems = [
    'Healing', 'Hope', 'Grace', 'Psalm 147:3', 'Night of Grace — Dec 6',
    'Sundays 9:00 & 11:30 AM', 'Welcome Home',
  ]
  const ticker = [...tickerItems, ...tickerItems]

  return (
    <div className="site">
      {/* 1. Sticky navbar */}
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <a className="brand" href="#home" aria-label="Pneuma Domain Ministry — home">
            <span className="brand-logo">
              <img src="/logo.png" alt="Pneuma Domain Ministry logo" height="48" width="48" />
            </span>
            <span className="brand-text">
              <strong>Pneuma Domain</strong>
              <small>MINISTRY</small>
            </span>
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
            {NAV_LINKS.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <a className="btn btn-gold btn-sm" href="#visit" onClick={() => setMenuOpen(false)}>Plan Your Visit</a>
          </nav>
        </div>
        <span className="nav-swoosh" aria-hidden="true" />
      </header>

      <main>
        {/* 2. Hero */}
        <section id="home" className="hero">
          <div className="hero-bg" style={{ backgroundImage: `url(${IMAGES.hero})` }} aria-hidden="true" />
          <div className="hero-overlay" aria-hidden="true" />
          <span className="flame-dot flame-dot-1" aria-hidden="true" />
          <span className="flame-dot flame-dot-2" aria-hidden="true" />
          <span className="flame-dot flame-dot-3" aria-hidden="true" />
          <div
            className="container hero-content"
            style={{ transform: `translateY(${Math.min(heroY * 0.18, 90)}px)`, opacity: Math.max(0, 1 - heroY / 700) }}
          >
            <p className="eyebrow eyebrow-light hero-anim" style={{ animationDelay: '0.05s' }}>
              <span className="flame" aria-hidden="true">🔥</span>
              &nbsp;Pneuma Domain Ministry&nbsp;
              <span className="flame" aria-hidden="true">🔥</span>
            </p>
            <h1>
              <span className="hero-word hero-anim" style={{ animationDelay: '0.15s' }}>A Place of</span>{' '}
              <span className="hero-word hero-word-gold hero-anim" style={{ animationDelay: '0.3s' }}>Healing,</span>
              <br />
              <span className="hero-word hero-anim" style={{ animationDelay: '0.45s' }}>Hope &amp;</span>{' '}
              <span className="hero-word hero-word-gold hero-anim" style={{ animationDelay: '0.6s' }}>Grace</span>
            </h1>
            <p className="hero-sub hero-anim" style={{ animationDelay: '0.75s' }}>
              Come as you are. Leave renewed. Join a family of faith where
              broken hearts are healed, hope is restored, and grace abounds.
            </p>
            <div className="hero-cta hero-anim" style={{ animationDelay: '0.9s' }}>
              <a className="btn btn-gold" href="#visit">Join Us This Sunday</a>
              <a className="btn btn-outline-light" href="#night-of-grace">Watch Night of Grace</a>
            </div>
            <div className="hero-chips hero-anim" style={{ animationDelay: '1.05s' }} aria-label="Service times">
              <span>Sundays · 9:00 AM</span>
              <span>Sundays · 11:30 AM</span>
              <span>Wednesdays · 6:00 PM Prayer</span>
            </div>
          </div>
          {/* Gold swoosh divider, echoing the logo's swoosh */}
          <svg className="hero-swoosh" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,40 C360,90 720,0 1080,35 C1260,52 1380,45 1440,30 L1440,90 L0,90 Z" fill="#F5C400" />
            <path d="M0,55 C360,100 720,20 1080,50 C1260,65 1380,58 1440,45 L1440,90 L0,90 Z" fill="#FDF8F0" />
          </svg>
          <div className="scripture-strip">
            <div className="container">
              <p>“He heals the brokenhearted and binds up their wounds.” <span>— Psalm 147:3</span></p>
            </div>
          </div>
        </section>

        {/* Ticker — welcome words, decorative repetition of on-page text */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {ticker.map((item, i) => (
              <span key={i} className="ticker-item">
                {item} <i>✦</i>
              </span>
            ))}
          </div>
        </div>

        {/* 3. Welcome / About */}
        <section id="about" className="section">
          <div className="container about-grid">
            <div className="about-images reveal">
              <img src={IMAGES.interior} alt="Inside Grace Chapel during worship" loading="lazy" />
              <img className="about-img-small" src={IMAGES.community} alt="Members of the Pneuma Domain Ministry community together" loading="lazy" />
              <span className="about-badge" aria-hidden="true">Est. in grace</span>
            </div>
            <div className="reveal">
              <p className="eyebrow">Welcome Home</p>
              <h2>Welcome to Pneuma Domain Ministry</h2>
              <p>
                Pneuma Domain Ministry is a family of believers gathered around
                one simple conviction: God still heals, still restores, and still
                welcomes everyone home. Whether you are stepping into church for
                the first time or returning after many years, there is a seat
                saved for you here.
              </p>
              <p>
                Our Sundays are full of heartfelt worship, practical teaching
                from God’s Word, and prayer for all who need it. Our week is
                full of community — small groups, prayer, outreach and friendship
                that carries you through every season.
              </p>
              <div className="values">
                <div className="value-card"><span aria-hidden="true">✦</span><h3>Faith</h3><p>Rooted in Scripture, growing in trust.</p></div>
                <div className="value-card"><span aria-hidden="true">♥</span><h3>Healing</h3><p>Prayer and care for the brokenhearted.</p></div>
                <div className="value-card"><span aria-hidden="true">◍</span><h3>Community</h3><p>A family that walks together.</p></div>
              </div>
              <div className="stats" aria-label="Ministry at a glance">
                <div><AnimatedNumber end={12} suffix="+" /><span>Years of ministry</span></div>
                <div><AnimatedNumber end={500} suffix="+" /><span>Families</span></div>
                <div><AnimatedNumber end={40} suffix="+" /><span>Ministries &amp; groups</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Service times */}
        <section id="services" className="section section-soft">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Join Us</p>
              <h2>Service Times</h2>
              <p>Come early, stay for coffee, and bring the whole family.</p>
            </div>
            <div className="grid-3">
              <article className="card service-card reveal">
                <p className="card-eyebrow">Sunday</p>
                <h3>Sunday Celebration</h3>
                <p className="big-time">9:00 AM</p>
                <p>Worship, the Word and prayer — our first celebration of the day at Grace Chapel.</p>
                <a href="#visit">Plan your visit →</a>
              </article>
              <article className="card service-card featured reveal">
                <p className="card-eyebrow">Sunday</p>
                <h3>Sunday Celebration</h3>
                <p className="big-time">11:30 AM</p>
                <p>Our main family service, with Kids Church and a warm welcome for newcomers.</p>
                <a href="#visit">Plan your visit →</a>
              </article>
              <article className="card service-card reveal">
                <p className="card-eyebrow">Wednesday</p>
                <h3>Midweek Prayer</h3>
                <p className="big-time">6:00 PM</p>
                <p>A quieter evening of prayer, worship and healing ministry in the middle of the week.</p>
                <a href="#visit">Plan your visit →</a>
              </article>
            </div>
          </div>
        </section>

        {/* 5. Night of Grace */}
        <section id="night-of-grace" className="section">
          <div className="container">
            <article className="event-feature reveal">
              <div className="event-feature-img">
                <img src={IMAGES.prayer} alt="A moment of prayer during worship" loading="lazy" />
                <span className="event-badge">Featured Event</span>
                <span className="flame-badge" aria-hidden="true">🔥</span>
              </div>
              <div className="event-feature-body">
                <p className="eyebrow eyebrow-red">An Evening of Healing, Hope &amp; Grace</p>
                <h2>Night of Grace</h2>
                <p className="event-date">Sunday, December 6 &nbsp;·&nbsp; 6:00–9:00 PM &nbsp;·&nbsp; Grace Chapel</p>
                <p>
                  One unforgettable evening of worship, prayer for healing,
                  testimonies and grace. Bring a friend, bring your burdens,
                  and come expecting God to move.
                </p>
                <ul className="check-list">
                  <li>Extended worship and prayer for healing</li>
                  <li>Stories of hope from our community</li>
                  <li>Ministry time for everyone who asks</li>
                  <li>Open to all — no ticket needed, seats are free</li>
                </ul>
                <div className="hero-cta">
                  <a className="btn btn-flame" href="mailto:hello@pneumadomain.org?subject=Reserve%20a%20seat%20—%20Night%20of%20Grace">Reserve a Seat</a>
                  <a className="btn btn-outline" href="#events">See all events</a>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* 6. Ministries */}
        <section id="ministries" className="section section-soft">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Find Your Place</p>
              <h2>Ministries for Every Season</h2>
              <p>There is a place for you to belong — and a place for you to serve.</p>
            </div>
            <div className="grid-3 ministries-grid">
              {MINISTRIES.map((m) => (
                <article className="card ministry-card reveal" key={m.name}>
                  <div className="ministry-img">
                    <img src={m.img} alt="" loading="lazy" />
                  </div>
                  <div className="ministry-body">
                    <span className="ministry-icon" aria-hidden="true">{m.icon}</span>
                    <h3>{m.name}</h3>
                    <p>{m.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Latest sermons */}
        <section id="sermons" className="section">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">The Word</p>
              <h2>Latest Sermons</h2>
              <p>Listen again, or catch up on a message you missed.</p>
            </div>
            <div className="grid-3">
              {SERMONS.map((s) => (
                <article className="card sermon-card reveal" key={s.title}>
                  <div className="sermon-img">
                    <img src={s.img} alt="" loading="lazy" />
                    <span className="sermon-tag">{s.tag}</span>
                    <button type="button" className="play-btn" aria-label={`Play sermon: ${s.title}`}>▶</button>
                  </div>
                  <div className="card-body">
                    <h3>{s.title}</h3>
                    <p className="meta">{s.preacher}</p>
                    <p className="meta">{s.date} · {s.duration}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Upcoming events */}
        <section id="events" className="section section-soft">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">What’s Coming Up</p>
              <h2>Upcoming Events</h2>
              <p>Mark your calendar — we would love to see you there.</p>
            </div>
            <ul className="events-list">
              {EVENTS.map((e) => (
                <li className="event-row reveal" key={e.title}>
                  <div className="event-date-box"><strong>{e.day}</strong><span>{e.month} {e.year}</span></div>
                  <div className="event-info">
                    <h3>{e.title}</h3>
                    <p>{e.desc}</p>
                  </div>
                  <div className="event-meta"><span>{e.time}</span><span>{e.place}</span></div>
                  <a className="btn btn-outline btn-sm" href="#night-of-grace">Details</a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 9. Giving */}
        <section id="give" className="section give-section">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow eyebrow-light">Generosity</p>
              <h2 className="light-heading">Give with a Cheerful Heart</h2>
              <p className="light-text">
                Your tithes and offerings fuel healing prayer, outreach, kids
                and youth work, and care for families in our community.
                Every gift, large or small, is received with gratitude.
              </p>
            </div>
            <div className="grid-3">
              <article className="card give-card reveal"><span aria-hidden="true">✦</span><h3>Tithes</h3><p>Faithful, regular giving that sustains the ministry week by week.</p></article>
              <article className="card give-card reveal"><span aria-hidden="true">♥</span><h3>Offerings</h3><p>Special gifts for outreach, missions and one-off needs as they arise.</p></article>
              <article className="card give-card reveal"><span aria-hidden="true">◍</span><h3>Building &amp; Care</h3><p>Supporting Grace Chapel and practical care for families in need.</p></article>
            </div>
            <div className="give-cta reveal">
              <a className="btn btn-gold btn-lg" href="mailto:hello@pneumadomain.org?subject=Giving%20—%20Pneuma%20Domain%20Ministry">Give Today</a>
              <p>To give by bank transfer or in person on Sunday, please contact us — details on request.</p>
            </div>
          </div>
        </section>

        {/* 10. Plan Your Visit / Contact */}
        <section id="visit" className="section">
          <div className="container visit-grid">
            <div className="reveal">
              <p className="eyebrow">Plan Your Visit</p>
              <h2>We Can’t Wait to Meet You</h2>
              <p>
                Tell us you are coming and we will look out for you, save you
                a seat, and introduce you to someone friendly at the door.
              </p>
              <ul className="contact-list">
                <li><strong>Venue</strong><span>Grace Chapel — address to be confirmed</span></li>
                <li><strong>Email</strong><a href="mailto:hello@pneumadomain.org">hello@pneumadomain.org</a></li>
                <li><strong>Sundays</strong><span>9:00 AM &amp; 11:30 AM</span></li>
                <li><strong>Wednesdays</strong><span>6:00 PM Prayer</span></li>
              </ul>
            </div>
            <div id="contact" className="form-card reveal">
              {submitted ? (
                <div className="thank-you" role="status">
                  <span className="thank-you-mark" aria-hidden="true">✦</span>
                  <h3>Thank you, {form.name || 'friend'}!</h3>
                  <p>
                    Your message has been received. We will be in touch soon —
                    and we look forward to welcoming you at Grace Chapel.
                  </p>
                  <button type="button" className="btn btn-outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }) }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3>Get in touch</h3>
                  <label>
                    Your name
                    <input type="text" name="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" autoComplete="name" />
                  </label>
                  <label>
                    Email
                    <input type="email" name="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.org" autoComplete="email" />
                  </label>
                  <label>
                    Message
                    <textarea name="message" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help, or that you are planning a visit…" />
                  </label>
                  <button type="submit" className="btn btn-gold btn-block">Send Message</button>
                  <p className="form-note">We reply personally — usually within a day or two.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 11. Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <p className="brand footer-brand">
              <span className="brand-logo brand-logo-light">
                <img src="/logo.png" alt="Pneuma Domain Ministry logo" height="72" width="72" />
              </span>
              <span className="brand-text"><strong>Pneuma Domain</strong><small>MINISTRY</small></span>
            </p>
            <p className="footer-scripture">“He heals the brokenhearted and binds up their wounds.” — Psalm 147:3</p>
            <p>A place of healing, hope &amp; grace.</p>
          </div>
          <nav aria-label="Footer">
            <h3>Explore</h3>
            {NAV_LINKS.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>
          <div>
            <h3>Visit Us</h3>
            <p>Grace Chapel — address to be confirmed</p>
            <p>Sundays 9:00 AM &amp; 11:30 AM</p>
            <p>Wednesdays 6:00 PM Prayer</p>
            <p><a href="mailto:hello@pneumadomain.org">hello@pneumadomain.org</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© 2026 Pneuma Domain Ministry. All rights reserved.</p>
            <p>An Evening of Healing, Hope &amp; Grace</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
