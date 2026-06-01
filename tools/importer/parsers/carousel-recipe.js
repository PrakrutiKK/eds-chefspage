/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-recipe
 * Base block: carousel-recipe (container block)
 * Source: https://www.unileverfoodsolutions.co.uk/recipes.html
 * Selector: div.featured-item-slider__wrapper
 * Generated: 2026-06-01
 *
 * Source structure:
 *   div.featured-item-slider__wrapper
 *     > div.featured-item-slider__list > div.slick-list > div.slick-track
 *       > div.featured-item-slider__list-item (x10)
 *         > figure
 *           > div.featured-item-slider__img > a > img
 *           > figcaption.featured-item-slider__caption > a > span (title) + div > span.featured-item-slider__recipe-tags
 *
 * Target structure (xwalk container block):
 *   Each slide = one row with 2 columns:
 *     Column 1 (media_image): recipe image
 *     Column 2 (content_text): linked title + category tags (richtext)
 */
export default function parse(element, { document }) {
  // Find all carousel slide items
  const items = element.querySelectorAll('.featured-item-slider__list-item');

  const cells = [];

  items.forEach((item) => {
    // Column 1: Extract recipe image
    const img = item.querySelector('.featured-item-slider__img img.img, .featured-item-slider__img img');

    // Column 2: Extract title link and category tags as richtext
    const caption = item.querySelector('figcaption.featured-item-slider__caption, .featured-item-slider__caption');

    // Build media cell with field hint
    const mediaCell = document.createDocumentFragment();
    mediaCell.appendChild(document.createComment(' field:media_image '));
    if (img) {
      const clonedImg = img.cloneNode(true);
      mediaCell.appendChild(clonedImg);
    }

    // Build content cell with field hint
    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(' field:content_text '));
    if (caption) {
      // Get the title link
      const titleLink = caption.querySelector(':scope > a');
      if (titleLink) {
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.textContent = titleLink.textContent.trim();
        if (titleLink.getAttribute('title')) {
          link.title = titleLink.getAttribute('title');
        }
        const p = document.createElement('p');
        p.appendChild(link);
        contentCell.appendChild(p);
      }

      // Get category tags
      const tags = caption.querySelectorAll('.featured-item-slider__recipe-tags');
      if (tags.length > 0) {
        const tagP = document.createElement('p');
        tags.forEach((tag, index) => {
          if (index > 0) {
            tagP.appendChild(document.createTextNode(', '));
          }
          tagP.appendChild(document.createTextNode(tag.textContent.trim()));
        });
        contentCell.appendChild(tagP);
      }
    }

    // Each item becomes a row with 2 columns [media, content]
    cells.push([mediaCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-recipe', cells });
  element.replaceWith(block);
}
