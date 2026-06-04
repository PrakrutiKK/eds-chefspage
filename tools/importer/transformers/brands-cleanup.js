/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: brands cleanup. Selectors from captured DOM of
 * https://www.unileverfoodsolutions.co.uk/about-our-brands.html
 *
 * Removes non-authorable site shell content:
 * - Cookie consent (OneTrust #onetrust-consent-sdk)
 * - LiveChat widget (#chat-widget-container, #livechat-eye-catcher)
 * - Camerascan popup (.camerascan-popup)
 * - Login lightboxes (.lightbox__overlay, .lightbox-login)
 * - Floating notification (.floating-notification)
 * - Header (header.main-header-v5)
 * - Header pusher (.main-header-pusher)
 * - Footer (footer.footer)
 * - Breadcrumbs (.breadcrumb-wrapper-v2)
 * - Page preview overlay (.js-page-preview.page-preview-overlay)
 * - Homescreen lightbox (.homescreen-lightbox)
 * - Bottom mobile nav (.bottom-nav-parent)
 * - Recipe book login lightbox (.recipebook-login)
 * - Tracking pixels (img[src*="px.ads.linkedin.com"])
 * - Iframes, links, noscript elements
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove elements that could interfere with block parsing
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#chat-widget-container',
      '#livechat-eye-catcher',
      '.camerascan-popup',
      '.floating-notification',
      '.lightbox__overlay',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable site shell content
    WebImporter.DOMUtils.remove(element, [
      'header.main-header-v5',
      '.main-header-pusher',
      'footer.footer',
      '.breadcrumb-wrapper-v2',
      '.js-page-preview.page-preview-overlay',
      '.homescreen-lightbox',
      '.bottom-nav-parent',
      '.recipebook-login',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove tracking pixels
    const trackingPixels = element.querySelectorAll('img[src*="px.ads.linkedin.com"]');
    trackingPixels.forEach((el) => el.remove());
  }
}
