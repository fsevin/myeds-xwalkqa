import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // each authored field (image, text) renders as its own direct child row;
  // treat those rows as the two columns of the banner.
  [...block.children].forEach((row) => {
    row.className = row.querySelector('picture') ? 'promo-banner-image' : 'promo-banner-text';
  });
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
