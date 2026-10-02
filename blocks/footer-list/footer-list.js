import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Determines which kind of footer-list child a row represents. Prefers the
 * authoring-time model name (present while editing in the Universal Editor,
 * even before the item has any content) and falls back to inspecting the
 * rendered content shape (used on the published site, where instrumentation
 * attributes are stripped). Rows that match neither default to "item" so
 * they are never silently dropped - e.g. a newly-added, still-empty item.
 * @param {Element} row The row element
 * @returns {'image'|'cta'|'item'} The row's kind
 */
function classifyRow(row) {
  const model = row.dataset.aueModel;
  if (model === 'footer-list-logo') return 'image';
  if (model === 'footer-list-cta') return 'cta';
  if (model === 'footer-list-item') return 'item';
  if (row.querySelector('picture')) return 'image';
  if (row.querySelector('a.primary, a.secondary')) return 'cta';
  return 'item';
}

export default function decorate(block) {
  // children can be authored/reordered freely (Logo, Footer List Item, CTA
  // Button); classify each by type rather than by position or content so
  // that empty, not-yet-authored items remain visible/selectable too.
  const rows = [...block.children];
  const kinds = rows.map((row) => classifyRow(row));
  const imageRow = rows.find((row, i) => kinds[i] === 'image');
  const ctaRow = rows.find((row, i) => kinds[i] === 'cta' && row !== imageRow);
  const itemRows = rows.filter((row) => row !== imageRow && row !== ctaRow);

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
