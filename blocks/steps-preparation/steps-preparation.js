export default function decorate(block) {
  const rows = [...block.children];
  const stepsContainer = document.createElement('div');
  stepsContainer.classList.add('steps-list');

  let stepNumber = 0;

  rows.forEach((row) => {
    const cells = [...row.children];
    const content = cells[0];
    if (!content) return;

    const h4 = content.querySelector('h4');
    if (h4) {
      stepNumber += 1;
      const stepItem = document.createElement('div');
      stepItem.classList.add('step-item');

      const badge = document.createElement('span');
      badge.classList.add('step-badge');
      badge.textContent = stepNumber;

      const stepContent = document.createElement('div');
      stepContent.classList.add('step-content');

      stepContent.append(...content.childNodes);
      stepItem.append(badge, stepContent);
      stepsContainer.append(stepItem);
    } else {
      const tags = content.querySelectorAll('a');
      if (tags.length > 0) {
        const tagContainer = document.createElement('div');
        tagContainer.classList.add('step-tags');
        tags.forEach((tag) => {
          tag.classList.add('step-tag');
          tagContainer.append(tag);
        });
        stepsContainer.append(tagContainer);
      } else {
        stepsContainer.append(...content.childNodes);
      }
    }

    row.remove();
  });

  block.append(stepsContainer);
}
