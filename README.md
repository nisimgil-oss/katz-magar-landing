# כץ איכויות מים – האתר (סטטי)

חי ב-GitHub Pages: https://nisimgil-oss.github.io/katz-magar-landing/ · עדכון: `git commit` + `git push` מתיקייה זו (ענף main).
תוכנית עבודה וצ'ק-ליסט מלא: `../PLAN.md`. מחקרים: `../research/`.

## מבנה
```
index.html                דף הבית (בורר סוגי לקוח, 4 שירותים, רגולציה, אודות, טופס)
nikui-magarim/index.html  ניקוי וחיטוי מאגרי מים (דף הנחיתה המאושר, עם תפריט ופוטר משותפים)
digum-mei-shtiya/         דיגום מי שתייה
hitui-tzaneret/           חיטוי קווי צנרת (טופס 4)
mazach/                   בדיקת מז"ח
privacy/  accessibility/  מדיניות פרטיות, הצהרת נגישות (noindex)
404.html  sitemap.xml  robots.txt
assets/styles.css         מערכת העיצוב המקורית
assets/pages.css          תוספות לאתר הרב-דפי (תפריט, כרטיסים, פוטר, דפי שירות)
assets/site.js            תפריט מובייל, בורר, טפסים, מעקב, ?seg=, מחירים מ-config
assets/config.js          *** כאן משנים טלפון, וואטסאפ, מייל, מחירים, GTM, leadEndpoint ***
```
הנתיבים יחסיים (`../assets/`), כך שהאתר עובד גם בתת-נתיב (github.io/katz-magar-landing/) וגם בדומיין משלו.
ביום המעבר לדומיין: חיפוש-החלפה של `https://nisimgil-oss.github.io/katz-magar-landing/` בכל קובצי ה-HTML וב-sitemap/robots, ועדכון הקישורים ב-404.html.

## config.js
| מפתח | מה עושה |
|---|---|
| `phoneDisplay`, `phoneE164` | הטלפון המוצג וקישורי tel: בכל הדפים (`[data-phone]`, `a[href^=tel:]`) |
| `whatsappNumber` | כל קישורי wa.me |
| `email` | `[data-email]` |
| `leadEndpoint` | ריק = הטופס פותח וואטסאפ עם הודעה מוכנה. כתובת = POST JSON; חייב להחזיר 2xx + `{"accepted":true}` |
| `prices.{magar,digum,tzaneret,mazach}` | מספר = "החל מ-" מוצג; `null` = "הצעת מחיר" |
| `gtmId` | GTM-XXXXXXX → נטען אוטומטית |

## אירועי dataLayer
`click_call`, `click_whatsapp`, `lead_whatsapp_open`, `form_submit` (רק אחרי אישור שרת), `click_pricing_quote`, `click_case_quote`, `chooser_pick`. לכל אירוע: `service` (home/magar/digum/tzaneret/mazach), `seg`, `label`, `page_path`.

## שדות הטופס (ל-leadEndpoint)
`name, phone, ctype, city, details, service, service_label, seg, page, ts, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, website(honeypot)`.

## התאמת מסר לקמפיין
`?seg=vaad|nihul|tofes4|mosad|hotel|prati` משנה כותרת, תת-כותרת ובחירת ברירת מחדל ב"אני פונה בשם". מוגדר ב-`window.KATZ_SEGS` בכל דף.

## בדיקה מקומית
```
node ../../scratch/serve.js "C:\gilgal\ניקוי מאגרים\site" 8765   # או כל שרת סטטי
```
צילום מובייל ב-Chrome headless: Chrome לא יורד מתחת ל~500px רוחב חלון; עוטפים ב-iframe ברוחב 390 (ראו היסטוריית הפרויקט).

## מה חייבים לאמת לפני השקה
טלפונים (נלקחו מ-katz-water.com), מספרי הסמכה, מחירים, שעות פעילות, ח.פ., שם רכז/ת נגישות, תמונות ועדויות אמיתיות. פירוט ב-`../PLAN.md` סעיף 3.
