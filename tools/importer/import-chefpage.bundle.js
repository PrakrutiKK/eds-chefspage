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

  // tools/importer/import-chefpage.js
  var import_chefpage_exports = {};
  __export(import_chefpage_exports, {
    default: () => import_chefpage_default
  });

  // tools/importer/parsers/cards-theme.js
  function parse(element, { document }) {
    const cardItems = element.querySelectorAll(":scope > li.highlight-content");
    const cells = [];
    cardItems.forEach((item) => {
      const figure = item.querySelector("figure.item-list__image");
      const desktopImg = figure ? figure.querySelector("img.img:not(.hide-above-mobile)") : null;
      const body = item.querySelector("div.item-list__body");
      const overlaySpan = figure ? figure.querySelector("span.item-list__image-overlay > span") : null;
      const titleText = overlaySpan ? overlaySpan.textContent.trim() : "";
      const descParagraph = body ? body.querySelector("p > a") : null;
      const descText = descParagraph ? descParagraph.textContent.trim() : "";
      const ctaLink = body ? body.querySelector("a:has(span.read-more), a > span.read-more") : null;
      let ctaAnchor = null;
      if (ctaLink) {
        ctaAnchor = ctaLink.tagName === "A" ? ctaLink : ctaLink.closest("a");
      }
      if (!ctaAnchor && body) {
        const allLinks = body.querySelectorAll(":scope > a");
        for (const link of allLinks) {
          if (link.querySelector("span.read-more")) {
            ctaAnchor = link;
            break;
          }
        }
      }
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (desktopImg) {
        imageCell.appendChild(desktopImg);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (titleText) {
        const titleP = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = titleText;
        titleP.appendChild(strong);
        textCell.appendChild(titleP);
      }
      if (descText) {
        const p = document.createElement("p");
        p.textContent = descText;
        textCell.appendChild(p);
      }
      if (ctaAnchor) {
        const ctaP = document.createElement("p");
        const link = document.createElement("a");
        link.href = ctaAnchor.href || ctaAnchor.getAttribute("href");
        link.textContent = ctaAnchor.textContent.trim();
        ctaP.appendChild(link);
        textCell.appendChild(ctaP);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-theme", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/chefspage-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".camerascan-popup",
        ".lightbox__overlay",
        "#onetrust-consent-sdk",
        "#chat-widget-container",
        ".js-page-preview"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".breadcrumb-wrapper-v2",
        ".main-header-pusher",
        ".js-minicart-component",
        ".bottom-nav-list",
        ".munchkin-label",
        ".click-cover",
        ".page-content",
        "#savivaAPIName",
        "#mercantoAPIName",
        ".tradepartner-dialog",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/chefspage-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
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

  // tools/importer/import-chefpage.js
  var parsers = {
    "cards-theme": parse
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "chefpage",
    description: "Chef inspiration page with recipes and culinary content for food service professionals",
    urls: [
      "https://www.unileverfoodsolutions.nl/inspiratie-voor-chefs.html"
    ],
    blocks: [
      {
        name: "cards-theme",
        instances: ["ul.item-list__grid"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Header",
        selector: "div.themeheaderversiona.section",
        style: null,
        blocks: [],
        defaultContent: ["div.themeheaderversiona.section h1", "div.themeheaderversiona.section p"]
      },
      {
        id: "section-2",
        name: "Theme Cards Grid",
        selector: "div.allthemes.section",
        style: null,
        blocks: ["cards-theme"],
        defaultContent: ["div.allthemes.section .all-themes__header p"]
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
  var import_chefpage_default = {
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
  return __toCommonJS(import_chefpage_exports);
})();
