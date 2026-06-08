import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-article-card-image';
      } else if (div.querySelector('img') || div.querySelector('picture')) {
        div.className = 'cards-article-card-image';
      } else {
        div.className = 'cards-article-card-body';
      }
    });

    const bodyDiv = li.querySelector('.cards-article-card-body');
    const imageDiv = li.querySelector('.cards-article-card-image');
    const link = bodyDiv ? bodyDiv.querySelector('a') : null;

    if (link) {
      link.classList.remove('button', 'primary', 'secondary', 'accent');
      const wrapper = link.closest('.button-wrapper');
      if (wrapper) wrapper.classList.remove('button-wrapper');
    }

    if (imageDiv && link) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        const a = document.createElement('a');
        a.href = link.href;
        a.setAttribute('aria-label', link.textContent);
        a.append(picture);
        imageDiv.append(a);
      }
    }

    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
