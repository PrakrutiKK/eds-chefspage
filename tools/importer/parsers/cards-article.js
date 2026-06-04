/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article variant.
 * Base block: cards
 * Source: https://www.unileverfoodsolutions.co.uk/about-our-brands.html
 * Selector: .item-list--articles
 * Generated: 2026-06-04
 *
 * Extracts compact article cards from brand article listing sections.
 * Each card has:
 * - Thumbnail image (from figure.item-list__image > a > img.img)
 * - Linked title (from div.item-list__body > a > h2.item-list__title)
 *
 * Target structure (per card row): [image cell] [text cell]
 * xwalk model fields: image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  // Select all article card items from the list
  const cardItems = element.querySelectorAll('li.item-list__article-item');

  const cells = [];

  cardItems.forEach((item) => {
    // Extract thumbnail image from figure
    const img = item.querySelector('figure.item-list__image img.img, figure img');

    // Extract the title link from the body section
    const bodyLink = item.querySelector('.item-list__body > a[href]');
    const titleEl = item.querySelector('.item-list__body h2.item-list__title, .item-list__body .item-list__title');

    // Build image cell with xwalk field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.src = img.src || img.getAttribute('src');
      imgEl.alt = img.alt || img.getAttribute('alt') || img.title || '';
      picture.appendChild(imgEl);
      const p = document.createElement('p');
      p.appendChild(picture);
      imageCell.appendChild(p);
    }

    // Build text cell with xwalk field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (bodyLink) {
      const linkP = document.createElement('p');
      const link = document.createElement('a');
      link.href = bodyLink.href || bodyLink.getAttribute('href');
      // Use the title text from the h2, or fallback to link title attribute or text content
      const titleText = titleEl
        ? titleEl.textContent.trim()
        : (bodyLink.title || bodyLink.textContent.trim());
      link.textContent = titleText;
      const strong = document.createElement('strong');
      strong.appendChild(link);
      linkP.appendChild(strong);
      textCell.appendChild(linkP);
    } else if (titleEl) {
      // Fallback: title without link
      const titleP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      titleP.appendChild(strong);
      textCell.appendChild(titleP);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
