/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-chef variant.
 * Base block: columns
 * Source: https://www.unileverfoodsolutions.co.uk/recipe/barley-greens-bowl-with-matcha-yuzu-dressing-R90033590.html
 * Selector: .chef-name
 * Structure: Row 1: column 1 = chef circular image, column 2 = chef name (h3)
 * Generated: 2026-06-01
 */
export default function parse(element, { document }) {
  // The selector targets h3.chef-name - navigate up to the chef container
  // to extract both the image and the name
  const chefContainer = element.closest('.recipe-v3-chef-container') || element.closest('.recipe-v3-chef') || element.parentElement;

  // Extract chef image from the container
  // Source structure: .chef-image > img.rounded_img
  const chefImage = chefContainer
    ? chefContainer.querySelector('img.rounded_img, .chef-image img, img[alt]')
    : null;

  // Extract chef name - this is the element itself (h3.chef-name) or find it in context
  const chefName = element.matches('h3.chef-name, h3')
    ? element
    : chefContainer
      ? chefContainer.querySelector('h3.chef-name, h3, .chef-name')
      : element;

  // Build cells: one row with 2 columns (image | name)
  // Column 1: chef image
  // Column 2: chef name as h3
  const col1 = [];
  if (chefImage) {
    col1.push(chefImage);
  }

  const col2 = [];
  if (chefName) {
    // Create a fresh h3 with the chef name text to ensure clean output
    const heading = document.createElement('h3');
    heading.textContent = chefName.textContent.trim();
    col2.push(heading);
  }

  const cells = [
    [col1, col2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-chef', cells });
  element.replaceWith(block);
}
