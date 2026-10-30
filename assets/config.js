/* Public settings only. Never put API keys or secret webhook URLs in browser code.
 * Everything here is read by assets/site.js on every page.
 * Phone numbers: taken from the company's existing site katz-water.com (Oct 2026). Confirm before launch.
 */
window.KATZ_CONFIG = {
  // Office line shown on the site and used for tel: links (E.164 without "+").
  phoneDisplay: "09-955-2072",
  phoneE164: "97299552072",
  // WhatsApp Business number (E.164 without "+").
  whatsappNumber: "972584219429",
  email: "office@katz-water.com",

  // Lead API: the Supabase Edge Function of katz-crm (see C:katz-crmdocsweb-leads). Empty = open WhatsApp with a prefilled message.
  // When live: "https://vmtffwlkebrdsojgoids.supabase.co/functions/v1/web-lead"
  // The server must answer HTTP 2xx with JSON {"accepted":true}. See README.md.
  leadEndpoint: "",

  // "From" prices per service, in ILS incl. VAT. null = show "הצעת מחיר" instead of a number (policy Oct 2026: no prices on the site).
  // Confirm every number with management before enabling.
  prices: {
    magar: null,   // ניקוי וחיטוי מאגר
    digum: null,   // דיגום מי שתייה
    tzaneret: null, // חיטוי קווי צנרת
    mazach: null   // בדיקת מז"ח
  },

  // Google Tag Manager container id, e.g. "GTM-XXXXXXX". Empty = no tag loaded.
  gtmId: ""
};
