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

  // tools/importer/import-recipe-detail.js
  var import_recipe_detail_exports = {};
  __export(import_recipe_detail_exports, {
    default: () => import_recipe_detail_default
  });

  // tools/importer/parsers/hero-recipe.js
  function parse(element, { document }) {
    const picture = element.querySelector(".recipe-image-v2 picture, .recipe-detailv3__video-fallback-img picture, .recipe-detailv3__box-two picture");
    const img = picture || element.querySelector('.recipe-image-v2 img, .recipe-detailv3__video-fallback-img img, img[class*="img-loaded"]');
    const heading = element.querySelector("h1, .recipe-description h1, .recipe-detailv3__description h1");
    const cells = [];
    if (img) {
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(img);
      cells.push([imageFrag]);
    }
    if (heading) {
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      textFrag.appendChild(heading);
      cells.push([textFrag]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-recipe", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-ingredients.js
  function parse2(element, { document }) {
    const cells = [];
    const tableContainer = element.querySelector(".tablesof-content");
    if (!tableContainer) {
      const block2 = WebImporter.Blocks.createBlock(document, { name: "table-ingredients", cells: [] });
      element.replaceWith(block2);
      return;
    }
    const children = Array.from(tableContainer.children);
    for (const child of children) {
      if (child.classList.contains("header")) continue;
      if (child.classList.contains("new-content") || child.classList.contains("js-new-content")) continue;
      if (child.tagName === "H4") {
        const headingText = child.textContent.trim();
        if (headingText) {
          const h4 = document.createElement("h4");
          h4.textContent = headingText;
          cells.push([h4]);
        }
        continue;
      }
      if (child.classList.contains("header-list") || child.classList.contains("js-header-list")) {
        const brandedName = child.querySelector(".prodct-tileingredient .name.js-accordion-trigger");
        const plainName = child.querySelector(".col-span-3.name");
        const nameEl = brandedName || plainName;
        const qtyEl = child.querySelector(".col-span-2.qty.js-qty, .col-span-2.qty");
        if (nameEl) {
          const ingredientName = nameEl.textContent.trim();
          const quantity = qtyEl ? qtyEl.textContent.trim() : "";
          if (ingredientName) {
            let col1Content;
            if (brandedName) {
              const productLink = child.querySelector(".product-title a");
              if (productLink) {
                const link = document.createElement("a");
                link.href = productLink.getAttribute("href") || "";
                link.textContent = ingredientName;
                col1Content = link;
              } else {
                col1Content = ingredientName;
              }
            } else {
              col1Content = ingredientName;
            }
            cells.push([col1Content, quantity]);
          }
        }
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "table-ingredients", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-chef.js
  function parse3(element, { document }) {
    const chefContainer = element.closest(".recipe-v3-chef-container") || element.closest(".recipe-v3-chef") || element.parentElement;
    const chefImage = chefContainer ? chefContainer.querySelector("img.rounded_img, .chef-image img, img[alt]") : null;
    const chefName = element.matches("h3.chef-name, h3") ? element : chefContainer ? chefContainer.querySelector("h3.chef-name, h3, .chef-name") : element;
    const col1 = [];
    if (chefImage) {
      col1.push(chefImage);
    }
    const col2 = [];
    if (chefName) {
      const heading = document.createElement("h3");
      heading.textContent = chefName.textContent.trim();
      col2.push(heading);
    }
    const cells = [
      [col1, col2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-chef", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-recipe.js
  function parse4(element, { document }) {
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

  // tools/importer/transformers/recipe-detail-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk"]);
      WebImporter.DOMUtils.remove(element, [".camerascan-popup"]);
      WebImporter.DOMUtils.remove(element, [".lightbox__overlay"]);
      WebImporter.DOMUtils.remove(element, [".js-costcalculate-lightbox"]);
      WebImporter.DOMUtils.remove(element, [".js-page-preview.page-preview-overlay"]);
      WebImporter.DOMUtils.remove(element, [".floating-notification"]);
      WebImporter.DOMUtils.remove(element, [".homescreen-lightbox"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header.main-header-v5"]);
      WebImporter.DOMUtils.remove(element, [".main-header-pusher"]);
      WebImporter.DOMUtils.remove(element, ["footer.footer"]);
      WebImporter.DOMUtils.remove(element, [".breadcrumb-wrapper-v2"]);
      WebImporter.DOMUtils.remove(element, [".content-tools"]);
      WebImporter.DOMUtils.remove(element, [".tools.js-social-share"]);
      WebImporter.DOMUtils.remove(element, [".bottom-nav-parent"]);
      WebImporter.DOMUtils.remove(element, ["#chat-widget-container"]);
      WebImporter.DOMUtils.remove(element, ["#livechat-eye-catcher"]);
      WebImporter.DOMUtils.remove(element, [".munchkin-label"]);
      WebImporter.DOMUtils.remove(element, [".recipebook-login"]);
      WebImporter.DOMUtils.remove(element, [".pagecol-wrapper.hide-print"]);
      WebImporter.DOMUtils.remove(element, [".pdp-section.hide-print"]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript"]);
    }
  }

  // tools/importer/transformers/recipe-detail-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const document = element.ownerDocument;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-recipe-detail.js
  var parsers = {
    "hero-recipe": parse,
    "table-ingredients": parse2,
    "columns-chef": parse3,
    "carousel-recipe": parse4
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "recipe-detail",
    description: "Recipe detail page with hero image, ingredients table, preparation steps, chef attribution, and related recipes carousel",
    urls: [
      "https://www.unileverfoodsolutions.co.uk/recipe/barley-greens-bowl-with-matcha-yuzu-dressing-R90033590.html"
    ],
    blocks: [
      {
        name: "hero-recipe",
        instances: ["div.page-header_recipe"]
      },
      {
        name: "table-ingredients",
        instances: ["#ingredients-content"]
      },
      {
        name: "columns-chef",
        instances: [".chef-name"]
      },
      {
        name: "carousel-recipe",
        instances: ["div.relatedrecipes.section .featured-item-slider__wrapper"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Recipe Hero",
        selector: "div.recipe-detailv3",
        style: "dark",
        blocks: ["hero-recipe"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Recipe Content",
        selector: "div.recipe-detailv3__recipe",
        style: null,
        blocks: ["table-ingredients", "columns-chef"],
        defaultContent: ["p.recipe-desc", "#preparation-content"]
      },
      {
        id: "section-3",
        name: "Related Recipes",
        selector: "div.relatedrecipes.section",
        style: null,
        blocks: ["carousel-recipe"],
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
  var import_recipe_detail_default = {
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
  return __toCommonJS(import_recipe_detail_exports);
})();
