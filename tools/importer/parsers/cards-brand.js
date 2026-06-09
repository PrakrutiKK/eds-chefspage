/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-brand variant.
 * Base block: cards
 * Source: https://www.unileverfoodsolutions.co.uk/
 * Selector: div.brandlistv2.section .brand-list__short
 * Generated: 2026-06-09
 *
 * Structure (from block model):
 *   Container block with child item "card"
 *   Each card is one row with 2 columns:
 *     Column 1: Brand logo image (field: image)
 *     Column 2: Brand name as linked text to product catalogue (field: text)
 *
 * UE Model: container block "cards-brand" with child item model "card"
 *   Fields: image (reference), text (richtext)
 *
 * Source structure:
 *   <ul class="brand-list__short">
 *     <li>
 *       <a href="/product-catalogue.html?brandname=..." title="BRAND NAME">
 *         <img class="img-loaded" title="BRAND NAME" alt="alt" src="...">
 *       </a>
 *     </li>
 *     ...
 *   </ul>
 */
export default function parse(element, { document }) {
  // Select all brand list items - each <li> contains one brand logo link
  const brandItems = element.querySelectorAll(':scope > li, li');

  const cells = [];

  brandItems.forEach((item) => {
    // Extract the anchor link wrapping the brand logo
    const anchor = item.querySelector('a[href]');
    if (!anchor) return;

    // Extract the brand logo image
    const img = anchor.querySelector('img, img.img-loaded');

    // Column 1: Image with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const picture = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src || img.getAttribute('src') || '';
      newImg.alt = img.getAttribute('title') || img.getAttribute('alt') || '';
      picture.appendChild(newImg);
      const p = document.createElement('p');
      p.appendChild(picture);
      imageCell.appendChild(p);
    }

    // Column 2: Brand name as linked text with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    const brandName = anchor.getAttribute('title') || anchor.textContent.trim();
    const link = document.createElement('a');
    link.href = anchor.href || anchor.getAttribute('href') || '';
    link.textContent = brandName;
    const p = document.createElement('p');
    p.appendChild(link);
    textCell.appendChild(p);

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-brand', cells });
  element.replaceWith(block);
}
