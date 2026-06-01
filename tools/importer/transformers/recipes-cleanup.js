/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: recipes cleanup.
 * Removes non-authorable site shell content from unileverfoodsolutions.co.uk recipes page.
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove overlays and popups that could interfere with block parsing
    // Found in cleaned.html: div.camerascan-popup (line 4)
    // Found in cleaned.html: .lightbox__overlay (lines 226, 2363, 2656)
    // Found in cleaned.html: #onetrust-consent-sdk (line 2697)
    // Found in cleaned.html: #chat-widget-container (line 2899)
    // Found in cleaned.html: .js-page-preview (line 2394)
    // Found in cleaned.html: #livechat-eye-catcher (line 2909)
    // Found in cleaned.html: div.lightbox.section (line 2362) - survey lightbox
    // Found in cleaned.html: div.recipefiltersuggestion.section (line 2387) - empty filter suggestion
    WebImporter.DOMUtils.remove(element, [
      '.camerascan-popup',
      '.lightbox__overlay',
      '#onetrust-consent-sdk',
      '#chat-widget-container',
      '.js-page-preview',
      '#livechat-eye-catcher',
      '.lightbox.section',
      '.recipefiltersuggestion.section',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, [
      'header.main-header-v5',
      'footer',
      '.breadcrumb-wrapper-v2',
      '.main-header-pusher',
      '.bottom-nav-list',
      '.munchkin-label',
      '.click-cover',
      '.recipebook-login-section',
      'iframe',
      'link',
      'noscript',
      // Remove interactive filter UI elements (JS-driven, non-authorable)
      '.recipe-overview__filter',
      '.recipe__filter',
      '.js-item-list-filter',
      '.list-filter__toggle-alt',
      '.js-list-filter-location-error',
      // Remove app install prompts and tracking pixels
      '.homescreen-lightbox',
      '.pwa-popup',
      'img[src*="px.ads.linkedin"]',
      'img[src*="sprite.png"]',
    ]);
  }
}
