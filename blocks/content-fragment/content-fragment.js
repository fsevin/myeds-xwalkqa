import { createOptimizedPicture } from '../../scripts/aem.js';

const GRAPHQL_ORIGIN = 'https://publish-p223758-e2304905.adobeaemcloud.com';
const PERSISTED_QUERY = 'global/getArticleByPath';

async function fetchContentFragment(path) {
  const url = `${GRAPHQL_ORIGIN}/graphql/execute.json/${PERSISTED_QUERY};path=${encodeURI(path)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GraphQL request failed with status ${res.status}`);
  const json = await res.json();
  const [result] = Object.values(json.data || {});
  return result?.item;
}

export default async function decorate(block) {
  const path = block.textContent.trim();
  block.textContent = '';
  if (!path) return;

  try {
    const item = await fetchContentFragment(path);
    if (!item) return;

    const title = item.Title || item.title;
    const { description, image } = item;

    if (title) {
      const heading = document.createElement('h2');
      heading.textContent = title;
      block.append(heading);
    }

    const { _publishUrl: imageUrl } = image || {};
    if (imageUrl) {
      block.append(createOptimizedPicture(imageUrl, title || '', false, [{ width: '750' }]));
    }

    if (description) {
      const paragraph = document.createElement('p');
      paragraph.textContent = description;
      block.append(paragraph);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('content-fragment block failed to load', path, error);
  }
}
