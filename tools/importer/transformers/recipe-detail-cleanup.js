/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: recipe-detail cleanup
 * Removes non-authorable site chrome and widgets from the recipe detail page.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent SDK (OneTrust) - line 2700 in cleaned.html
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);

    // Camera scan popup widget - line 4
    WebImporter.DOMUtils.remove(element, ['.camerascan-popup']);

    // Lightbox overlays (login, buy-it-now, favorites, cost calculator) - various lines
    WebImporter.DOMUtils.remove(element, ['.lightbox__overlay']);

    // Cost calculator lightbox - line 853
    WebImporter.DOMUtils.remove(element, ['.js-costcalculate-lightbox']);

    // Page preview overlay (promotional popup) - line 2399
    WebImporter.DOMUtils.remove(element, ['.js-page-preview.page-preview-overlay']);

    // Floating notification widget - line 2682
    WebImporter.DOMUtils.remove(element, ['.floating-notification']);

    // Homescreen lightbox (PWA install prompt) - line 2586
    WebImporter.DOMUtils.remove(element, ['.homescreen-lightbox']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header - line 26
    WebImporter.DOMUtils.remove(element, ['header.main-header-v5']);

    // Header pusher div - line 2
    WebImporter.DOMUtils.remove(element, ['.main-header-pusher']);

    // Footer - line 2439
    WebImporter.DOMUtils.remove(element, ['footer.footer']);

    // Breadcrumbs - line 725
    WebImporter.DOMUtils.remove(element, ['.breadcrumb-wrapper-v2']);

    // Content tools (favorite/share buttons) - lines 758, 1806, 1900
    WebImporter.DOMUtils.remove(element, ['.content-tools']);

    // Social share tools - lines 1807, 1901
    WebImporter.DOMUtils.remove(element, ['.tools.js-social-share']);

    // Bottom mobile nav bar - line 2615
    WebImporter.DOMUtils.remove(element, ['.bottom-nav-parent']);

    // Chat widget (LiveChat) - line 2902
    WebImporter.DOMUtils.remove(element, ['#chat-widget-container']);

    // LiveChat eye catcher - line 2912
    WebImporter.DOMUtils.remove(element, ['#livechat-eye-catcher']);

    // Munchkin tracking label - line 2431
    WebImporter.DOMUtils.remove(element, ['.munchkin-label']);

    // Recipe book login popup - line 2659
    WebImporter.DOMUtils.remove(element, ['.recipebook-login']);

    // Pagecol wrapper (print area) - line 824
    WebImporter.DOMUtils.remove(element, ['.pagecol-wrapper.hide-print']);

    // Rating/review section (Kritique widget) - line 1872
    WebImporter.DOMUtils.remove(element, ['.pdp-section.hide-print']);

    // Remove iframes, link tags, noscript elements
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);
  }
}
