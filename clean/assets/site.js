/* Shared behaviour for every page. Public settings live in config.js. */
(function(){
"use strict";
const config = window.KATZ_CONFIG || {};
const LEAD_ENDPOINT = config.leadEndpoint || "";
const WA_NUMBER = config.whatsappNumber || "972584219429";
const PHONE_E164 = config.phoneE164 || "97299552072";
const PHONE_DISPLAY = config.phoneDisplay || "09-955-2072";
const PAGE_SERVICE = document.body.dataset.service || "";          // magar | digum | tzaneret | mazach | ""
const PAGE_SERVICE_NAME = document.body.dataset.serviceName || ""; // Hebrew label for messages
const qs = new URLSearchParams(location.search);

/* ===== Google Tag Manager (loaded only when an id is configured) ===== */
window.dataLayer = window.dataLayer || [];
if (config.gtmId) {
  window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
  const s = document.createElement('script'); s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(config.gtmId);
  document.head.appendChild(s);
}
function track(ev, data){
  try{
    const payload = Object.assign({event: ev, service: PAGE_SERVICE || 'home', page_path: location.pathname}, data || {});
    window.dataLayer.push(payload);
    if (window.gtag) window.gtag('event', ev, payload);
    if (window.fbq) { if (ev === 'form_submit' || ev === 'lead_whatsapp_open') window.fbq('track', 'Lead'); else window.fbq('trackCustom', ev); }
  }catch(e){}
}

/* ===== Contact details from config (static HTML keeps a working fallback) ===== */
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
  try { const url = new URL(a.href); url.pathname = '/' + WA_NUMBER; a.href = url.href; } catch(e){}
});
document.querySelectorAll('a[href^="tel:"]').forEach(a => { a.href = 'tel:+' + PHONE_E164; });
document.querySelectorAll('[data-phone]').forEach(el => { el.textContent = PHONE_DISPLAY; });
document.querySelectorAll('[data-email]').forEach(el => { if (config.email) { el.textContent = config.email; if (el.tagName === 'A') el.href = 'mailto:' + config.email; } });

/* ===== Prices: policy Oct 2026 = no prices on the site; blocks show the "on request" text ===== */
document.querySelectorAll("[data-price-without]").forEach(el => { el.hidden = false; });

/* ===== Scroll reveal ===== */
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const targets = document.querySelectorAll(".svc,.segment,.trigger,.step-big,.step,.test,.why,.related a,.deliver-list li,.sec-head,.quote-card,.facts,.chooser,.reg-table,.case-card,.cert,.about-card,.trust .item,.faq details");
  const io = new IntersectionObserver(entries => { entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, {rootMargin: "0px 0px -8% 0px", threshold: 0.08});
  targets.forEach(el => { el.classList.add("rv"); io.observe(el); });
}

/* ===== Mobile menu ===== */
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded','false'); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded','false'); burger.focus(); } });
}

/* ===== Segment-aware hero (?seg=vaad|nihul|mosad|hotel|tofes4|prati) ===== */
const SEG_CTYPE = { vaad: "ועד בית", nihul: "חברת ניהול", mosad: "מוסד", hotel: "מוסד", tofes4: "קבלן טופס 4", prati: "בית פרטי" };
let seg = qs.get('seg') || '';
const segData = window.KATZ_SEGS && window.KATZ_SEGS[seg];
if (segData) {
  const eye = document.getElementById('heroEyebrow'), h = document.getElementById('heroTitle'), sub = document.getElementById('heroSub');
  if (eye && segData.eye) eye.textContent = segData.eye;
  if (h && segData.h) h.textContent = segData.h;
  if (sub && segData.s) sub.textContent = segData.s;
}
if (SEG_CTYPE[seg]) document.querySelectorAll('select[name=ctype]').forEach(sel => { sel.value = SEG_CTYPE[seg]; });

/* ===== Click tracking ===== */
document.querySelectorAll('[data-track]').forEach(a => a.addEventListener('click', () => track(a.dataset.track, {seg: seg || 'none', label: a.dataset.label || ''})));

/* ===== "Who are you" chooser (home page) ===== */
const chooser = document.querySelector('[data-chooser]');
if (chooser) {
  const panels = chooser.querySelectorAll('[data-chooser-panel]');
  const tabs = chooser.querySelectorAll('[data-chooser-tab]');
  function pick(key){
    tabs.forEach(t => { const on = t.dataset.chooserTab === key; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
    panels.forEach(p => { p.hidden = p.dataset.chooserPanel !== key; });
    track('chooser_pick', {label: key});
  }
  tabs.forEach(t => {
    t.addEventListener('click', () => pick(t.dataset.chooserTab));
    t.addEventListener('keydown', e => {
      const list = Array.from(tabs); const i = list.indexOf(t);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); const dir = e.key === 'ArrowRight' ? -1 : 1; const n = list[(i + dir + list.length) % list.length]; n.focus(); pick(n.dataset.chooserTab); }
    });
  });
  const initial = { vaad:'vaad', nihul:'nihul', mosad:'mosad', hotel:'mosad', tofes4:'tofes4', prati:'prati' }[seg] || (tabs[0] && tabs[0].dataset.chooserTab);
  if (initial) { tabs.forEach(t => { const on = t.dataset.chooserTab === initial; t.setAttribute('aria-selected', on ? 'true':'false'); t.tabIndex = on ? 0 : -1; }); panels.forEach(p => { p.hidden = p.dataset.chooserPanel !== initial; }); }
}

