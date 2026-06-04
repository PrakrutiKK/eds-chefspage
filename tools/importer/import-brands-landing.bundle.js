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

  // tools/importer/import-brands-landing.js
  var import_brands_landing_exports = {};
  __export(import_brands_landing_exports, {
    default: () => import_brands_landing_default
  });

  // tools/importer/parsers/tabs-brand.js
  function parse(element, { document }) {
    const tabItems = element.querySelectorAll(":scope > ul > li");
    const cells = [];
    tabItems.forEach((item) => {
      const anchor = item.querySelector("a");
      if (!anchor) return;
      const tabCell = document.createDocumentFragment();
      tabCell.appendChild(document.createComment(" field:tab "));
      const link = document.createElement("a");
      link.href = anchor.href || anchor.getAttribute("href") || "";
      link.textContent = anchor.textContent.trim();
      const p = document.createElement("p");
      p.appendChild(link);
      tabCell.appendChild(p);
      cells.push([tabCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-brand", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-theme.js
  function parse2(element, { document }) {
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
        const picture = document.createElement("picture");
        const img = document.createElement("img");
        img.src = desktopImg.src || desktopImg.getAttribute("src");
        img.alt = desktopImg.alt || desktopImg.getAttribute("alt") || "";
        picture.appendChild(img);
        const p = document.createElement("p");
        p.appendChild(picture);
        imageCell.appendChild(p);
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

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document }) {
    const cardItems = element.querySelectorAll("li.item-list__article-item");
    const cells = [];
    cardItems.forEach((item) => {
      const img = item.querySelector("figure.item-list__image img.img, figure img");
      const bodyLink = item.querySelector(".item-list__body > a[href]");
      const titleEl = item.querySelector(".item-list__body h2.item-list__title, .item-list__body .item-list__title");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.src = img.src || img.getAttribute("src");
        imgEl.alt = img.alt || img.getAttribute("alt") || img.title || "";
        picture.appendChild(imgEl);
        const p = document.createElement("p");
        p.appendChild(picture);
        imageCell.appendChild(p);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (bodyLink) {
        const linkP = document.createElement("p");
        const link = document.createElement("a");
        link.href = bodyLink.href || bodyLink.getAttribute("href");
        const titleText = titleEl ? titleEl.textContent.trim() : bodyLink.title || bodyLink.textContent.trim();
        link.textContent = titleText;
        const strong = document.createElement("strong");
        strong.appendChild(link);
        linkP.appendChild(strong);
        textCell.appendChild(linkP);
      } else if (titleEl) {
        const titleP = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = titleEl.textContent.trim();
        titleP.appendChild(strong);
        textCell.appendChild(titleP);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/brands-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#chat-widget-container",
        "#livechat-eye-catcher",
        ".camerascan-popup",
        ".floating-notification",
        ".lightbox__overlay"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.main-header-v5",
        ".main-header-pusher",
        "footer.footer",
        ".breadcrumb-wrapper-v2",
        ".js-page-preview.page-preview-overlay",
        ".homescreen-lightbox",
        ".bottom-nav-parent",
        ".recipebook-login",
        "iframe",
        "link",
        "noscript"
      ]);
      const trackingPixels = element.querySelectorAll('img[src*="px.ads.linkedin.com"]');
      trackingPixels.forEach((el) => el.remove());
    }
  }

  // tools/importer/transformers/brands-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
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

  // tools/importer/import-brands-landing.js
  var parsers = {
    "tabs-brand": parse,
    "cards-theme": parse2,
    "cards-article": parse3
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "brands-landing",
    description: "Brands landing page with navigation tabs, featured content cards grid, and brand category sections",
    urls: [
      "https://www.unileverfoodsolutions.co.uk/about-our-brands.html"
    ],
    blocks: [
      {
        name: "tabs-brand",
        instances: ["nav.theme-sub-navigation"]
      },
      {
        name: "cards-theme",
        instances: ["div.top-content-item-section"]
      },
      {
        name: "cards-article",
        instances: [".item-list--articles"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Header",
        selector: "div.themeheaderversiona.section",
        style: null,
        blocks: ["tabs-brand"],
        defaultContent: ["h1"]
      },
      {
        id: "section-2",
        name: "Featured Content",
        selector: "div.topcontent.section",
        style: null,
        blocks: ["cards-theme"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Brand Articles",
        selector: "div.themearticles.section",
        style: null,
        blocks: ["cards-article"],
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
  var import_brands_landing_default = {
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
  return __toCommonJS(import_brands_landing_exports);
})();
