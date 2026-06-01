/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: recipes sections.
 * Inserts section breaks (<hr>) between template sections for the recipes page.
 * All selectors validated against migration-work/cleaned.html.
 *
 * Template sections (from page-templates.json "recipes" template):
 *   section-1: "Page Title" — selector: div.recipeslandingpage.section
 *     Actual DOM: div.page-header_recipeoverview (line 750)
 *   section-2: "Top Recipes Carousel" — selector: div.toprecipes.section (line 764)
 *   section-3: "Recipe Listing Grid" — selector: div.recipeslister.section
 *     Actual DOM: div.product__lister.recipes (line 1986)
 *
 * None of the sections have a style, so no Section Metadata blocks are created.
 *
 * Fallback selectors are used because the template selectors for section-1 and
 * section-3 do not match the actual DOM structure of the live page.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Fallback selector map: template selector -> actual DOM selector from cleaned.html
 */
const SELECTOR_FALLBACKS = {
  'div.recipeslandingpage.section': '.page-header_recipeoverview',
  'div.recipeslister.section': '.product__lister.recipes',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid index shifting
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      // Try the template selector first, then fallback to actual DOM selector
      let sectionEl = element.querySelector(section.selector);
      if (!sectionEl && SELECTOR_FALLBACKS[section.selector]) {
        sectionEl = element.querySelector(SELECTOR_FALLBACKS[section.selector]);
      }
      if (!sectionEl) continue;

      // Insert section-metadata block if section has a style
      if (section.style) {
        const document = element.ownerDocument;
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Insert <hr> before every section except the first
      if (i > 0) {
        const document = element.ownerDocument;
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
