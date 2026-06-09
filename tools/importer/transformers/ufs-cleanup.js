/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: UFS (Unilever Food Solutions) site-wide cleanup.
 * Removes non-authorable content: header, footer, cookie consent, livechat,
 * lightbox overlays, PWA prompts, tracking, and mobile navigation chrome.
 * All selectors from captured DOM of https://www.unileverfoodsolutions.co.uk/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent SDK (OneTrust) - blocks parsing
    // Found in captured HTML: <div id="onetrust-consent-sdk">
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);

    // Lightbox overlays (login, newsletter, recipe book, buy-it-now) - modals blocking content
    // Found in captured HTML: <div class="lightbox__overlay hide-print hidden js-lightbox ...">
    WebImporter.DOMUtils.remove(element, ['.lightbox__overlay']);

    // Camera/barcode scanner popup
    // Found in captured HTML: <div class="camerascan-popup js-camerascan-popup hidden">
    WebImporter.DOMUtils.remove(element, ['.camerascan-popup']);

    // LiveChat widget and eye catcher
    // Found in captured HTML: <div id="chat-widget-container"> and <div id="livechat-eye-catcher">
    WebImporter.DOMUtils.remove(element, ['#chat-widget-container', '#livechat-eye-catcher']);

    // Floating notification popup
    // Found in captured HTML: <div class="floating-notification js-notification-info hidden">
    WebImporter.DOMUtils.remove(element, ['.floating-notification']);

    // Homescreen/PWA install lightbox
    // Found in captured HTML: <div class="homescreen-lightbox hide-print hidden js-homescreen-notification">
    WebImporter.DOMUtils.remove(element, ['.homescreen-lightbox']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Site header with navigation, search, login
    // Found in captured HTML: <header class="main-header-v5 js-main-header js-main-header-v3 sticky-header_unpinned">
    WebImporter.DOMUtils.remove(element, ['header.main-header-v5']);

    // Site footer
    // Found in captured HTML: <footer class="footer sticky-buy-bar-enabled">
    WebImporter.DOMUtils.remove(element, ['footer.footer']);

    // Header spacer div
    // Found in captured HTML: <div class="main-header-pusher ">
    WebImporter.DOMUtils.remove(element, ['.main-header-pusher']);

    // Page preview overlay (gated content promo)
    // Found in captured HTML: <div class="js-page-preview page-preview-overlay hide-print hidden">
    WebImporter.DOMUtils.remove(element, ['.js-page-preview']);

    // Marketo/Munchkin tracking
    // Found in captured HTML: <div class="munchkin-label">
    WebImporter.DOMUtils.remove(element, ['.munchkin-label']);

    // Mobile bottom navigation (PWA)
    // Found in captured HTML: <div class="hide-above-tablet bottom-nav-parent js-bottom-nav-parent hide-print">
    WebImporter.DOMUtils.remove(element, ['.bottom-nav-parent']);

    // Cookie bar config (empty section)
    // Found in captured HTML: <div class="cookiebarconfig section">
    WebImporter.DOMUtils.remove(element, ['.cookiebarconfig']);

    // Modular form config (empty section)
    // Found in captured HTML: <div class="modularformconfig section">
    WebImporter.DOMUtils.remove(element, ['.modularformconfig']);

    // Multi buy-it-now config section
    // Found in captured HTML: <div class="multibuyitnowconfig section">
    WebImporter.DOMUtils.remove(element, ['.multibuyitnowconfig']);

    // CSS link elements (not authorable)
    // Found in captured HTML: <link href="/etc/clientlibs/ufs-aem/components/hero.min...css">
    WebImporter.DOMUtils.remove(element, ['link']);

    // Iframes (LiveChat, embedded widgets)
    WebImporter.DOMUtils.remove(element, ['iframe']);

    // Noscript elements
    WebImporter.DOMUtils.remove(element, ['noscript']);

    // LinkedIn tracking pixel image
    // Found in captured HTML: <img alt="" src="https://px.ads.linkedin.com/collect/...">
    const trackingPixels = element.querySelectorAll('img[src*="px.ads.linkedin.com"]');
    trackingPixels.forEach((el) => el.remove());
  }
}
