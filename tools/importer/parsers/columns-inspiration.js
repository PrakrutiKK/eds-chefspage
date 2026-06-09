/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-inspiration variant.
 * Base block: columns
 * Source: https://www.unileverfoodsolutions.co.uk/
 * Generated: 2026-06-09
 *
 * Asymmetric two-column layout (2/3 + 1/3).
 * Left column: Featured article card with image, category tag, title, and description.
 * Right column: "Recipes" heading with recipe items (thumbnail + title).
 *
 * Note: Columns blocks do NOT require field hint comments per xwalk hinting rules.
 */
export default function parse(element, { document }) {
  // === LEFT COLUMN (col-span-8): Featured article ===
  const leftCol = element.querySelector('.col-span-8.js-inspiration-container');

  // Extract featured image (use desktop rendition, fall back to any img in figure)
  const featuredFigure = leftCol ? leftCol.querySelector('figure.item-list__image') : null;
  const featuredImg = featuredFigure
    ? (featuredFigure.querySelector('.hide-mobile img.img') || featuredFigure.querySelector('img.img'))
    : null;

  // Extract category tag from article-meta list
  const categoryLink = leftCol ? leftCol.querySelector('ul.article-meta li:not(.js-status) a') : null;

  // Extract article title and description
  const articleBody = leftCol ? leftCol.querySelector('.item-list__body') : null;
  const articleTitleLink = articleBody ? articleBody.querySelector(':scope > a[href]') : null;
  const articleTitle = articleBody ? articleBody.querySelector('h4.item-list__title') : null;
  const articleDesc = articleBody ? articleBody.querySelector('span.read-more') : null;

  // Build left column content fragment
  const leftContent = document.createDocumentFragment();
  if (featuredImg) {
    const img = document.createElement('img');
    img.src = featuredImg.src || featuredImg.getAttribute('src');
    img.alt = featuredImg.alt || featuredImg.getAttribute('alt') || '';
    leftContent.appendChild(img);
  }
  if (categoryLink) {
    const p = document.createElement('p');
    const catA = document.createElement('a');
    catA.href = categoryLink.href || categoryLink.getAttribute('href');
    catA.textContent = categoryLink.textContent.trim();
    p.appendChild(catA);
    leftContent.appendChild(p);
  }
  if (articleTitle) {
    const h4 = document.createElement('h4');
    if (articleTitleLink) {
      const a = document.createElement('a');
      a.href = articleTitleLink.href || articleTitleLink.getAttribute('href');
      a.textContent = articleTitle.textContent.trim();
      h4.appendChild(a);
    } else {
      h4.textContent = articleTitle.textContent.trim();
    }
    leftContent.appendChild(h4);
  }
  if (articleDesc) {
    const p = document.createElement('p');
    p.textContent = articleDesc.textContent.trim();
    leftContent.appendChild(p);
  }

  // === RIGHT COLUMN (col-span-4): Recipe list ===
  const rightCol = element.querySelector('.col-span-4.last-col');

  const rightContent = document.createDocumentFragment();

  // Recipes heading
  const recipesHeading = rightCol ? rightCol.querySelector('.item-list__header.recipes h3') : null;
  if (recipesHeading) {
    const h3 = document.createElement('h3');
    h3.textContent = recipesHeading.textContent.trim();
    rightContent.appendChild(h3);
  }

  // Recipe items (thumbnail + title)
  const recipeItems = rightCol ? rightCol.querySelectorAll('ul.item-list__grid > li') : [];
  recipeItems.forEach((li) => {
    const recipeImg = li.querySelector('figure.item-list__image img.img');
    const recipeLink = li.querySelector('.item-list__body a[href]');
    const recipeTitle = li.querySelector('.item-list__body h4.item-list__title');

    if (recipeImg || recipeTitle) {
      const itemDiv = document.createElement('div');

      if (recipeImg) {
        const img = document.createElement('img');
        img.src = recipeImg.src || recipeImg.getAttribute('src');
        img.alt = recipeImg.alt || recipeImg.getAttribute('alt') || '';
        itemDiv.appendChild(img);
      }

      if (recipeTitle) {
        const p = document.createElement('p');
        if (recipeLink) {
          const a = document.createElement('a');
          a.href = recipeLink.href || recipeLink.getAttribute('href');
          a.textContent = recipeTitle.textContent.trim();
          p.appendChild(a);
        } else {
          p.textContent = recipeTitle.textContent.trim();
        }
        itemDiv.appendChild(p);
      }

      rightContent.appendChild(itemDiv);
    }
  });

  // === BUILD CELLS: One row with two columns ===
  const cells = [
    [leftContent, rightContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-inspiration', cells });
  element.replaceWith(block);
}
