/* eslint-disable */
/* global WebImporter */

/**
 * Parser for table-ingredients variant.
 * Base block: table
 * Source: https://www.unileverfoodsolutions.co.uk/recipe/barley-greens-bowl-with-matcha-yuzu-dressing-R90033590.html
 * Selector: #ingredients-content
 * Generated: 2026-06-01
 *
 * Extracts ingredient name/quantity pairs grouped by sub-headings (h4).
 * Source structure:
 *   - .tablesof-content contains the ingredient data
 *   - h4 elements are group sub-headings (e.g. "For the salad", "For the dressing")
 *   - .header-list.js-header-list divs are ingredient rows
 *   - Within each row: .col-span-3.name = ingredient name, .col-span-2.qty.js-qty = quantity
 *   - Branded products have .prodct-tileingredient wrapper with linked product name
 *
 * Target: 2-column table (column1text = ingredient name, column2text = quantity)
 * Sub-headings become single-cell rows spanning the full width.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find the tablesof-content container which holds the actual ingredient data
  const tableContainer = element.querySelector('.tablesof-content');
  if (!tableContainer) {
    // Fallback: use the element itself if .tablesof-content is not found
    const block = WebImporter.Blocks.createBlock(document, { name: 'table-ingredients', cells: [] });
    element.replaceWith(block);
    return;
  }

  // Iterate through direct children of .tablesof-content to find h4 headings and .header-list rows
  // Skip the .header div (column headers) at the top
  const children = Array.from(tableContainer.children);

  for (const child of children) {
    // Skip the column header row
    if (child.classList.contains('header')) continue;

    // Skip hidden elements (new-content form, empty headings)
    if (child.classList.contains('new-content') || child.classList.contains('js-new-content')) continue;

    // Handle h4 sub-headings (group separators like "For the salad", "For the dressing")
    if (child.tagName === 'H4') {
      const headingText = child.textContent.trim();
      // Only add non-empty headings (skip hidden/empty h4 elements)
      if (headingText) {
        const h4 = document.createElement('h4');
        h4.textContent = headingText;
        cells.push([h4]);
      }
      continue;
    }

    // Handle ingredient rows (.header-list.js-header-list)
    if (child.classList.contains('header-list') || child.classList.contains('js-header-list')) {
      // Extract ingredient name - check for branded product first, then plain name
      const brandedName = child.querySelector('.prodct-tileingredient .name.js-accordion-trigger');
      const plainName = child.querySelector('.col-span-3.name');
      const nameEl = brandedName || plainName;

      // Extract quantity
      const qtyEl = child.querySelector('.col-span-2.qty.js-qty, .col-span-2.qty');

      if (nameEl) {
        const ingredientName = nameEl.textContent.trim();
        const quantity = qtyEl ? qtyEl.textContent.trim() : '';

        if (ingredientName) {
          // Build cell content - for branded products, create a link
          let col1Content;
          if (brandedName) {
            // Check if there is a product link available
            const productLink = child.querySelector('.product-title a');
            if (productLink) {
              const link = document.createElement('a');
              link.href = productLink.getAttribute('href') || '';
              link.textContent = ingredientName;
              col1Content = link;
            } else {
              col1Content = ingredientName;
            }
          } else {
            col1Content = ingredientName;
          }

          // Create 2-column row: [ingredient name, quantity]
          cells.push([col1Content, quantity]);
        }
      }
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-ingredients', cells });
  element.replaceWith(block);
}