/* ===== Lead forms ===== */
function validIL(p){ p = (p || '').replace(/[^\d+]/g, ''); return /^(\+972|0)(5\d|[2-4]|[89]|7\d)\d{7}$/.test(p) || /^0\d{8,9}$/.test(p); }
if (LEAD_ENDPOINT) {
  document.querySelectorAll('form[data-lead] button[type="submit"]').forEach(b => b.textContent = 'שליחת בקשה להצעת מחיר');
  document.querySelectorAll('form[data-lead] .fine').forEach(p => p.textContent = 'הפרטים ישמשו לחזרה אליכם בנוגע לפנייה בלבד.');
}
async function handleForm(form){
  const card = form.closest('.card') || form.parentElement;
  const data = Object.fromEntries(new FormData(form).entries());
  if (data.website) return; // honeypot
  const nameEl = form.querySelector('[name=name]'), phoneEl = form.querySelector('[name=phone]');
  const status = form.querySelector('.form-status');
  if (status) status.textContent = '';
  [nameEl, phoneEl].forEach(el => { if (el) { el.classList.remove('err'); el.removeAttribute('aria-invalid'); } });
  if (!data.name || data.name.trim().length < 2) { nameEl.classList.add('err'); nameEl.setAttribute('aria-invalid','true'); if (status) status.textContent = 'נא להזין שם מלא.'; nameEl.focus(); return; }
  if (!validIL(data.phone)) { phoneEl.classList.add('err'); phoneEl.setAttribute('aria-invalid','true'); if (status) status.textContent = 'נא להזין מספר טלפון ישראלי תקין.'; phoneEl.focus(); return; }
  data.service = data.service || PAGE_SERVICE || 'general';
  data.seg = seg; data.page = location.origin + location.pathname; data.ts = new Date().toISOString();
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'].forEach(k => data[k] = qs.get(k) || '');
  const btn = form.querySelector('button[type=submit]'); const original = btn.textContent; btn.disabled = true; btn.textContent = 'שולח...';
  let ok = false;
  if (LEAD_ENDPOINT) {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const r = await fetch(LEAD_ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data), signal: controller.signal});
      const receipt = await r.json(); ok = r.ok && receipt.accepted === true;
    } catch(e) { ok = false; } finally { clearTimeout(timer); }
    if (!ok) {
      if (status) { status.textContent = 'לא הצלחנו לשלוח את הבקשה. נסו שוב או פנו אלינו בוואטסאפ. '; const fb = document.createElement('a'); fb.href = 'https://wa.me/' + WA_NUMBER; fb.textContent = 'פתיחת וואטסאפ'; fb.target = '_blank'; fb.rel = 'noopener'; status.append(fb); }
      btn.disabled = false; btn.textContent = 'ניסיון נוסף'; return;
    }
    track('form_submit', {seg: seg || 'none', ctype: data.ctype || '', via: 'endpoint'});
    if (card) card.classList.add('sent');
    return;
  }
  const svc = data.service_label || PAGE_SERVICE_NAME || 'שירותי איכות מים';
  const msg = `שלום, אני ${data.name}${data.ctype ? ' (' + data.ctype + ')' : ''}${data.city ? ', ' + data.city : ''}. מעוניין/ת בהצעת מחיר ל${svc}.${data.details ? ' פרטים: ' + data.details + '.' : ''} טלפון: ${data.phone}`;
  track('lead_whatsapp_open', {seg: seg || 'none', ctype: data.ctype || ''});
  btn.disabled = false; btn.textContent = original;
  window.location.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}
document.querySelectorAll('form[data-lead]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); handleForm(f); }));

/* Smooth scroll to the lead form and focus the first field */
document.querySelectorAll('a[href="#lead"]').forEach(a => a.addEventListener('click', e => {
  const target = document.getElementById('lead'); if (!target) return;
  e.preventDefault();
  target.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  const first = target.querySelector('input[name=name]'); if (first) setTimeout(() => first.focus({preventScroll: true}), 600);
}));

/* Mark the current page in the menu */
document.querySelectorAll('#menu a').forEach(a => {
  try { const u = new URL(a.href, location.href); if (u.pathname.replace(/index\.html$/, '') === location.pathname.replace(/index\.html$/, '')) a.setAttribute('aria-current', 'page'); } catch(e){}
});
})();
