/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-recipe variant.
 * Base block: cards
 * Source: https://www.unileverfoodsolutions.co.uk/recipes.html
 * Selector: div.product__lister.recipes
 * Generated: 2026-06-01
 *
 * Extracts recipe cards from a product lister grid. Each card has:
 * - Image (from figure.item-list__image > a > img)
 * - Title link (from div.item-list__body > a > span.item-list__title)
 * - Category tags (from div.item-list__body > ul > li.item-list__recipe-tags)
 *
 * Target structure (per card row): [image cell] [text cell]
 * xwalk model fields: image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  // Select all recipe card items from the grid
  const cardItems = element.querySelectorAll('li.list-heart-icon, li.js-recipeoverview-item');

  const cells = [];

  cardItems.forEach((item) => {
    // Extract image from figure
    const img = item.querySelector('figure.item-list__image img.img, figure img');

    // Extract title link from item-list__body
    const titleLink = item.querySelector('.item-list__body > a[href]');

    // Extract category tags
    const tags = Array.from(item.querySelectorAll('.item-list__body li.item-list__recipe-tags'));

    // Build image cell
    const imageCell = [];
    if (img) {
      // Use the title attribute as alt if alt is generic
      if (img.alt === 'alt' && img.title) {
        img.alt = img.title;
      }
      imageCell.push(img);
    }

    // Build text cell with title and tags
    const textCell = [];

    if (titleLink) {
      // Create a heading element for the card title
      const heading = document.createElement('p');
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.textContent = titleLink.title || titleLink.textContent.trim();
      const strong = document.createElement('strong');
      strong.appendChild(link);
      heading.appendChild(strong);
      textCell.push(heading);
    }

    if (tags.length > 0) {
      const tagText = document.createElement('p');
      tagText.textContent = tags.map((tag) => tag.textContent.trim()).join(', ');
      textCell.push(tagText);
    }

    // Each card row has two cells: [image, text]
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-recipe', cells });
  element.replaceWith(block);
}
