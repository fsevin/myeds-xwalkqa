import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // each authored field (image, text, cta) renders as its own direct child
  // row; the image row becomes the image column, while the remaining rows
  // (heading/eyebrow text and the CTA button) are re-parented - not cloned,
  // so Universal Editor instrumentation is preserved - into a single text
  // column so they share one styled panel.
  const rows = [...block.children];
  const imageRow = rows.find((row) => row.querySelector('picture'));
  if (imageRow) imageRow.className = 'promo-banner-image';

  const textCol = document.createElement('div');
  textCol.className = 'promo-banner-text';
  rows.filter((row) => row !== imageRow).forEach((row) => textCol.append(row));
  block.append(textCol);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
