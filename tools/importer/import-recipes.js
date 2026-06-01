/* eslint-disable */
/* global WebImporter */

import carouselRecipeParser from './parsers/carousel-recipe.js';
import cardsRecipeParser from './parsers/cards-recipe.js';
import cleanupTransformer from './transformers/recipes-cleanup.js';
import sectionsTransformer from './transformers/recipes-sections.js';

const parsers = {
  'carousel-recipe': carouselRecipeParser,
  'cards-recipe': cardsRecipeParser,
};

const transformers = [
  cleanupTransformer,
];

const PAGE_TEMPLATE = {
  name: 'recipes',
  description: 'Recipes landing page with search functionality and recipe card grid for food service professionals',
  urls: [
    'https://www.unileverfoodsolutions.co.uk/recipes.html'
  ],
  blocks: [
    {
      name: 'carousel-recipe',
      instances: ['div.featured-item-slider__wrapper']
    },
    {
      name: 'cards-recipe',
      instances: ['div.product__lister.recipes']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Page Title',
      selector: 'div.recipeslandingpage.section',
      style: null,
      blocks: [],
      defaultContent: ['h1']
    },
    {
      id: 'section-2',
      name: 'Top Recipes Carousel',
      selector: 'div.toprecipes.section',
      style: null,
      blocks: ['carousel-recipe'],
      defaultContent: ['h2.featured-item-slider__title']
    },
    {
      id: 'section-3',
      name: 'Recipe Listing Grid',
      selector: 'div.recipeslister.section',
      style: null,
      blocks: ['cards-recipe'],
      defaultContent: []
    }
  ]
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    try {
      sectionsTransformer.call(null, 'afterTransform', main, { ...payload, template: PAGE_TEMPLATE });
    } catch (e) {
      console.error('Section transformer failed:', e);
    }

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
