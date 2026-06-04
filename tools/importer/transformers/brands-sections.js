/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: brands sections. Inserts section breaks (<hr>) between
 * content sections based on template section definitions from payload.
 *
 * Template: brands-landing
 * Sections from page-templates.json:
 *   1. "Page Header" - selector: div.themeheaderversiona.section (no style)
 *   2. "Featured Content" - selector: div.topcontent.section (no style)
 *   3. "Brand Articles" - selector: div.themearticles.section (no style)
 *
 * Runs in afterTransform only. Processes sections in reverse order to
 * preserve DOM positions when inserting <hr> elements.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to preserve DOM positions
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
