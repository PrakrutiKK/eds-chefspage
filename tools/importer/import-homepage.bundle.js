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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const cells = [];
    const slides = [];
    const visibleLeft = element.querySelector(":scope > .hero_left");
    const visibleRight = element.querySelector(":scope > .hero_right");
    if (visibleLeft) slides.push(visibleLeft);
    if (visibleRight) slides.push(visibleRight);
    const hiddenSlides = element.querySelectorAll(":scope > ul.hidden > li.js-hero-message");
    hiddenSlides.forEach((slide) => slides.push(slide));
    slides.forEach((slide) => {
      const oblongFigure = slide.querySelector("figure.hero__image-oblong");
      const oblongImg = oblongFigure ? oblongFigure.querySelector("img.oblong") : null;
      const mediaFrag = document.createDocumentFragment();
      mediaFrag.appendChild(document.createComment(" field:media_image "));
      if (oblongImg) {
        const img = document.createElement("img");
        img.src = oblongImg.getAttribute("src") || "";
        img.alt = oblongImg.getAttribute("alt") || "";
        mediaFrag.appendChild(img);
      }
      const contentFrag = document.createDocumentFragment();
      contentFrag.appendChild(document.createComment(" field:content_text "));
      const heroBody = slide.querySelector(".hero__overlay .hero__body");
      if (heroBody && heroBody.innerHTML.trim()) {
        const bodyChildren = Array.from(heroBody.children);
        bodyChildren.forEach((child) => {
          contentFrag.appendChild(child.cloneNode(true));
        });
      }
      const ctaButton = slide.querySelector(".hero__overlay > a.button");
      if (ctaButton) {
        const link = document.createElement("a");
        link.href = ctaButton.getAttribute("href") || "";
        link.title = ctaButton.getAttribute("title") || "";
        link.textContent = ctaButton.textContent.trim();
        contentFrag.appendChild(link);
      } else {
        const imgLink = oblongFigure ? oblongFigure.querySelector("a[href]") : slide.querySelector("figure.hero__image-square a[href]");
        if (imgLink) {
          const link = document.createElement("a");
          link.href = imgLink.getAttribute("href") || "";
          const rawTitle = imgLink.getAttribute("title") || "";
          link.title = rawTitle;
          const anchorText = imgLink.textContent.trim();
          link.textContent = anchorText || "Learn more";
          contentFrag.appendChild(link);
        }
      }
      cells.push([mediaFrag, contentFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-inspiration.js
  function parse2(element, { document }) {
    const leftCol = element.querySelector(".col-span-8.js-inspiration-container");
    const featuredFigure = leftCol ? leftCol.querySelector("figure.item-list__image") : null;
    const featuredImg = featuredFigure ? featuredFigure.querySelector(".hide-mobile img.img") || featuredFigure.querySelector("img.img") : null;
    const categoryLink = leftCol ? leftCol.querySelector("ul.article-meta li:not(.js-status) a") : null;
    const articleBody = leftCol ? leftCol.querySelector(".item-list__body") : null;
    const articleTitleLink = articleBody ? articleBody.querySelector(":scope > a[href]") : null;
    const articleTitle = articleBody ? articleBody.querySelector("h4.item-list__title") : null;
    const articleDesc = articleBody ? articleBody.querySelector("span.read-more") : null;
    const leftContent = document.createDocumentFragment();
    if (featuredImg) {
      const img = document.createElement("img");
      img.src = featuredImg.src || featuredImg.getAttribute("src");
      img.alt = featuredImg.alt || featuredImg.getAttribute("alt") || "";
      leftContent.appendChild(img);
    }
    if (categoryLink) {
      const p = document.createElement("p");
      const catA = document.createElement("a");
      catA.href = categoryLink.href || categoryLink.getAttribute("href");
      catA.textContent = categoryLink.textContent.trim();
      p.appendChild(catA);
      leftContent.appendChild(p);
    }
    if (articleTitle) {
      const h4 = document.createElement("h4");
      if (articleTitleLink) {
        const a = document.createElement("a");
        a.href = articleTitleLink.href || articleTitleLink.getAttribute("href");
        a.textContent = articleTitle.textContent.trim();
        h4.appendChild(a);
      } else {
        h4.textContent = articleTitle.textContent.trim();
      }
      leftContent.appendChild(h4);
    }
    if (articleDesc) {
      const p = document.createElement("p");
      p.textContent = articleDesc.textContent.trim();
      leftContent.appendChild(p);
    }
    const rightCol = element.querySelector(".col-span-4.last-col");
    const rightContent = document.createDocumentFragment();
    const recipesHeading = rightCol ? rightCol.querySelector(".item-list__header.recipes h3") : null;
    if (recipesHeading) {
      const h3 = document.createElement("h3");
      h3.textContent = recipesHeading.textContent.trim();
      rightContent.appendChild(h3);
    }
    const recipeItems = rightCol ? rightCol.querySelectorAll("ul.item-list__grid > li") : [];
    recipeItems.forEach((li) => {
      const recipeImg = li.querySelector("figure.item-list__image img.img");
      const recipeLink = li.querySelector(".item-list__body a[href]");
      const recipeTitle = li.querySelector(".item-list__body h4.item-list__title");
      if (recipeImg || recipeTitle) {
        const itemDiv = document.createElement("div");
        if (recipeImg) {
          const img = document.createElement("img");
          img.src = recipeImg.src || recipeImg.getAttribute("src");
          img.alt = recipeImg.alt || recipeImg.getAttribute("alt") || "";
          itemDiv.appendChild(img);
        }
        if (recipeTitle) {
          const p = document.createElement("p");
          if (recipeLink) {
            const a = document.createElement("a");
            a.href = recipeLink.href || recipeLink.getAttribute("href");
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
    const cells = [
      [leftContent, rightContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-inspiration", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse3(element, { document }) {
    const cells = [];
    const section = element.closest(".section") || element.closest('[class*="productcarousel"]');
    const page = element.ownerDocument;
    let productTiles = element.querySelectorAll(".product-tile");
    if (!productTiles.length && section) {
      productTiles = section.querySelectorAll(".product-tile");
    }
    if (!productTiles.length) {
      const relatedSection = page.querySelector(".relatedproducts.section .js-related-products");
      if (relatedSection) {
        productTiles = relatedSection.querySelectorAll(".product-tile");
      }
    }
    if (productTiles.length > 0) {
      productTiles.forEach((tile) => {
        const row = [];
        const imgEl = tile.querySelector(".product__image img");
        if (imgEl) {
          const imgClone = imgEl.cloneNode(true);
          const frag = document.createDocumentFragment();
          frag.appendChild(document.createComment(" field:image "));
          frag.appendChild(imgClone);
          row.push(frag);
        } else {
          row.push("");
        }
        const contentFrag = document.createDocumentFragment();
        const heading = tile.querySelector(".product__brand-overlay h2");
        if (heading) {
          const headingClone = heading.cloneNode(true);
          contentFrag.appendChild(document.createComment(" field:title "));
          contentFrag.appendChild(headingClone);
        }
        const buyBtn = tile.querySelector(".sel-buy-it-now-button");
        if (buyBtn) {
          const buyClone = buyBtn.cloneNode(true);
          if (buyClone.getAttribute("href") === "javascript:;") {
            buyClone.setAttribute("href", "#");
          }
          contentFrag.appendChild(document.createComment(" field:buyLink "));
          contentFrag.appendChild(buyClone);
        }
        const specLink = tile.querySelector(".sel-see-more-button");
        if (specLink) {
          const specClone = specLink.cloneNode(true);
          contentFrag.appendChild(document.createComment(" field:specLink "));
          contentFrag.appendChild(specClone);
        }
        row.push(contentFrag);
        cells.push(row);
      });
    } else {
      const img = element.querySelector("img") || section && section.querySelector(".product-carrousel img");
      const ctaLink = element.querySelector("a.button") || element.parentElement && element.parentElement.querySelector("a.button");
      if (img || ctaLink) {
        const row = [];
        if (img) {
          const imgFrag = document.createDocumentFragment();
          imgFrag.appendChild(document.createComment(" field:image "));
          imgFrag.appendChild(img.cloneNode(true));
          row.push(imgFrag);
        } else {
          row.push("");
        }
        if (ctaLink) {
          const ctaFrag = document.createDocumentFragment();
          ctaFrag.appendChild(document.createComment(" field:buyLink "));
          ctaFrag.appendChild(ctaLink.cloneNode(true));
          row.push(ctaFrag);
        } else {
          row.push("");
        }
        cells.push(row);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-newsletter.js
  function parse4(element, { document }) {
    const bgImage = element.querySelector("figure.hero__image-oblong img.img, figure img.img, .hero__image-oblong img");
    const heading = element.querySelector(".hero__overlay h3, .hero__overlay h2, .hero__overlay h1");
    const bodyText = element.querySelector(".hero__overlay .hero__body p, .hero__overlay .hero__body, .hero__overlay p");
    const ctaLink = element.querySelector('.hero__overlay a.button, .hero__overlay a[class*="button"], .hero__overlay a');
    const imageCell = [];
    if (bgImage) {
      const imageComment = document.createComment(" field:image ");
      const frag = document.createDocumentFragment();
      frag.appendChild(imageComment);
      frag.appendChild(bgImage);
      imageCell.push(frag);
    }
    const textCell = [];
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) {
      textFrag.appendChild(heading);
    }
    if (bodyText) {
      textFrag.appendChild(bodyText);
    }
    if (ctaLink) {
      textFrag.appendChild(ctaLink);
    }
    textCell.push(textFrag);
    const cells = [];
    if (imageCell.length) {
      cells.push(imageCell);
    } else {
      cells.push([""]);
    }
    cells.push(textCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-newsletter", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-brand.js
  function parse5(element, { document }) {
    const brandItems = element.querySelectorAll(":scope > li, li");
    const cells = [];
    brandItems.forEach((item) => {
      const anchor = item.querySelector("a[href]");
      if (!anchor) return;
      const img = anchor.querySelector("img, img.img-loaded");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const picture = document.createElement("picture");
        const newImg = document.createElement("img");
        newImg.src = img.src || img.getAttribute("src") || "";
        newImg.alt = img.getAttribute("title") || img.getAttribute("alt") || "";
        picture.appendChild(newImg);
        const p2 = document.createElement("p");
        p2.appendChild(picture);
        imageCell.appendChild(p2);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const brandName = anchor.getAttribute("title") || anchor.textContent.trim();
      const link = document.createElement("a");
      link.href = anchor.href || anchor.getAttribute("href") || "";
      link.textContent = brandName;
      const p = document.createElement("p");
      p.appendChild(link);
      textCell.appendChild(p);
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-brand", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ufs-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk"]);
      WebImporter.DOMUtils.remove(element, [".lightbox__overlay"]);
      WebImporter.DOMUtils.remove(element, [".camerascan-popup"]);
      WebImporter.DOMUtils.remove(element, ["#chat-widget-container", "#livechat-eye-catcher"]);
      WebImporter.DOMUtils.remove(element, [".floating-notification"]);
      WebImporter.DOMUtils.remove(element, [".homescreen-lightbox"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header.main-header-v5"]);
      WebImporter.DOMUtils.remove(element, ["footer.footer"]);
      WebImporter.DOMUtils.remove(element, [".main-header-pusher"]);
      WebImporter.DOMUtils.remove(element, [".js-page-preview"]);
      WebImporter.DOMUtils.remove(element, [".munchkin-label"]);
      WebImporter.DOMUtils.remove(element, [".bottom-nav-parent"]);
      WebImporter.DOMUtils.remove(element, [".cookiebarconfig"]);
      WebImporter.DOMUtils.remove(element, [".modularformconfig"]);
      WebImporter.DOMUtils.remove(element, [".multibuyitnowconfig"]);
      WebImporter.DOMUtils.remove(element, ["link"]);
      WebImporter.DOMUtils.remove(element, ["iframe"]);
      WebImporter.DOMUtils.remove(element, ["noscript"]);
      const trackingPixels = element.querySelectorAll('img[src*="px.ads.linkedin.com"]');
      trackingPixels.forEach((el) => el.remove());
    }
  }

  // tools/importer/transformers/ufs-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { sections } = template;
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

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "columns-inspiration": parse2,
    "carousel-product": parse3,
    "hero-newsletter": parse4,
    "cards-brand": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage with hero banner, recipe carousels, themed content cards, and promotional sections for food service professionals",
    urls: [
      "https://www.unileverfoodsolutions.co.uk/"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: ["div.hero.section .hero.hero-banner-bg"]
      },
      {
        name: "columns-inspiration",
        instances: ["div.inspiration.section .pagecol-wrapper.item-list__columns.chefs-inspiration"]
      },
      {
        name: "carousel-product",
        instances: ["div.productcarousel.section .product-carrousel"]
      },
      {
        name: "hero-newsletter",
        instances: ["div.hero.section .hero.pagecol-wrapper"]
      },
      {
        name: "cards-brand",
        instances: ["div.brandlistv2.section .brand-list__short"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Intro",
        selector: "div.introtext.section",
        style: null,
        blocks: [],
        defaultContent: ["div.introtext.section h1", "div.introtext.section h2"]
      },
      {
        id: "section-2",
        name: "Hero Carousel Banner",
        selector: "div.hero.section:first-of-type",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Chef Inspiration and Recipes",
        selector: "div.inspiration.section",
        style: null,
        blocks: ["columns-inspiration"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Recommended Products",
        selector: "div.productcarousel.section",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Newsletter Signup Banner",
        selector: "div.hero.section:nth-of-type(2)",
        style: null,
        blocks: ["hero-newsletter"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Brand Logo Bar",
        selector: "div.brandlistv2.section",
        style: null,
        blocks: ["cards-brand"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Trends CTA Banner",
        selector: "div.vanityurlconfigitem.section",
        style: "dark",
        blocks: [],
        defaultContent: ["div.vanityurlconfigitem.section a img"]
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = "/homepage";
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
  return __toCommonJS(import_homepage_exports);
})();
