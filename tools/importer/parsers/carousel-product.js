/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product
 * Base block: carousel
 * Source: https://www.unileverfoodsolutions.co.uk/
 * Generated: 2026-06-09
 *
 * Product carousel showing product tiles with product name heading,
 * packshot image, "Buy Product" button, and "Product Specification" link.
 * Container block: each product item = one row with image and content columns.
 *
 * Source structure (static):
 *   ul.product-carrousel.radial-glow > li > a > img (packshot placeholder)
 *   + a.button.orange.white-outline (CTA: "See all our products")
 *
 * Source structure (JS-rendered product tiles):
 *   .product-tile.js-product-tile
 *     .product__brand-overlay > h2 > a (product name heading + link)
 *     .product__image > a > img (product packshot)
 *     .product__details
 *       a.sel-buy-it-now-button (Buy Product)
 *       a.sel-see-more-button (Product Specification)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Strategy: The parser receives the ul.product-carrousel element or its parent .product__carrousel.
  // The actual product tiles are rendered by JS in a sibling section (.relatedproducts.section).
  // We look for product tiles either within the received element, in the closest section,
  // or in the broader page DOM near the product carousel section.

  // First, try to find product tiles in the closest context
  const section = element.closest('.section') || element.closest('[class*="productcarousel"]');
  const page = element.ownerDocument;

  // Look for dynamically rendered product tiles
  let productTiles = element.querySelectorAll('.product-tile');
  if (!productTiles.length && section) {
    productTiles = section.querySelectorAll('.product-tile');
  }
  // Also check the related products section which is where tiles actually render
  if (!productTiles.length) {
    const relatedSection = page.querySelector('.relatedproducts.section .js-related-products');
    if (relatedSection) {
      productTiles = relatedSection.querySelectorAll('.product-tile');
    }
  }

  if (productTiles.length > 0) {
    // Dynamic product tiles found - extract each as a row
    productTiles.forEach((tile) => {
      const row = [];

      // Extract product image
      const imgEl = tile.querySelector('.product__image img');
      if (imgEl) {
        const imgClone = imgEl.cloneNode(true);
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(' field:image '));
        frag.appendChild(imgClone);
        row.push(frag);
      } else {
        row.push('');
      }

      // Extract product content: heading + buy link + specification link
      const contentFrag = document.createDocumentFragment();

      // Product name heading
      const heading = tile.querySelector('.product__brand-overlay h2');
      if (heading) {
        const headingClone = heading.cloneNode(true);
        contentFrag.appendChild(document.createComment(' field:title '));
        contentFrag.appendChild(headingClone);
      }

      // Buy Product button
      const buyBtn = tile.querySelector('.sel-buy-it-now-button');
      if (buyBtn) {
        const buyClone = buyBtn.cloneNode(true);
        // Clean up JS-only href
        if (buyClone.getAttribute('href') === 'javascript:;') {
          buyClone.setAttribute('href', '#');
        }
        contentFrag.appendChild(document.createComment(' field:buyLink '));
        contentFrag.appendChild(buyClone);
      }

      // Product Specification link
      const specLink = tile.querySelector('.sel-see-more-button');
      if (specLink) {
        const specClone = specLink.cloneNode(true);
        contentFrag.appendChild(document.createComment(' field:specLink '));
        contentFrag.appendChild(specClone);
      }

      row.push(contentFrag);
      cells.push(row);
    });
  } else {
    // Fallback: static content only (placeholder image + CTA)
    // Extract the packshot image from the list
    const img = element.querySelector('img') || (section && section.querySelector('.product-carrousel img'));
    const ctaLink = element.querySelector('a.button') ||
      (element.parentElement && element.parentElement.querySelector('a.button'));

    if (img || ctaLink) {
      const row = [];

      // Image cell
      if (img) {
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(' field:image '));
        imgFrag.appendChild(img.cloneNode(true));
        row.push(imgFrag);
      } else {
        row.push('');
      }

      // Content cell with CTA
      if (ctaLink) {
        const ctaFrag = document.createDocumentFragment();
        ctaFrag.appendChild(document.createComment(' field:buyLink '));
        ctaFrag.appendChild(ctaLink.cloneNode(true));
        row.push(ctaFrag);
      } else {
        row.push('');
      }

      cells.push(row);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
