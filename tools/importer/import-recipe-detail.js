/* eslint-disable */
/* global WebImporter */

import heroRecipeParser from './parsers/hero-recipe.js';
import tableIngredientsParser from './parsers/table-ingredients.js';
import columnsChefParser from './parsers/columns-chef.js';
import carouselRecipeParser from './parsers/carousel-recipe.js';
import cleanupTransformer from './transformers/recipe-detail-cleanup.js';
import sectionsTransformer from './transformers/recipe-detail-sections.js';

const parsers = {
  'hero-recipe': heroRecipeParser,
  'table-ingredients': tableIngredientsParser,
  'columns-chef': columnsChefParser,
  'carousel-recipe': carouselRecipeParser,
};

const transformers = [
  cleanupTransformer,
];

const PAGE_TEMPLATE = {
  name: 'recipe-detail',
  description: 'Recipe detail page with hero image, ingredients table, preparation steps, chef attribution, and related recipes carousel',
  urls: [
    'https://www.unileverfoodsolutions.co.uk/recipe/barley-greens-bowl-with-matcha-yuzu-dressing-R90033590.html'
  ],
  blocks: [
    {
      name: 'hero-recipe',
      instances: ['div.page-header_recipe']
    },
    {
      name: 'table-ingredients',
      instances: ['#ingredients-content']
    },
    {
      name: 'columns-chef',
      instances: ['.chef-name']
    },
    {
      name: 'carousel-recipe',
      instances: ['div.relatedrecipes.section .featured-item-slider__wrapper']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Recipe Hero',
      selector: 'div.recipe-detailv3',
      style: 'dark',
      blocks: ['hero-recipe'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Recipe Content',
      selector: 'div.recipe-detailv3__recipe',
      style: null,
      blocks: ['table-ingredients', 'columns-chef'],
      defaultContent: ['p.recipe-desc', '#preparation-content']
    },
    {
      id: 'section-3',
      name: 'Related Recipes',
      selector: 'div.relatedrecipes.section',
      style: null,
      blocks: ['carousel-recipe'],
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
