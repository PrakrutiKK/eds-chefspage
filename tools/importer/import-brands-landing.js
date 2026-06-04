/* eslint-disable */
/* global WebImporter */

import tabsBrandParser from './parsers/tabs-brand.js';
import cardsThemeParser from './parsers/cards-theme.js';
import cardsArticleParser from './parsers/cards-article.js';
import cleanupTransformer from './transformers/brands-cleanup.js';
import sectionsTransformer from './transformers/brands-sections.js';

const parsers = {
  'tabs-brand': tabsBrandParser,
  'cards-theme': cardsThemeParser,
  'cards-article': cardsArticleParser,
};

const transformers = [
  cleanupTransformer,
];

const PAGE_TEMPLATE = {
  name: 'brands-landing',
  description: 'Brands landing page with navigation tabs, featured content cards grid, and brand category sections',
  urls: [
    'https://www.unileverfoodsolutions.co.uk/about-our-brands.html'
  ],
  blocks: [
    {
      name: 'tabs-brand',
      instances: ['nav.theme-sub-navigation']
    },
    {
      name: 'cards-theme',
      instances: ['div.top-content-item-section']
    },
    {
      name: 'cards-article',
      instances: ['.item-list--articles']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Page Header',
      selector: 'div.themeheaderversiona.section',
      style: null,
      blocks: ['tabs-brand'],
      defaultContent: ['h1']
    },
    {
      id: 'section-2',
      name: 'Featured Content',
      selector: 'div.topcontent.section',
      style: null,
      blocks: ['cards-theme'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Brand Articles',
      selector: 'div.themearticles.section',
      style: null,
      blocks: ['cards-article'],
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
