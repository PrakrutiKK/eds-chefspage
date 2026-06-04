/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: recipe-detail sections
 * Inserts section breaks (<hr>) and Section Metadata blocks based on
 * the recipe-detail template sections from page-templates.json.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Template sections:
 *   1. "Recipe Hero" - selector: div.recipe-detailv3 - style: "dark"
 *   2. "Recipe Content" - selector: div.recipe-detailv3__recipe - style: null
 *   3. "Related Recipes" - selector: div.relatedrecipes.section - style: null
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const document = element.ownerDocument;
    const sections = template.sections;

    // Process sections in reverse order to maintain DOM position stability
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(sectionMetadata);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
