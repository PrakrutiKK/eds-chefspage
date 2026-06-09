/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-newsletter
 * Base block: hero
 * Source: https://www.unileverfoodsolutions.co.uk/
 * Selector: div.hero.section .hero.pagecol-wrapper
 * Generated: 2026-06-09
 *
 * Structure (from UE model - simple block):
 *   Row 1: image (background image)
 *   Row 2: text (heading + body + CTA as richtext)
 */
export default function parse(element, { document }) {
  // Extract background image from the oblong figure (desktop version)
  const bgImage = element.querySelector('figure.hero__image-oblong img.img, figure img.img, .hero__image-oblong img');

  // Extract overlay content
  const heading = element.querySelector('.hero__overlay h3, .hero__overlay h2, .hero__overlay h1');
  const bodyText = element.querySelector('.hero__overlay .hero__body p, .hero__overlay .hero__body, .hero__overlay p');
  const ctaLink = element.querySelector('.hero__overlay a.button, .hero__overlay a[class*="button"], .hero__overlay a');

  // Row 1: Image with field hint
  const imageCell = [];
  if (bgImage) {
    const imageComment = document.createComment(' field:image ');
    const frag = document.createDocumentFragment();
    frag.appendChild(imageComment);
    frag.appendChild(bgImage);
    imageCell.push(frag);
  }

  // Row 2: Text content (heading + body + CTA) with field hint
  const textCell = [];
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  if (heading) {
    textFrag.appendChild(heading);
  }
  if (bodyText) {
    textFrag.appendChild(bodyText);
  }
  if (ctaLink) {
    textFrag.appendChild(ctaLink);
  }
  textCell.push(textFrag);

  // Build cells array matching the hero UE model (2 rows: image, text)
  const cells = [];
  if (imageCell.length) {
    cells.push(imageCell);
  } else {
    // Empty row for image if not found (xwalk requires all rows)
    cells.push(['']);
  }
  cells.push(textCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-newsletter', cells });
  element.replaceWith(block);
}
