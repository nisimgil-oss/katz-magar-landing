/* Public settings live in config.js. */
const config = window.KATZ_CONFIG || {};
const LEAD_ENDPOINT = config.leadEndpoint || "";
const WA_NUMBER = config.whatsappNumber || "972505219429";
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>{
  const url=new URL(a.href); url.pathname='/'+WA_NUMBER; a.href=url.href;
});
window.dataLayer = window.dataLayer || [];
function track(ev, data){ try{ window.dataLayer.push(Object.assign({event:ev}, data||{})); if(window.gtag) window.gtag('event', ev, data||{}); if(window.fbq){ if(ev==='form_submit') window.fbq('track','Lead'); else window.fbq('trackCustom', ev); } }catch(e){} }

/* ===== Segment-aware headline (?seg=vaad|nihul|mosad|hotel|tofes4) ===== */
const SEGS = {
  vaad:  {eye:"לוועדי בתים · מוסמכי משרד הבריאות", h:"מתי בפעם האחרונה בדקו את מאגר המים שלכם?", s:"ניקוי וחיטוי מקצועי, איתור ליקויים ותיעוד מסודר. דיגום ומעבדה בהתאם לשירות שתבחרו.", ctype:"ועד בית"},
  nihul: {eye:"לחברות ניהול ואחזקה · ספק אחד לכל הבניינים", h:"כל מאגרי הבניינים שלכם, לוח שנתי אחד, תיקייה אחת של תעודות.", s:"ניקוי וחיטוי שנתי לכל הפורטפוליו, דיגום מעבדה, דוחות במייל ומחיר מדורג לפי כמות. אתם מנהלים, אנחנו מזכירים ומבצעים.", ctype:"חברת ניהול"},
  mosad: {eye:"למלונות, בתי אבות ומוסדות · טיפול במערכות מים", h:"מטפלים במים. שומרים על תיעוד מסודר.", s:"ניקוי וחיטוי מאגרים, דיגום ומעבדה בהתאם לשירות. מתאמים את העבודה לצורכי המוסד שלכם.", ctype:"מוסד"},
  hotel: {eye:"למלונות · טיפול במערכות מים", h:"מתי בדקו את מאגר המים של המלון?", s:"ניקוי וחיטוי, איתור ליקויים ותיעוד מסודר. דיגום ומעבדה בהתאם לשירות ובתיאום מראש.", ctype:"מוסד"},
  tofes4:{eye:"לקבלנים ויזמים · טופס 4", h:"חיטוי מאגר וצנרת לאכלוס, בלי לעכב את המסירה.", s:"חיטוי קווי מים ומאגר, דיגום מהיר במעבדה מוסמכת ותיאום ישיר מול תאגיד המים. תעודה ודוח מעבדה תוך ימים ספורים.", ctype:"קבלן טופס 4"}
};
const qs = new URLSearchParams(location.search);
let seg = qs.get('seg');
function applySeg(k){ const s=SEGS[k]; if(!s) return; seg=k;
  document.getElementById('heroEyebrow').textContent=s.eye; document.getElementById('heroTitle').textContent=s.h; document.getElementById('heroSub').textContent=s.s;
  const sel=document.getElementById('ctype'); if(sel) sel.value=s.ctype; }
if(seg) applySeg(seg);
const showPrice = config.showFromPrice !== false;
document.getElementById('fromPrice').hidden = !showPrice;
document.getElementById('priceVat').hidden = !showPrice;
document.getElementById('priceOnRequest').hidden = showPrice;
if(Number.isFinite(config.fromPriceILS) && config.fromPriceILS > 0){
  document.querySelector('[data-price="basic"]').textContent = new Intl.NumberFormat('he-IL').format(config.fromPriceILS);
}
if(LEAD_ENDPOINT){
  document.querySelectorAll('button[type="submit"]').forEach(b=>b.textContent='שליחת בקשה להצעת מחיר');
  document.querySelectorAll('.card .fine').forEach(p=>p.textContent='הפרטים ישמשו לחזרה אליכם בנוגע לפנייה.');
}
document.querySelectorAll('[data-track]').forEach(a=>a.addEventListener('click',()=>track(a.dataset.track,{seg:seg||'none'})));

/* ===== Lead forms ===== */
function validIL(p){ p=(p||'').replace(/[^\d+]/g,''); return /^(\+972|0)(5\d|[2-4]|[89]|7\d)\d{7}$/.test(p) || /^0\d{8,9}$/.test(p); }
async function handleForm(form){
  const card=form.closest('.card'); const data=Object.fromEntries(new FormData(form).entries());
  if(data.website) return;
  const nameEl=form.querySelector('[name=name]'), phoneEl=form.querySelector('[name=phone]');
  const status = form.querySelector('.form-status');
  status.textContent='';
  [nameEl, phoneEl].forEach(el=>{el.classList.remove('err');el.removeAttribute('aria-invalid');});
  if(!data.name||data.name.trim().length<2){ nameEl.classList.add('err'); nameEl.setAttribute('aria-invalid','true'); status.textContent='נא להזין שם מלא.'; nameEl.focus(); return; }
  if(!validIL(data.phone)){ phoneEl.classList.add('err'); phoneEl.setAttribute('aria-invalid','true'); status.textContent='נא להזין מספר טלפון ישראלי תקין.'; phoneEl.focus(); return; }
  data.seg=SEGS[seg]?seg:''; data.page=location.origin+location.pathname; data.ts=new Date().toISOString();
  ['utm_source','utm_medium','utm_campaign','utm_term'].forEach(k=>data[k]=qs.get(k)||'');
  const btn=form.querySelector('button[type=submit]'); btn.disabled=true; btn.textContent='שולח...';
  let ok=false;
  if(LEAD_ENDPOINT){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),10000);
    try{
      const r=await fetch(LEAD_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});
      const receipt=await r.json();
      ok=r.ok && receipt.accepted===true;
    }catch(e){ok=false;}finally{clearTimeout(timer);}
    if(!ok){
      status.textContent='לא הצלחנו לשלוח את הבקשה. נסו שוב או פנו אלינו בוואטסאפ.';
      const fallback=document.createElement('a');
      fallback.href='https://wa.me/'+WA_NUMBER; fallback.textContent=' פתיחת וואטסאפ';
      fallback.target='_blank'; fallback.rel='noopener'; status.append(fallback);
      btn.disabled=false; btn.textContent='ניסיון נוסף';
      return;
    }
  }
  if(!ok){ const msg=`שלום, אני ${data.name} (${data.ctype||''}${data.city?', '+data.city:''}). מעוניין/ת בהצעת מחיר לניקוי וחיטוי מאגר מים. טלפון: ${data.phone}`; track('lead_whatsapp_open',{seg:seg||'none'}); btn.disabled=false; btn.textContent='המשך לשליחה בוואטסאפ'; window.location.href=`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`; return; }
  track('form_submit',{seg:seg||'none',ctype:data.ctype,via:'endpoint'});
  card.classList.add('sent');
}
document.querySelectorAll('#leadForm,#leadForm2').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();handleForm(f);}));
document.querySelectorAll('a[href="#lead"]').forEach(a=>a.addEventListener('click',e=>{ e.preventDefault(); document.getElementById('lead').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}); setTimeout(()=>document.getElementById('name').focus({preventScroll:true}),600); }));
