/**
 * Decorate the featured article block
 * Supports two content models:
 * - 2 rows: [image row] [content row]
 * - 1 row with 2 cols: [image col | content col]
 * @param {Element} block the block element
 */
export default function decorate(block) {
  let picture;
  let contentCell;

  const firstRow = block.querySelector(':scope > div');
  if (!firstRow) return;

  const cells = [...firstRow.children];

  // Detect structure: 2 cols in first row OR single col (2 row structure)
  if (cells.length === 2) {
    // 1 row, 2 cols structure: [image col | content col]
    const imageCol = cells.find((cell) => cell.querySelector('picture'));
    const contentCol = cells.find((cell) => !cell.querySelector('picture'));
    picture = imageCol?.querySelector('picture');
    contentCell = contentCol;
  } else {
    // 2 rows structure: [image row] [content row]
    const rows = [...block.children];
    if (rows.length < 2) return;

    const imageRow = rows[0];
    const contentRow = rows[1];

    picture = imageRow.querySelector('picture');
    contentCell = contentRow.querySelector('div');
  }

  if (!contentCell) return;

  // Set eager loading for hero image
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      img.loading = 'eager';
    }
  }

  // Find category/tag (strong or em element)
  const categoryElement = contentCell.querySelector('strong, em');
  let category = null;
  if (categoryElement) {
    category = document.createElement('div');
    category.className = 'featured-article-category';
    category.textContent = categoryElement.textContent;
    // Remove the category from the content
    categoryElement.remove();
  }

  // Find heading
  const heading = contentCell.querySelector('h1, h2, h3, h4, h5, h6');

  // Find all paragraphs (description and link)
  const paragraphs = [...contentCell.querySelectorAll('p')];

  // Find the link (CTA button) - typically in the last paragraph
  const linkParagraph = paragraphs.find((p) => p.querySelector('a'));
  const link = linkParagraph?.querySelector('a');
  if (link) {
    link.className = 'button primary';
    // Remove the link from its paragraph and keep it separate
    linkParagraph.replaceWith(link);
  }

  // Create content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'featured-article-content';

  // Add elements to content wrapper in order
  if (category) contentWrapper.append(category);
  if (heading) contentWrapper.append(heading);

  // Add description paragraphs (excluding the one that had the link)
  paragraphs.forEach((p) => {
    if (p !== linkParagraph && p.parentElement) {
      contentWrapper.append(p);
    }
  });

  if (link) contentWrapper.append(link);

  // Rebuild block structure
  block.textContent = '';

  // Add picture as background
  if (picture) {
    const pictureWrapper = document.createElement('div');
    pictureWrapper.className = 'featured-article-image';
    pictureWrapper.append(picture);
    block.append(pictureWrapper);

    // Add category badge overlay on mobile (if category exists)
    if (category) {
      const mobileBadge = document.createElement('div');
      mobileBadge.className = 'featured-article-badge';
      mobileBadge.textContent = category.textContent;
      pictureWrapper.append(mobileBadge);
    }
  }

  // Add content wrapper
  block.append(contentWrapper);
}
