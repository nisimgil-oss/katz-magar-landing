/* Public settings only. Never put API keys or secret webhook URLs in browser code.
 * Prices originate from the supplied design export; confirm before a public launch.
 */
window.KATZ_CONFIG = {
  whatsappNumber: "972505219429",
  leadEndpoint: "", // Optional public, same-origin lead API. Success JSON: {"accepted":true}.
  showFromPrice: true,
  fromPriceILS: 1190 // ILS, incl. VAT, cleaning + disinfection for a tank up to 10 m³.
};
