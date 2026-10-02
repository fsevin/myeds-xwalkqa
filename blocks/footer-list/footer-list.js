import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // children can be authored/reordered freely (Logo, Footer List Item, CTA
  // Button), so rows are classified by their rendered content rather than
  // by position: the logo row has a <picture>, the CTA row's link is
  // wrapped as a primary/secondary button, and everything else is a plain
  // footer link.
  const rows = [...block.children];
  const imageRow = rows.find((row) => row.querySelector('picture'));
  const ctaRow = rows.find(
    (row) => row !== imageRow && row.querySelector('a.primary, a.secondary'),
  );
  const itemRows = rows.filter(
    (row) => row !== imageRow && row !== ctaRow && row.querySelector('a'),
  );

  if (imageRow) imageRow.className = 'footer-list-image';
  if (ctaRow) ctaRow.className = 'footer-list-cta';

  const ul = document.createElement('ul');
  ul.className = 'footer-list-items';
  itemRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    ul.append(li);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'footer-list-wrapper';
  if (itemRows.length) wrapper.append(ul);
  if (ctaRow) wrapper.append(ctaRow);

  const children = [];
  if (imageRow) children.push(imageRow);
  children.push(wrapper);
  block.replaceChildren(...children);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
