/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-recipes.js
  var import_recipes_exports = {};
  __export(import_recipes_exports, {
    default: () => import_recipes_default
  });

  // tools/importer/parsers/carousel-recipe.js
  function parse(element, { document }) {
    const items = element.querySelectorAll(".featured-item-slider__list-item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".featured-item-slider__img img.img, .featured-item-slider__img img");
      const caption = item.querySelector("figcaption.featured-item-slider__caption, .featured-item-slider__caption");
      const mediaCell = document.createDocumentFragment();
      mediaCell.appendChild(document.createComment(" field:media_image "));
      if (img) {
        const clonedImg = img.cloneNode(true);
        mediaCell.appendChild(clonedImg);
      }
      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(" field:content_text "));
      if (caption) {
        const titleLink = caption.querySelector(":scope > a");
        if (titleLink) {
          const link = document.createElement("a");
          link.href = titleLink.getAttribute("href");
          link.textContent = titleLink.textContent.trim();
          if (titleLink.getAttribute("title")) {
            link.title = titleLink.getAttribute("title");
          }
          const p = document.createElement("p");
          p.appendChild(link);
          contentCell.appendChild(p);
        }
        const tags = caption.querySelectorAll(".featured-item-slider__recipe-tags");
        if (tags.length > 0) {
          const tagP = document.createElement("p");
          tags.forEach((tag, index) => {
            if (index > 0) {
              tagP.appendChild(document.createTextNode(", "));
            }
            tagP.appendChild(document.createTextNode(tag.textContent.trim()));
          });
          contentCell.appendChild(tagP);
        }
      }
      cells.push([mediaCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-recipe", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-recipe.js
  function parse2(element, { document }) {
    const cardItems = element.querySelectorAll("li.list-heart-icon, li.js-recipeoverview-item");
    const cells = [];
    cardItems.forEach((item) => {
      const img = item.querySelector("figure.item-list__image img.img, figure img");
      const titleLink = item.querySelector(".item-list__body > a[href]");
      const tags = Array.from(item.querySelectorAll(".item-list__body li.item-list__recipe-tags"));
      const imageCell = [];
      if (img) {
        if (img.alt === "alt" && img.title) {
          img.alt = img.title;
        }
        imageCell.push(img);
      }
      const textCell = [];
      if (titleLink) {
        const heading = document.createElement("p");
        const link = document.createElement("a");
        link.href = titleLink.href;
        link.textContent = titleLink.title || titleLink.textContent.trim();
        const strong = document.createElement("strong");
        strong.appendChild(link);
        heading.appendChild(strong);
        textCell.push(heading);
      }
      if (tags.length > 0) {
        const tagText = document.createElement("p");
        tagText.textContent = tags.map((tag) => tag.textContent.trim()).join(", ");
        textCell.push(tagText);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-recipe", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/recipes-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".camerascan-popup",
        ".lightbox__overlay",
        "#onetrust-consent-sdk",
        "#chat-widget-container",
        ".js-page-preview",
        "#livechat-eye-catcher",
        ".lightbox.section",
        ".recipefiltersuggestion.section"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.main-header-v5",
        "footer",
        ".breadcrumb-wrapper-v2",
        ".main-header-pusher",
        ".bottom-nav-list",
        ".munchkin-label",
        ".click-cover",
        ".recipebook-login-section",
        "iframe",
        "link",
        "noscript",
        // Remove interactive filter UI elements (JS-driven, non-authorable)
        ".recipe-overview__filter",
        ".recipe__filter",
        ".js-item-list-filter",
        ".list-filter__toggle-alt",
        ".js-list-filter-location-error",
        // Remove app install prompts and tracking pixels
        ".homescreen-lightbox",
        ".pwa-popup",
        'img[src*="px.ads.linkedin"]',
        'img[src*="sprite.png"]'
      ]);
    }
  }

  // tools/importer/transformers/recipes-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var SELECTOR_FALLBACKS = {
    "div.recipeslandingpage.section": ".page-header_recipeoverview",
    "div.recipeslister.section": ".product__lister.recipes"
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let sectionEl = element.querySelector(section.selector);
        if (!sectionEl && SELECTOR_FALLBACKS[section.selector]) {
          sectionEl = element.querySelector(SELECTOR_FALLBACKS[section.selector]);
        }
        if (!sectionEl) continue;
        if (section.style) {
          const document = element.ownerDocument;
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const document = element.ownerDocument;
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-recipes.js
  var parsers = {
    "carousel-recipe": parse,
    "cards-recipe": parse2
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "recipes",
    description: "Recipes landing page with search functionality and recipe card grid for food service professionals",
    urls: [
      "https://www.unileverfoodsolutions.co.uk/recipes.html"
    ],
    blocks: [
      {
        name: "carousel-recipe",
        instances: ["div.featured-item-slider__wrapper"]
      },
      {
        name: "cards-recipe",
        instances: ["div.product__lister.recipes"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Title",
        selector: "div.recipeslandingpage.section",
        style: null,
        blocks: [],
        defaultContent: ["h1"]
      },
      {
        id: "section-2",
        name: "Top Recipes Carousel",
        selector: "div.toprecipes.section",
        style: null,
        blocks: ["carousel-recipe"],
        defaultContent: ["h2.featured-item-slider__title"]
      },
      {
        id: "section-3",
        name: "Recipe Listing Grid",
        selector: "div.recipeslister.section",
        style: null,
        blocks: ["cards-recipe"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
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
  var import_recipes_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
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
        transform2.call(null, "afterTransform", main, __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE }));
      } catch (e) {
        console.error("Section transformer failed:", e);
      }
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_recipes_exports);
})();
