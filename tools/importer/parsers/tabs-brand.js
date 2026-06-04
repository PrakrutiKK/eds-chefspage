/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-brand variant.
 * Base block: tabs
 * Source: https://www.unileverfoodsolutions.co.uk/about-our-brands.html
 * Selector: nav.theme-sub-navigation
 * Generated: 2026-06-04
 *
 * Structure:
 *   Each row = one tab link (one column):
 *     Column 1: Link element with tab label text and href (field: tab)
 *
 * Source HTML structure:
 *   <nav class="theme-sub-navigation">
 *     <ul>
 *       <li><a href="..." class="active">Label</a></li>
 *       <li><a href="..." title="">Label</a></li>
 *       ...
 *     </ul>
 *   </nav>
 */
export default function parse(element, { document }) {
  // Select all tab link items from the navigation list
  const tabItems = element.querySelectorAll(':scope > ul > li');

  const cells = [];

  tabItems.forEach((item) => {
    const anchor = item.querySelector('a');
    if (!anchor) return;

    // Build cell with field hint
    const tabCell = document.createDocumentFragment();
    tabCell.appendChild(document.createComment(' field:tab '));

    // Create link element preserving href and label text
    const link = document.createElement('a');
    link.href = anchor.href || anchor.getAttribute('href') || '';
    link.textContent = anchor.textContent.trim();
    const p = document.createElement('p');
    p.appendChild(link);
    tabCell.appendChild(p);

    cells.push([tabCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-brand', cells });
  element.replaceWith(block);
}
