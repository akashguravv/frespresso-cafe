/* Frespresso site interactions. Vanilla JS (ES2020), no dependencies. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,video[controls],[tabindex]:not([tabindex="-1"])';

  function trapFocus(box, e) {
    if (e.key !== 'Tab') return;
    const items = $$(FOCUSABLE, box).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---- Loading screen: first visit of the session only ---- */
  function loader() {
    let seen = true;
    try { seen = sessionStorage.getItem('fx-seen') === '1'; sessionStorage.setItem('fx-seen', '1'); } catch (e) { /* storage blocked */ }
    if (seen || reduced) return;
    const mark = $('.fx-logo-i svg');
    const el = document.createElement('div');
    el.className = 'fx-loader';
    el.setAttribute('aria-hidden', 'true');
    if (mark) { const m = mark.cloneNode(true); m.setAttribute('width', '72'); m.setAttribute('height', '72'); el.appendChild(m); }
    const bar = document.createElement('div');
    bar.className = 'fx-loader__bar';
    bar.appendChild(document.createElement('span'));
    el.appendChild(bar);
    document.body.appendChild(el);
    const done = () => { el.classList.add('is-done'); setTimeout(() => el.remove(), 450); };
    window.addEventListener('load', () => setTimeout(done, 300), { once: true });
    setTimeout(done, 1200);
  }

  /* ---- Header shrink ---- */
  function header() {
    const h = $('#site-header');
    if (!h) return;
    const on = () => h.classList.toggle('is-scrolled', window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
  }

  /* ---- Mobile drawer ---- */
  function drawer() {
    const d = $('#site-drawer'), scrim = $('.fx-scrim'), btn = $('[data-drawer-open]');
    if (!d || !btn) return;
    const root = document.documentElement;
    const close = () => {
      root.classList.remove('is-drawer-open', 'is-locked');
      btn.setAttribute('aria-expanded', 'false');
      setTimeout(() => { d.hidden = true; scrim.hidden = true; }, reduced ? 0 : 320);
      btn.focus();
    };
    const open = () => {
      d.hidden = false; scrim.hidden = false;
      void d.offsetWidth;
      root.classList.add('is-drawer-open', 'is-locked');
      btn.setAttribute('aria-expanded', 'true');
      $('button', d).focus();
    };
    btn.addEventListener('click', open);
    $$('[data-drawer-close]').forEach((b) => b.addEventListener('click', close));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); else trapFocus(d, e); });
    window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => { if (e.matches && !d.hidden) close(); });
  }

  /* ---- Scroll reveal and count-up ---- */
  function countUp(el) {
    const node = el.firstChild;
    if (!node || node.nodeType !== 3) return;
    const text = node.nodeValue.trim();
    const target = parseFloat(text.replace(/,/g, ''));
    if (Number.isNaN(target) || reduced) return;
    const decimals = (text.split('.')[1] || '').length;
    const from = target > 1900 && target < 2100 && !decimals ? 2000 : 0;
    const fmt = (v) => (decimals ? v.toFixed(decimals) : (text.includes(',') ? Math.round(v).toLocaleString('en-IN') : String(Math.round(v))));
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 1200);
      node.nodeValue = fmt(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step); else node.nodeValue = text;
    };
    requestAnimationFrame(step);
  }
  function reveal() {
    const items = $$('[data-motion="reveal"],[data-motion="reveal-up"]');
    const counts = $$('[data-motion="count"]');
    if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-in')); return; }
    const show = (el, delay) => {
      el.style.transitionDelay = delay + 'ms';
      el.classList.add('is-in');
      setTimeout(() => { el.style.transitionDelay = ''; el.classList.remove('is-in'); el.removeAttribute('data-motion'); }, delay + 750);
    };
    const io = new IntersectionObserver((entries) => {
      const batch = entries.filter((e) => e.isIntersecting);
      let k = 0;
      batch.forEach((e) => {
        io.unobserve(e.target);
        const card = e.target.getAttribute('data-motion') === 'reveal-up';
        show(e.target, card && !reduced ? Math.min(k++, 5) * 80 : 0);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
    const co = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { co.unobserve(e.target); countUp(e.target); } }), { threshold: 0.6 });
    counts.forEach((el) => co.observe(el));
  }

  /* ---- Carousels (signature items, testimonials) ---- */
  function carousels() {
    $$('.fx-carousel').forEach((track) => {
      const scope = track.closest('section') || document;
      const [prev, next] = $$('.fx-carousel__nav button', scope);
      const dotsBox = $('.fx-dots', scope);
      const pageCount = () => Math.max(1, Math.round(track.scrollWidth / track.clientWidth));
      const current = () => Math.min(pageCount() - 1, Math.round(track.scrollLeft / track.clientWidth));
      const paint = () => {
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        if (prev) prev.disabled = track.scrollLeft < 4;
        if (next) next.disabled = atEnd;
        if (!dotsBox) return;
        const n = pageCount();
        if (dotsBox.children.length !== n) dotsBox.replaceChildren(...Array.from({ length: n }, () => document.createElement('span')));
        const active = atEnd ? n - 1 : current();
        Array.from(dotsBox.children).forEach((d, i) => d.classList.toggle('is-active', i === active));
      };
      const move = (dir) => track.scrollBy({ left: dir * track.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
      if (prev) prev.addEventListener('click', () => move(-1));
      if (next) next.addEventListener('click', () => move(1));
      track.addEventListener('scroll', () => requestAnimationFrame(paint), { passive: true });
      window.addEventListener('resize', paint);
      paint();
    });
  }

  /* ---- Menu: category chips and search ---- */
  function menu() {
    const root = $('[data-menu]');
    if (!root) return;
    const chips = $$('[data-menu-chips] .fx-chip'), input = $('#menu-search');
    const empty = $('[data-menu-empty]', root), qOut = $('[data-menu-q]', root);
    let cat = 'all';
    const apply = () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;
      $$('.fx-menu-cat', root).forEach((sec) => {
        const inCat = cat === 'all' || sec.dataset.cat === cat;
        let n = 0;
        $$('[data-item]', sec).forEach((it) => { const ok = inCat && (!q || it.dataset.search.includes(q)); it.hidden = !ok; if (ok) n++; });
        sec.hidden = n === 0;
        $('[data-count]', sec).textContent = n + (n === 1 ? ' item' : ' items');
        shown += n;
      });
      empty.hidden = shown > 0;
      qOut.textContent = input.value.trim();
      chips.forEach((c) => { const on = c.dataset.cat === cat; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
    };
    chips.forEach((c) => c.addEventListener('click', () => { cat = c.dataset.cat; apply(); }));
    input.addEventListener('input', apply);
    $('[data-menu-reset]', root).addEventListener('click', () => { cat = 'all'; input.value = ''; apply(); input.focus(); });
  }

  /* ---- Gallery: filter and lightbox (photos and videos) ---- */
  function gallery() {
    const grid = $('[data-gallery]');
    if (!grid) return;
    const tiles = $$('.fx-tile', grid), chips = $$('[data-gallery-filters] .fx-chip');
    let list = tiles, index = -1, box = null, opener = null, touchX = null;

    chips.forEach((c) => c.addEventListener('click', () => {
      const f = c.dataset.filter;
      chips.forEach((x) => { const on = x === c; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
      tiles.forEach((t) => { t.hidden = !(f === 'all' || t.dataset.cat === f); });
      grid.classList.toggle('is-filtered', f !== 'all');
      list = tiles.filter((t) => !t.hidden);
    }));

    const el = (tag, cls, attrs = {}) => { const n = document.createElement(tag); if (cls) n.className = cls; Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); return n; };
    const iconBtn = (cls, label, from) => { const b = el('button', 'fx-iconbtn fx-iconbtn--dark ' + cls, { type: 'button', 'aria-label': label }); b.appendChild(from.cloneNode(true)); return b; };

    const render = () => {
      const t = list[index], stage = $('.fx-lightbox__img', box);
      const { type, src, poster, label } = t.dataset;
      let node;
      if (type === 'video' && src) {
        node = el('video', '', { src, controls: '', playsinline: '', preload: 'metadata' });
        if (poster) node.setAttribute('poster', poster);
      } else if (src) {
        node = el('img', '', { src, alt: label });
      } else {
        node = $('.ph', t).cloneNode(true);
        node.className = 'ph ph--dark';
        if (type === 'video') node.querySelector('span').textContent = label + ' (file to be added)';
      }
      stage.replaceChildren(node);
      $('.fx-lightbox__cap', box).replaceChildren(Object.assign(el('span'), { textContent: label }), Object.assign(el('span', '', { style: 'opacity:.7' }), { textContent: (index + 1) + ' / ' + list.length }));
    };
    const go = (d) => { index = (index + d + list.length) % list.length; render(); };
    const close = () => {
      if (!box) return;
      box.remove(); box = null;
      document.documentElement.classList.remove('is-locked');
      if (opener) opener.focus();
    };
    const open = (t) => {
      opener = t; index = list.indexOf(t);
      const svg = (name) => $(name + ' svg') || $('svg');
      box = el('div', 'fx-lightbox', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Photo and video viewer' });
      const bClose = iconBtn('fx-lightbox__close', 'Close', $('[data-drawer-close] svg') || svg('button'));
      const bPrev = iconBtn('fx-lightbox__prev', 'Previous', svg('.fx-carousel__nav'));
      const bNext = iconBtn('fx-lightbox__next', 'Next', svg('.fx-carousel__nav'));
      bPrev.firstChild.innerHTML = '<path d="M15 6l-6 6 6 6"></path>';
      bNext.firstChild.innerHTML = '<path d="M9 6l6 6-6 6"></path>';
      bClose.firstChild.innerHTML = '<path d="M6 6l12 12M18 6L6 18"></path>';
      box.append(bClose, bPrev, el('div', 'fx-lightbox__img'), bNext, el('div', 'fx-lightbox__cap', { 'aria-live': 'polite' }));
      bClose.addEventListener('click', close);
      bPrev.addEventListener('click', () => go(-1));
      bNext.addEventListener('click', () => go(1));
      box.addEventListener('click', (e) => { if (e.target === box) close(); });
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
        else trapFocus(box, e);
      });
      box.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
      box.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX; touchX = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }, { passive: true });
      document.body.appendChild(box);
      document.documentElement.classList.add('is-locked');
      render();
      bClose.focus();
    };
    tiles.forEach((t) => t.addEventListener('click', () => open(t)));
  }

  /* ---- Contact enquiry form ---- */
  function enquiry() {
    const form = $('[data-enquiry]');
    if (!form) return;
    const done = $('[data-enquiry-done]');
    const rules = {
      name: (v) => (v.trim() ? '' : 'Please tell us your name'),
      phone: (v) => (v.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '').length === 10 ? '' : 'Enter a 10-digit mobile number'),
      message: (v) => (v.trim() ? '' : 'Please add a short message')
    };
    let tried = false;
    const check = () => {
      let firstBad = null;
      Object.keys(rules).forEach((k) => {
        const field = $('[data-field="' + k + '"]', form), input = $('#' + k, form), help = $('.fx-help', field);
        const msg = rules[k](input.value);
        field.classList.toggle('is-error', tried && !!msg);
        field.classList.toggle('is-success', tried && !msg);
        input.setAttribute('aria-invalid', String(tried && !!msg));
        help.hidden = !(tried && msg);
        $('span', help).textContent = msg;
        if (msg && !firstBad) firstBad = input;
      });
      return firstBad;
    };
    form.addEventListener('input', () => { if (tried) check(); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      tried = true;
      const bad = check();
      if (bad) { bad.focus(); return; }
      /* INTEGRATION HOOK: send new FormData(form) to the cafe's enquiry endpoint here.
         Nothing is transmitted until an endpoint is connected. */
      form.hidden = true; done.hidden = false;
      $('h3', done).focus();
    });
    $('[data-enquiry-again]', done).addEventListener('click', () => {
      form.reset(); tried = false; check();
      done.hidden = true; form.hidden = false;
      $('#name', form).focus();
    });
  }

  loader(); header(); drawer(); reveal(); carousels(); menu(); gallery(); enquiry();
})();
