// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

// keep track globally of the number of tab blocks on the page
let tabBlockCnt = 0;

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-brand-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt += 1}`;

  // the first cell of each row is the title of the tab
  const tabHeadings = [...block.children]
    .filter((child) => child.firstElementChild && child.firstElementChild.children.length > 0)
    .map((child) => child.firstElementChild);

  tabHeadings.forEach((tab, i) => {
    const id = `tabpanel-${tabBlockCnt}-tab-${i + 1}`;

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-brand-panel';
    tabpanel.id = id;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-brand-tab';
    button.id = `tab-${id}`;

    const link = tab.querySelector('a');
    let label = link ? link.textContent.trim() : tab.textContent.trim();
    if (link) {
      try {
        const url = new URL(link.href);
        if (label === link.href || label === url.href) {
          const segments = url.pathname.replace(/\.html$/, '').split('/').filter(Boolean);
          const lastSegment = segments[segments.length - 1] || '';
          label = lastSegment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
          if (segments.length === 1 || (segments.length === 2 && !segments[1])) {
            label = 'Inspiration From Our Brands';
          }
          const h1 = document.querySelector('h1');
          if (h1 && i === 0) label = h1.textContent.trim();
        }
      } catch { /* use original label */ }
      button.dataset.href = link.href;
    }
    button.textContent = label;

    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      if (button.dataset.href) {
        window.location.href = button.dataset.href;
      } else {
        block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
          panel.setAttribute('aria-hidden', true);
        });
        tablist.querySelectorAll('button').forEach((btn) => {
          btn.setAttribute('aria-selected', false);
        });
        tabpanel.setAttribute('aria-hidden', false);
        button.setAttribute('aria-selected', true);
      }
    });

    // add the new tab list button, to the tablist
    tablist.append(button);

    // remove the tab heading from the dom, which also removes it from the UE tree
    tab.remove();

    // remove the instrumentation from the button's h1, h2 etc (this removes it from the tree)
    if (button.firstElementChild) {
      moveInstrumentation(button.firstElementChild, null);
    }
  });

  block.prepend(tablist);
}
