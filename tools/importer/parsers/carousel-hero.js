/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-hero
 * Base block: carousel
 * Source: https://www.unileverfoodsolutions.co.uk/
 * Selector: div.hero.section .hero.hero-banner-bg
 * Generated: 2026-06-09
 *
 * Container block (carousel) with child slide items.
 * Each slide row has 2 columns: [media (background image)] [content (text + CTA)]
 *
 * UE Model fields per item:
 *   - media_image (reference) + media_imageAlt (collapsed into img alt)
 *   - content_text (richtext - heading, description, CTA links)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Collect all slides from the carousel
  // Visible slides are in div.hero_left and div.hero_right
  // Additional slides are in ul.hidden > li.js-hero-message
  const slides = [];

  // Get the two visible slide containers (batman = left, robin = right)
  const visibleLeft = element.querySelector(':scope > .hero_left');
  const visibleRight = element.querySelector(':scope > .hero_right');

  if (visibleLeft) slides.push(visibleLeft);
  if (visibleRight) slides.push(visibleRight);

  // Get hidden slides from the ul.hidden list
  const hiddenSlides = element.querySelectorAll(':scope > ul.hidden > li.js-hero-message');
  hiddenSlides.forEach((slide) => slides.push(slide));

  // Process each slide into a row with 2 columns: [media] [content]
  slides.forEach((slide) => {
    // --- Column 1: Media (background image) ---
    // Use the oblong (landscape) image as the primary background image
    // Take only the first img from hero__image-oblong to avoid responsive duplicates
    const oblongFigure = slide.querySelector('figure.hero__image-oblong');
    const oblongImg = oblongFigure ? oblongFigure.querySelector('img.oblong') : null;

    const mediaFrag = document.createDocumentFragment();
    mediaFrag.appendChild(document.createComment(' field:media_image '));
    if (oblongImg) {
      // Clone just the one image to avoid duplicates from responsive containers
      const img = document.createElement('img');
      img.src = oblongImg.getAttribute('src') || '';
      img.alt = oblongImg.getAttribute('alt') || '';
      mediaFrag.appendChild(img);
    }

    // --- Column 2: Content (text + CTA) ---
    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(document.createComment(' field:content_text '));

    // Extract overlay text content from hero__body
    const heroBody = slide.querySelector('.hero__overlay .hero__body');
    if (heroBody && heroBody.innerHTML.trim()) {
      // Append any headings, paragraphs from the body
      const bodyChildren = Array.from(heroBody.children);
      bodyChildren.forEach((child) => {
        contentFrag.appendChild(child.cloneNode(true));
      });
    }

    // Extract CTA button link from the overlay
    const ctaButton = slide.querySelector('.hero__overlay > a.button');
    if (ctaButton) {
      const link = document.createElement('a');
      link.href = ctaButton.getAttribute('href') || '';
      link.title = ctaButton.getAttribute('title') || '';
      link.textContent = ctaButton.textContent.trim();
      contentFrag.appendChild(link);
    } else {
      // Fallback: get link from the oblong image's parent anchor or square image anchor
      const imgLink = oblongFigure
        ? oblongFigure.querySelector('a[href]')
        : slide.querySelector('figure.hero__image-square a[href]');
      if (imgLink) {
        const link = document.createElement('a');
        link.href = imgLink.getAttribute('href') || '';
        // Use title attribute for link title, but use cleaner text for display
        const rawTitle = imgLink.getAttribute('title') || '';
        link.title = rawTitle;
        // Extract readable text: prefer anchor text content, else 'Learn more'
        const anchorText = imgLink.textContent.trim();
        link.textContent = anchorText || 'Learn more';
        contentFrag.appendChild(link);
      }
    }

    cells.push([mediaFrag, contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
