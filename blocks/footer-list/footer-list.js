import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // authored rows always appear in this fixed order: the logo image row
  // first, followed by the collapsed CTA link row (cta/ctaText/ctaTitle/
  // ctaType fields), with any footer-list-item rows appended after - so the
  // first link-bearing row (after the image) is reliably the CTA.
  const rows = [...block.children];
  const imageRow = rows.find((row) => row.querySelector('picture'));
  const linkRows = rows.filter((row) => row !== imageRow && row.querySelector('a'));
  const [ctaRow, ...itemRows] = linkRows;

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
