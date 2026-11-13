/* Frespresso site generator.
   Reads the design boards in design/boards and the content in data/*.json,
   and writes the seven static pages plus css/frespresso.css to the project root.
   Run: node tools/build.js   (Node 18+) */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const json = (p) => JSON.parse(read(p));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s) => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const site = json('data/site.json');
const testimonials = json('data/testimonials.json');
const gallery = json('data/gallery.json');
const credits = exists('data/credits.json') ? json('data/credits.json').items.filter((c) => exists('assets/images/' + c.file)) : [];
const B = site.business;
const isSet = (v) => v && v !== 'TBD';
const MAPS = isSet(B.google_maps_url) ? B.google_maps_url : '#';
const REVIEW = isSet(B.google_review_url) ? B.google_review_url : MAPS;
const SWIGGY = isSet(B.swiggy_url) ? B.swiggy_url : 'menu.html#swiggy';
const TEL = 'tel:' + B.phone_tel;

/* ---------- icons ---------- */
const ic = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const I = {
  img: ic('<rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="9" cy="9" r="2"></circle><path d="M21 15l-5-5L5 21"></path>'),
  arrow: ic('<path d="M5 12h14M13 6l6 6-6 6"></path>'),
  prev: ic('<path d="M15 6l-6 6 6 6"></path>'),
  next: ic('<path d="M9 6l6 6-6 6"></path>'),
  close: ic('<path d="M6 6l12 12M18 6L6 18"></path>'),
  burger: ic('<path d="M4 7h16M4 12h16M4 17h10"></path>'),
  phone: ic('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"></path>'),
  pin: ic('<path d="M12 22s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12z"></path><circle cx="12" cy="10" r="2.5"></circle>'),
  insta: ic('<rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><path d="M17.5 6.5h.01"></path>'),
  search: ic('<circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path>'),
  expand: ic('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>', ' style="width:18px;height:18px"'),
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"></path></svg>',
  alert: ic('<circle cx="12" cy="12" r="10"></circle><path d="M12 8v4M12 16h.01"></path>'),
  send: ic('<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"></path>'),
  user: ic('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>'),
  quote: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 7H6a3 3 0 0 0-3 3v7h7v-7H6.5A1.5 1.5 0 0 1 8 8.5h2zM21 7h-4a3 3 0 0 0-3 3v7h7v-7h-3.5A1.5 1.5 0 0 1 19 8.5h2z" fill="currentColor"></path></svg>',
  star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill="currentColor" stroke="none"></path>'
};

/* ---------- logo (from design/boards/Logo.dc.html) ---------- */
function logo(variant, tone, size) {
  const T = {
    color: { cup: '#2B1B14', leaf: '#3F7D58', steam: '#C8853B', word: '#2B1B14', sub: '#8E5419' },
    reversed: { cup: '#FAF3E7', leaf: '#8CC3A0', steam: '#C8853B', word: '#FAF3E7', sub: '#C8853B' }
  }[tone];
  const stacked = variant === 'stacked';
  const wordSize = stacked ? size * 0.46 : size * 0.6;
  const gap = (stacked ? size * 0.22 : size * 0.24).toFixed(1);
  const word = variant === 'icon' ? '' :
    `<span style="display:flex;flex-direction:column;gap:${Math.max(4, wordSize * 0.16).toFixed(1)}px">` +
    `<span style="font-family:var(--font-display);font-weight:600;font-size:${wordSize.toFixed(1)}px;letter-spacing:-0.02em;color:${T.word};white-space:nowrap">Frespresso</span>` +
    `<span style="font-family:var(--font-body);font-weight:600;font-size:${Math.max(9, wordSize * 0.27).toFixed(1)}px;letter-spacing:0.3em;color:${T.sub};white-space:nowrap;padding-left:${stacked ? '0.3em' : '2px'}">CAFE &amp; RESTO</span></span>`;
  return `<span class="fx-logo" style="display:inline-flex;align-items:center;gap:${gap}px;flex-direction:${stacked ? 'column' : 'row'};text-align:${stacked ? 'center' : 'left'};line-height:1" aria-hidden="true">` +
    `<svg width="${size}" height="${size}" viewBox="0 0 64 64" style="flex:none;overflow:visible">` +
    `<path class="fx-steam" d="M21 23c-3-3.5 3-6 0-10" stroke="${T.steam}" stroke-width="3.5" fill="none" stroke-linecap="round"></path>` +
    `<path d="M31 28C24 21 26 9 39 5c4 10 1 19-8 23z" fill="${T.leaf}"></path>` +
    `<path d="M12 31h36v7c0 8.3-6.7 15-15 15h-6c-8.3 0-15-6.7-15-15z" fill="${T.cup}"></path>` +
    `<path d="M48 35h2.5a6.5 6.5 0 0 1 0 13H46" stroke="${T.cup}" stroke-width="4" fill="none"></path>` +
    `<path d="M10 58h40" stroke="${T.cup}" stroke-width="4" stroke-linecap="round"></path></svg>${word}</span>`;
}

