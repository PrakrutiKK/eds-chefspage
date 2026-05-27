/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: chefspage sections.
 * Inserts section breaks (<hr>) between template sections.
 * All selectors validated against migration-work/cleaned.html.
 *
 * Template sections:
 *   section-1: "Page Header" — selector: div.themeheaderversiona.section (line 877)
 *   section-2: "Theme Cards Grid" — selector: div.allthemes.section (line 886)
 *
 * Neither section has a style, so no Section Metadata blocks are created.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid index shifting
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
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
