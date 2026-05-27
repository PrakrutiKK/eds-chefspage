/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-theme variant.
 * Base block: cards
 * Source: https://www.unileverfoodsolutions.nl/inspiratie-voor-chefs.html
 * Selector: ul.item-list__grid
 * Generated: 2026-05-27
 *
 * Structure (from block library):
 *   Each card is one row with 2 columns:
 *     Column 1: Image (field: image)
 *     Column 2: Text content - title (strong), description, CTA link (field: text)
 *
 * UE Model: container block "cards" with child item model "card"
 *   Fields: image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  // Select all card list items from the grid
  const cardItems = element.querySelectorAll(':scope > li.highlight-content');

  const cells = [];

  cardItems.forEach((item) => {
    // Column 1: Image - use the desktop image (not the mobile hide-above-mobile one)
    const figure = item.querySelector('figure.item-list__image');
    const desktopImg = figure ? figure.querySelector('img.img:not(.hide-above-mobile)') : null;

    // Column 2: Text content - title, description, CTA
    const body = item.querySelector('div.item-list__body');

    // Extract title from the image overlay span (serves as card title)
    const overlaySpan = figure ? figure.querySelector('span.item-list__image-overlay > span') : null;
    const titleText = overlaySpan ? overlaySpan.textContent.trim() : '';

    // Extract description from the body paragraph link
    const descParagraph = body ? body.querySelector('p > a') : null;
    const descText = descParagraph ? descParagraph.textContent.trim() : '';

    // Extract CTA link (the read-more link)
    const ctaLink = body ? body.querySelector('a:has(span.read-more), a > span.read-more') : null;
    let ctaAnchor = null;
    if (ctaLink) {
      // Get the parent <a> if we matched the span
      ctaAnchor = ctaLink.tagName === 'A' ? ctaLink : ctaLink.closest('a');
    }
    // Fallback: get the last direct <a> child of body that has .read-more span
    if (!ctaAnchor && body) {
      const allLinks = body.querySelectorAll(':scope > a');
      for (const link of allLinks) {
        if (link.querySelector('span.read-more')) {
          ctaAnchor = link;
          break;
        }
      }
    }

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (desktopImg) {
      imageCell.appendChild(desktopImg);
    }

    // Build text cell with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    // Add title as strong element inside a paragraph for proper block rendering
    if (titleText) {
      const titleP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      titleP.appendChild(strong);
      textCell.appendChild(titleP);
    }

    // Add description as paragraph
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      textCell.appendChild(p);
    }

    // Add CTA link wrapped in a paragraph for proper separation
    if (ctaAnchor) {
      const ctaP = document.createElement('p');
      const link = document.createElement('a');
      link.href = ctaAnchor.href || ctaAnchor.getAttribute('href');
      link.textContent = ctaAnchor.textContent.trim();
      ctaP.appendChild(link);
      textCell.appendChild(ctaP);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-theme', cells });
  element.replaceWith(block);
}