/* ---------- media: real file if supplied, labelled placeholder otherwise ---------- */
const wanted = new Set();
const imageMap = exists('data/images.json') ? json('data/images.json').map : {};
function findImage(label) {
  const base = 'assets/images/' + slug(label);
  wanted.add(slug(label) + '.jpg');
  const mapped = imageMap[slug(label)];
  if (mapped && exists('assets/images/' + mapped)) return 'assets/images/' + mapped;
  return['.jpg', '.jpeg', '.png', '.webp'].map((e) => base + e).find(exists);
}
function ph(label, cls = '', icon = I.img) {
  return `<div class="ph ${cls}" role="img" aria-label="Placeholder: ${esc(label)}">${icon}<span>${esc(label)}</span></div>`;
}
function media(label, cls = '') {
  const f = findImage(label);
  return f ? `<img class="fx-img" src="${f}" alt="${esc(label)}" loading="lazy" decoding="async">` : ph(label, cls);
}
function swapPlaceholders(html) {
  return html.replace(/<div class="ph[^"]*" role="img" aria-label="Placeholder: ([^"]+)">[\s\S]*?<\/div>/g, (m, label) => {
    if (/^(Map|Instagram post)/.test(label)) return m;
    const f = findImage(label.replace(/&amp;/g, '&'));
    return f ? `<img class="fx-img" src="${f}" alt="${label}" loading="lazy" decoding="async">` : m;
  });
}

/* ---------- shared layout ---------- */
const NAV = [['home', 'Home', 'index.html'], ['about', 'About', 'about.html'], ['menu', 'Menu', 'menu.html'], ['experience', 'Experience', 'experience.html'], ['gallery', 'Gallery', 'gallery.html'], ['reviews', 'Reviews', 'reviews.html'], ['contact', 'Contact', 'contact.html']];
const navLinks = (active, chevron) => NAV.map(([id, label, href]) =>
  `<a href="${href}"${id === active ? ' class="is-active" aria-current="page"' : ''}>${label}${chevron ? I.next : ''}</a>`).join('');

function header(active) {
  return `<header class="fx-header" id="site-header">
  <div class="fx-wrap fx-header__in">
    <a class="fx-header__logo" href="index.html" aria-label="Frespresso Cafe &amp; Resto, home">
      <span class="fx-logo-h">${logo('horizontal', 'color', 48)}</span>
      <span class="fx-logo-i">${logo('icon', 'color', 40)}</span>
    </a>
    <nav class="fx-nav" aria-label="Main">${navLinks(active)}</nav>
    <div class="fx-header__actions">
      <a class="fx-btn fx-btn--accent fx-btn--sm fx-header__cta" href="${SWIGGY}">Order on Swiggy</a>
      <button class="fx-iconbtn fx-burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-drawer" data-drawer-open>${I.burger}</button>
    </div>
  </div>
</header>
<div class="fx-scrim" data-drawer-close hidden></div>
<aside class="fx-drawer" id="site-drawer" role="dialog" aria-modal="true" aria-label="Site menu" hidden>
  <div class="fx-drawer__top">
    <a href="index.html" aria-label="Frespresso Cafe &amp; Resto, home" style="display:inline-flex;text-decoration:none">${logo('horizontal', 'color', 40)}</a>
    <button class="fx-iconbtn" type="button" aria-label="Close menu" data-drawer-close>${I.close}</button>
  </div>
  <nav class="fx-drawer__nav" aria-label="Mobile">${navLinks(active, true)}</nav>
  <div class="fx-drawer__foot">
    <a class="fx-btn fx-btn--primary fx-btn--block" href="${TEL}">${I.phone}Call ${B.phone_display}</a>
    <a class="fx-btn fx-btn--accent fx-btn--block" href="${SWIGGY}">Order on Swiggy</a>
    <p class="fx-small" style="text-align:center">${B.instagram}</p>
  </div>
</aside>`;
}

function footer() {
  const r = site.ratings.map((x) => `${x.platform} ${x.score.toFixed(1)}`).join(' · ');
  return `<footer class="fx-footer">
  <div class="fx-wrap">
    <div class="fx-footer__grid">
      <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start">
        <a href="index.html" aria-label="Frespresso Cafe &amp; Resto, home" style="display:inline-flex">${logo('stacked', 'reversed', 76)}</a>
        <p style="margin:0;font-size:15px;line-height:1.6;max-width:280px">An entertainment cafe on Station Road, Solapur. Coffee, games and good company since ${B.since}.</p>
        <div class="fx-social">
          <a class="fx-iconbtn fx-iconbtn--dark" href="${B.instagram_url}" aria-label="Instagram ${B.instagram}">${I.insta}</a>
          <a class="fx-iconbtn fx-iconbtn--dark" href="${TEL}" aria-label="Call ${B.phone_display}">${I.phone}</a>
          <a class="fx-iconbtn fx-iconbtn--dark" href="${MAPS}" aria-label="Get directions">${I.pin}</a>
        </div>
      </div>
      <div><h4>Visit</h4><ul class="fx-footer__list"><li>${esc(B.address).replace(/'/g, '’')}</li><li><a href="${TEL}">${B.phone_display}</a></li><li>${esc(B.hours)}</li></ul></div>
      <div><h4>Explore</h4><ul class="fx-footer__list"><li><a href="about.html">About us</a></li><li><a href="menu.html">Menu</a></li><li><a href="experience.html">Experience</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="reviews.html">Reviews</a></li><li><a href="contact.html">Contact</a></li></ul></div>
      <div><h4>Order &amp; follow</h4><ul class="fx-footer__list"><li><a href="${SWIGGY}">Order on Swiggy</a></li><li><a href="${B.instagram_url}">Instagram ${B.instagram}</a></li><li>${r}</li></ul></div>
    </div>
    <div class="fx-footer__bar"><span>© ${new Date().getFullYear()} Frespresso Cafe &amp; Resto, Solapur</span><span>Brewing good times since ${B.since}${credits.length ? ' · <a href="menu.html#credits">Photo credits</a>' : ''}</span></div>
  </div>
  <a class="fx-fab" href="${TEL}" aria-label="Call Frespresso">${I.phone}</a>
</footer>`;
}

/* ---------- testimonials ---------- */
function stars(n) {
  return `<div class="fx-stars" role="img" aria-label="${n} out of 5 stars">` +
    [1, 2, 3, 4, 5].map((k) => `<svg viewBox="0 0 24 24" aria-hidden="true" style="opacity:${k <= n ? 1 : 0.3}">${I.star}</svg>`).join('') + '</div>';
}
function testimonialCard(t) {
  const todo = !t.text || !t.text.trim();
  const name = (t.name || '').trim() || testimonials.default_name;
  const avatar = (t.name || '').trim() ? esc(name.charAt(0).toUpperCase()) : I.user;
  const meta = [testimonials.source_label, t.date].filter(Boolean).join(' · ');
  const body = todo
    ? `<p class="fx-tcard__todo">Placeholder: paste the text of a Google review here (data/testimonials.json).</p>`
    : `<blockquote class="fx-tcard__quote"><p>${esc(t.text.trim())}</p></blockquote>`;
  return `<figure class="fx-card fx-tcard${todo ? ' fx-tcard--todo' : ''}" data-motion="reveal-up">
  <div class="fx-tcard__top"><span class="fx-tcard__mark">${I.quote}</span>${Number(t.rating) ? stars(Number(t.rating)) : ''}</div>
  ${body}
  <figcaption class="fx-tcard__who"><span class="fx-tcard__avatar" aria-hidden="true">${avatar}</span><span><span class="fx-tcard__name">${esc(name)}</span><span class="fx-tcard__meta">${esc(meta)}</span></span></figcaption>
</figure>`;
}
function testimonialsSection(bg, id) {
  const g = site.ratings.find((x) => x.platform === 'Google');
  return `<section class="fx-section ${bg}" aria-labelledby="${id}" data-motion="reveal">
  <div class="fx-wrap">
    <div class="fx-section-head fx-section-head--split">
      <div style="display:flex;flex-direction:column;gap:14px;max-width:620px"><p class="fx-eyebrow">Testimonials</p><h2 id="${id}" class="fx-h2">Kind words from <em>our guests</em></h2><p class="fx-body">Rated ${g.score.toFixed(1)} out of 5 on Google from ${g.count}.</p></div>
      <div style="display:flex;align-items:center;gap:20px"><a class="fx-link" href="${REVIEW}">Read on Google ${I.arrow}</a><div class="fx-carousel__nav"><button class="fx-iconbtn" type="button" aria-label="Previous testimonials">${I.prev}</button><button class="fx-iconbtn" type="button" aria-label="Next testimonials">${I.next}</button></div></div>
    </div>
    <div class="fx-carousel fx-carousel--testi" role="region" aria-label="Guest testimonials, scroll sideways" tabindex="0">
${testimonials.items.map(testimonialCard).join('\n')}
    </div>
    <div class="fx-dots" aria-hidden="true"></div>
  </div>
</section>`;
}

/* ---------- gallery ---------- */
function galleryFile(name) { return name ? ['assets/gallery/', 'assets/images/'].map((d) => d + name).find(exists) || '' : ''; }
function tile(g, asLink) {
  const src = galleryFile(g.file), poster = galleryFile(g.poster), video = g.type === 'video';
  let inner;
  if (video) {
    inner = poster ? `<img class="fx-img" src="${poster}" alt="" loading="lazy" decoding="async">`
      : src ? `<video class="fx-img" src="${src}#t=0.1" muted playsinline preload="metadata" tabindex="-1"></video>`
        : ph(g.label, 'ph--dark ph--video', '');
    inner += `<span class="fx-tile__play" aria-hidden="true">${I.play}</span>`;
  } else {
    inner = src ? `<img class="fx-img" src="${src}" alt="${esc(g.label)}" loading="lazy" decoding="async">` : ph(g.label, g.ph || '');
  }
  const cap = `<span class="fx-tile__cap">${esc(g.label)} ${I.expand}</span>`;
  const size = g.size ? ' is-' + g.size : '';
  if (asLink) return `<a class="fx-tile${size}" href="gallery.html" aria-label="Open gallery: ${esc(g.label)}" data-motion="reveal-up">${inner}${cap}</a>`;
  return `<button class="fx-tile${size}" type="button" aria-label="Open ${video ? 'video' : 'photo'}: ${esc(g.label)}" data-cat="${video ? 'videos' : g.cat}" data-type="${g.type}" data-label="${esc(g.label)}" data-src="${src}" data-poster="${poster}" data-motion="reveal-up">${inner}${cap}</button>`;
}
function galleryPreview() {
  const pick = gallery.home_preview.map((i) => gallery.items[i]).filter(Boolean);
  return `<section class="fx-section" aria-labelledby="gal-title" data-motion="reveal">
  <div class="fx-wrap">
    <div class="fx-section-head fx-section-head--split">
      <div style="display:flex;flex-direction:column;gap:14px;max-width:620px"><p class="fx-eyebrow">Gallery</p><h2 id="gal-title" class="fx-h2">Photos and videos <em>from the cafe</em></h2></div>
      <a class="fx-btn fx-btn--secondary" href="gallery.html">View full gallery ${I.arrow}</a>
    </div>
    <div class="fx-gallery fx-gallery--preview">
${pick.map((g) => tile(g, true)).join('\n')}
    </div>
  </div>
</section>`;
}
function galleryPage() {
  const chips = gallery.filters.map((f, i) => `<button class="fx-chip${i ? '' : ' is-active'}" type="button" aria-pressed="${i ? 'false' : 'true'}" data-filter="${f.id}">${esc(f.label)}</button>`).join('');
  return `<section class="fx-pagehero" data-motion="hero-in"><div class="fx-wrap"><div class="fx-pagehero__in">
<nav class="fx-crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span aria-current="page">Gallery</span></nav>
<p class="fx-eyebrow">Gallery</p><h1 class="fx-h1">A peek <em>inside</em></h1><p class="fx-lead">Cozy corners, steaming cups and game nights, in photos and short videos. Tap any tile to view it larger.</p></div></div></section>
<section aria-label="Photo and video gallery" style="padding-bottom:96px">
  <div class="fx-wrap">
    <div class="fx-chips" role="group" aria-label="Filter gallery" style="margin-bottom:32px" data-gallery-filters>${chips}</div>
    <div class="fx-gallery" data-gallery>
${gallery.items.map((g) => tile(g, false)).join('\n')}
    </div>
  </div>
</section>
<section class="fx-section--tight" aria-labelledby="ig2" style="padding-top:0">
  <div class="fx-wrap"><div class="fx-cta-band fx-bg-green">
    <div style="display:flex;flex-direction:column;gap:12px;max-width:560px"><p class="fx-eyebrow">${B.instagram}</p><h2 id="ig2" class="fx-h2">More moments on Instagram</h2></div>
    <a class="fx-btn fx-btn--light" href="${B.instagram_url}">${I.insta}Follow us</a>
  </div></div>
</section>`;
}

/* ---------- photo credits ---------- */
function creditsBlock() {
  if (!credits.length) return '';
  const row = (c) => `<li>${esc(c.used_for)}: “<a href="${esc(c.source)}">${esc(c.title)}</a>” by ${esc(c.author)}, ${c.license_url ? `<a href="${esc(c.license_url)}">${esc(c.license)}</a>` : esc(c.license)}. ${esc(c.changes)}.</li>`;
  return `<details class="fx-credits" id="credits"><summary>Photo credits</summary><p class="fx-small">These dish photos are representative images from Wikimedia Commons, not photographs taken at Frespresso.</p><ul class="fx-small">${credits.map(row).join('')}</ul></details>`;
}

/* ---------- menu ---------- */
const price = (p) => (typeof p === 'number' ? '₹' + p : 'Ask in cafe');
function menuPage(board) {
  const cats = site.menu.filter((c) => c.items.length);
  const total = cats.reduce((n, c) => n + c.items.length, 0);
  const chip = (id, label, n, on) => `<button class="fx-chip${on ? ' is-active' : ''}" type="button" aria-pressed="${on}" data-cat="${id}">${esc(label)} <span class="fx-chip__count">${n}</span></button>`;
  const chips = chip('all', 'All', total, true) + cats.map((c) => chip(c.id, c.label.replace(' and ', ' & '), c.items.length, false)).join('');
  const sections = cats.map((c) => `<section class="fx-menu-cat" aria-label="${esc(c.label)}" data-cat="${c.id}">
      <div class="fx-menu-cat__head"><h2 class="fx-h2" style="font-size:36px">${esc(c.label.replace(' and ', ' & '))}</h2><span class="fx-small" data-count>${c.items.length} ${c.items.length === 1 ? 'item' : 'items'}</span></div>
      <div class="fx-grid-3">
${c.items.map((it) => `        <article class="fx-card fx-mcard fx-mcard--row" data-item data-search="${esc((it.name + ' ' + (it.description || '')).toLowerCase())}">
          <div class="fx-mcard__media">${media(it.name)}</div>
          <div class="fx-mcard__body" style="padding:16px 18px;gap:6px"><h3 class="fx-mcard__name" style="font-size:19px">${esc(it.name)}</h3>${it.description ? `<p class="fx-mcard__desc" style="font-size:14px">${esc(it.description)}</p>` : ''}<div class="fx-mcard__foot" style="padding-top:6px"><span class="fx-price">${price(it.price_inr)}</span></div></div>
        </article>`).join('\n')}
      </div>
    </section>`).join('\n');
  const hero = board.match(/<section class="fx-pagehero"[\s\S]*?<\/section>/)[0];
  const band = board.match(/<section id="swiggy"[\s\S]*?<\/section>/)[0];
  return `${hero}
<div class="fx-sticky-bar" role="region" aria-label="Menu filters">
  <div class="fx-wrap fx-sticky-bar__in">
    <div class="fx-chips" role="group" aria-label="Categories" data-menu-chips>${chips}</div>
    <div class="fx-search">${I.search}<label for="menu-search" class="fx-sr">Search the menu</label><input id="menu-search" class="fx-input" type="search" placeholder="Search coffee, waffles…" autocomplete="off"></div>
  </div>
</div>
<div class="fx-wrap" style="padding-bottom:96px" data-menu>
${sections}
  <div data-menu-empty hidden style="padding:96px 0;display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center" role="status">
    <div class="fx-rcard__icon">${I.search}</div>
    <h2 class="fx-h3">Nothing matches “<span data-menu-q></span>”</h2>
    <p class="fx-body">Try another word, or browse all categories.</p>
    <button class="fx-btn fx-btn--secondary fx-btn--sm" type="button" data-menu-reset>Show full menu</button>
  </div>
  <p class="fx-small" style="margin-top:40px">Prices in INR. Menu and prices may change.${credits.length ? ' Some dish photos are representative.' : ''}</p>
${creditsBlock()}
</div>
${band}`;
}

/* ---------- contact form (replaces the template block in the board) ---------- */
function contactForm() {
  const field = (id, label, control) => `<div class="fx-field" data-field="${id}"><label class="fx-label" for="${id}">${label}</label>${control}<p class="fx-help" id="${id}-help" hidden>${I.alert}<span></span></p></div>`;
  return `<form style="display:flex;flex-direction:column;gap:20px" novalidate aria-label="Enquiry form" data-enquiry>
          ${field('name', 'Name', '<input id="name" name="name" class="fx-input" type="text" placeholder="Your name" autocomplete="name" aria-describedby="name-help" maxlength="80">')}
          ${field('phone', 'Phone', '<input id="phone" name="phone" class="fx-input" type="tel" placeholder="10-digit mobile number" autocomplete="tel" inputmode="tel" aria-describedby="phone-help" maxlength="16">')}
          ${field('message', 'Message', '<textarea id="message" name="message" class="fx-input" placeholder="How can we help?" aria-describedby="message-help" maxlength="1000"></textarea>')}
          <button class="fx-btn fx-btn--primary fx-btn--block" type="submit">${I.send}Send enquiry</button>
          <p class="fx-small" style="text-align:center">We only use your number to reply to this enquiry.</p>
        </form>
        <div role="status" data-enquiry-done hidden style="padding:28px 8px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px">
          <div style="width:112px;height:112px;border-radius:50%;background:#FAF3E7;display:flex;align-items:center;justify-content:center">${logo('icon', 'color', 72)}</div>
          <h3 class="fx-h3" tabindex="-1">Thanks, we’ve got your message!</h3>
          <p class="fx-body" style="max-width:340px">We’ll call you back soon. Need us right now? Give us a ring.</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center"><a class="fx-btn fx-btn--primary fx-btn--sm" href="${TEL}">${I.phone}Call us</a><button class="fx-btn fx-btn--secondary fx-btn--sm" type="button" data-enquiry-again>Send another</button></div>
        </div>`;
}

/* ---------- board helpers ---------- */
const board = (name) => read(`design/boards/${name}.dc.html`);
const mainOf = (html) => html.match(/<main id="main">([\s\S]*?)<\/main>/)[1];
const mapEmbed = `<iframe class="fx-map" title="Map showing Frespresso Cafe &amp; Resto, Solapur" src="https://www.google.com/maps?q=${encodeURIComponent(B.name + ', ' + 'Station Rd, Railway Lines, Solapur')}&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;

function common(html) {
  html = html
    .replace(/href="Home\.dc\.html"/g, 'href="index.html"')
    .replace(/href="Menu\.dc\.html#swiggy"/g, `href="${SWIGGY}"`)
    .replace(/href="([A-Za-z]+)\.dc\.html"/g, (m, n) => `href="${n.toLowerCase()}.html"`)
    .replace(/href="#swiggy"/g, `href="${SWIGGY}"`)
    .replace(/<span class="fx-editable">\{\{hours\}\}<\/span>/g, esc(B.hours))
    .replace(/<div class="ph[^"]*" role="img" aria-label="Placeholder: Map[^"]*">[\s\S]*?<\/div>/g, mapEmbed);
  return swapPlaceholders(html);
}
const external = (html) => html.replace(/<a ([^>]*?)href="(https?:\/\/[^"]+)"/g, '<a $1href="$2" target="_blank" rel="noopener noreferrer"');

/* ---------- pages ---------- */
const pages = {
  home: () => {
    let m = common(mainOf(board('Home')));
    const cut = m.indexOf('id="directions"');
    m = m.slice(0, cut) + m.slice(cut).replace('class="fx-btn fx-btn--primary" href="#directions"', `class="fx-btn fx-btn--primary" href="${MAPS}"`);
    const at = m.indexOf('<section class="fx-section fx-bg-green" aria-labelledby="ig-title"');
    return m.slice(0, at) + testimonialsSection('fx-bg-cream2', 'testi-title') + '\n\n' + galleryPreview() + '\n\n' + m.slice(at);
  },
  about: () => common(mainOf(board('About'))),
  menu: () => common(menuPage(mainOf(board('Menu')))),
  experience: () => common(mainOf(board('Experience'))),
  gallery: () => galleryPage(),
  reviews: () => {
    let m = common(mainOf(board('Reviews')));
    const link = (text, url) => { m = m.replace(new RegExp('href="#"([^>]*>(?:<svg[\\s\\S]*?<\\/svg>)?)' + text), `href="${url}"$1${text}`); };
    link('Read on Google', REVIEW); link('See on Swiggy', SWIGGY); link('Write a review', REVIEW); link('Rate on Swiggy', SWIGGY);
    m = m.replace(/<a class="fx-link" href="#"[^>]*>See on Justdial[\s\S]*?<\/a>/, '');
    m = m.replace(/Ratings as of <span class="fx-editable">\[update date\]<\/span>\. Refresh periodically\./, `Ratings as of ${esc(site.ratings_as_of)}.`);
    const at = m.indexOf('<section class="fx-section fx-bg-cream2" aria-labelledby="themes-title"');
    return m.slice(0, at) + testimonialsSection('fx-bg-white', 'testi-title') + '\n' + m.slice(at);
  },
  contact: () => {
    let m = common(mainOf(board('Contact')));
    m = m.replace(/<sc-if value="\{\{showForm\}\}"[\s\S]*<\/sc-if>(?=\s*<\/div>\s*<\/div>\s*<\/section>)/, contactForm());
    return m.replace('class="fx-btn fx-btn--primary" href="#"', `class="fx-btn fx-btn--primary" href="${MAPS}"`);
  }
};

const META = {
  home: ['index.html', 'Frespresso Cafe & Resto | Entertainment cafe in Solapur', 'Italian coffees, pizzas, waffles and shakes with board games, a guitar corner and books. Frespresso Cafe & Resto, Station Road, Solapur, since 2017.'],
  about: ['about.html', 'About | Frespresso Cafe & Resto, Solapur', 'The story of Frespresso, the entertainment cafe on Station Road, Solapur, serving coffee and good times since 2017.'],
  menu: ['menu.html', 'Menu | Frespresso Cafe & Resto, Solapur', 'Coffee, shakes, bites, sandwiches, pizza, pasta, waffles and sundaes. Browse the Frespresso menu with prices.'],
  experience: ['experience.html', 'Experience | Frespresso Cafe & Resto, Solapur', 'Board games, a guitar corner, books and small celebrations. More than a cafe in Solapur.'],
  gallery: ['gallery.html', 'Gallery | Frespresso Cafe & Resto, Solapur', 'Photos and short videos of the Frespresso interior, coffee, food, desserts and game nights.'],
  reviews: ['reviews.html', 'Reviews | Frespresso Cafe & Resto, Solapur', 'Guest testimonials and ratings for Frespresso Cafe & Resto on Google, Swiggy and Justdial.'],
  contact: ['contact.html', 'Contact | Frespresso Cafe & Resto, Solapur', 'Address, phone, map and enquiry form for Frespresso Cafe & Resto, Station Road, Solapur.']
};

const ld = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'CafeOrCoffeeShop', name: B.name, telephone: B.phone_tel, priceRange: '₹₹',
  servesCuisine: ['Cafe', 'Italian', 'Fast food'], foundingDate: String(B.since), sameAs: [B.instagram_url],
  address: { '@type': 'PostalAddress', streetAddress: "Ground Floor, Orchid Complex, 70, Station Rd, opp. Mayor's Bungalow, Railway Lines", addressLocality: 'Solapur', addressRegion: 'Maharashtra', postalCode: '413001', addressCountry: 'IN' }
});

function page(id) {
  const [file, title, desc] = META[id];
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta name="theme-color" content="#2B1B14">
<link rel="icon" href="assets/logo/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&amp;family=Inter:wght@400;500;600;700&amp;display=swap">
<link rel="stylesheet" href="css/frespresso.css">
<link rel="stylesheet" href="css/site.css">
<script>document.documentElement.className='js'</script>
${id === 'home' ? `<script type="application/ld+json">${ld}</script>\n` : ''}<script src="js/main.js" defer></script>
</head>
<body data-page="${id}">
<a class="fx-skip" href="#main">Skip to content</a>
<div class="fx-page">
${header(id)}
<main id="main">
${pages[id]()}
</main>
${footer()}
</div>
</body>
</html>
`;
  write(file, external(html));
}

/* ---------- run ---------- */
const css = read('design/assets/frespresso.css')
  .replace('container:page / inline-size;', '')
  .replace(/@container page \(max-width:/g, '@media (max-width:')
  .replace(/\/\* Annotations[\s\S]*?(?=\/\* -+ Tablet)/, '');
write('css/frespresso.css', '/* Generated from design/assets/frespresso.css by tools/build.js. Do not edit; edit css/site.css instead. */\n' + css);
fs.mkdirSync(path.join(ROOT, 'assets/logo'), { recursive: true });
for (const f of fs.readdirSync(path.join(ROOT, 'design/assets/logo'))) fs.copyFileSync(path.join(ROOT, 'design/assets/logo', f), path.join(ROOT, 'assets/logo', f));
Object.keys(META).forEach(page);
write('assets/images/EXPECTED-FILES.txt', 'Drop a photo here with one of these names (.jpg, .jpeg, .png or .webp) and run "node tools/build.js".\nThe matching placeholder on the site is replaced automatically.\n\n' + [...wanted].sort().join('\n') + '\n');
console.log('Built ' + Object.keys(META).length + ' pages.');
