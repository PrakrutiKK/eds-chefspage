/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: chefspage cleanup.
 * Removes non-authorable site shell content from unileverfoodsolutions.nl.
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove overlays and popups that could interfere with block parsing
    // Found in cleaned.html: div.camerascan-popup (line 13)
    // Found in cleaned.html: .lightbox__overlay (lines 245, 677, 727, 755, 793, 830, 1410, 1442, 1502)
    // Found in cleaned.html: #onetrust-consent-sdk (line 1686)
    // Found in cleaned.html: #chat-widget-container (line 1875)
    // Found in cleaned.html: .js-page-preview (line 1172)
    WebImporter.DOMUtils.remove(element, [
      '.camerascan-popup',
      '.lightbox__overlay',
      '#onetrust-consent-sdk',
      '#chat-widget-container',
      '.js-page-preview',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site shell content
    // Found in cleaned.html: header.main-header-v5 (line 35)
    // Found in cleaned.html: footer.footer (line 1211)
    // Found in cleaned.html: ol.breadcrumb (lines 853, 864)
    // Found in cleaned.html: div.main-header-pusher (line 11)
    // Found in cleaned.html: div.js-minicart-component (line 649)
    // Found in cleaned.html: div.bottom-nav-list (line 1366)
    // Found in cleaned.html: div.munchkin-label (line 1203)
    // Found in cleaned.html: div.click-cover (line 1168)
    // Found in cleaned.html: div.page-content (line 1162, empty wrapper)
    // Found in cleaned.html: #savivaAPIName, #mercantoAPIName (lines 673-675)
    // Found in cleaned.html: div.breadcrumb-wrapper-v2 (line 852)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.breadcrumb-wrapper-v2',
      '.main-header-pusher',
      '.js-minicart-component',
      '.bottom-nav-list',
      '.munchkin-label',
      '.click-cover',
      '.page-content',
      '#savivaAPIName',
      '#mercantoAPIName',
      '.tradepartner-dialog',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
