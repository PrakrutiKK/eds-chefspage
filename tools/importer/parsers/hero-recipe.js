/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-recipe variant.
 * Base block: hero
 * Source: https://www.unileverfoodsolutions.co.uk/recipe/barley-greens-bowl-with-matcha-yuzu-dressing-R90033590.html
 * Selector: div.page-header_recipe
 * Structure: Row 1 = background image (recipe photo). Row 2 = h1 title text.
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Generated: 2026-06-01
 */
export default function parse(element, { document }) {
  // Extract the recipe hero image (picture element within video fallback area)
  const picture = element.querySelector('.recipe-image-v2 picture, .recipe-detailv3__video-fallback-img picture, .recipe-detailv3__box-two picture');
  // Fallback: any img inside the hero area
  const img = picture || element.querySelector('.recipe-image-v2 img, .recipe-detailv3__video-fallback-img img, img[class*="img-loaded"]');

  // Extract the h1 title
  const heading = element.querySelector('h1, .recipe-description h1, .recipe-detailv3__description h1');

  // Build cells array matching hero model: Row 1 = image, Row 2 = text
  const cells = [];

  // Row 1: Background image with field hint
  if (img) {
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(img);
    cells.push([imageFrag]);
  }

  // Row 2: Title text (h1) with field hint
  if (heading) {
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    textFrag.appendChild(heading);
    cells.push([textFrag]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-recipe', cells });
  element.replaceWith(block);
}
