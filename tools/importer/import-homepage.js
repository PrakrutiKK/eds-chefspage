/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsInspirationParser from './parsers/columns-inspiration.js';
import carouselProductParser from './parsers/carousel-product.js';
import heroNewsletterParser from './parsers/hero-newsletter.js';
import cardsBrandParser from './parsers/cards-brand.js';

// TRANSFORMER IMPORTS
import ufsCleanupTransformer from './transformers/ufs-cleanup.js';
import ufsSectionsTransformer from './transformers/ufs-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-inspiration': columnsInspirationParser,
  'carousel-product': carouselProductParser,
  'hero-newsletter': heroNewsletterParser,
  'cards-brand': cardsBrandParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  ufsCleanupTransformer,
  ufsSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Homepage with hero banner, recipe carousels, themed content cards, and promotional sections for food service professionals',
  urls: [
    'https://www.unileverfoodsolutions.co.uk/'
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['div.hero.section .hero.hero-banner-bg']
    },
    {
      name: 'columns-inspiration',
      instances: ['div.inspiration.section .pagecol-wrapper.item-list__columns.chefs-inspiration']
    },
    {
      name: 'carousel-product',
      instances: ['div.productcarousel.section .product-carrousel']
    },
    {
      name: 'hero-newsletter',
      instances: ['div.hero.section .hero.pagecol-wrapper']
    },
    {
      name: 'cards-brand',
      instances: ['div.brandlistv2.section .brand-list__short']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Page Intro',
      selector: 'div.introtext.section',
      style: null,
      blocks: [],
      defaultContent: ['div.introtext.section h1', 'div.introtext.section h2']
    },
    {
      id: 'section-2',
      name: 'Hero Carousel Banner',
      selector: 'div.hero.section:first-of-type',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Chef Inspiration and Recipes',
      selector: 'div.inspiration.section',
      style: null,
      blocks: ['columns-inspiration'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Recommended Products',
      selector: 'div.productcarousel.section',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Newsletter Signup Banner',
      selector: 'div.hero.section:nth-of-type(2)',
      style: null,
      blocks: ['hero-newsletter'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Brand Logo Bar',
      selector: 'div.brandlistv2.section',
      style: null,
      blocks: ['cards-brand'],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'Trends CTA Banner',
      selector: 'div.vanityurlconfigitem.section',
      style: 'dark',
      blocks: [],
      defaultContent: ['div.vanityurlconfigitem.section a img']
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 */
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

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = '/homepage';

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
