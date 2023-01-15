'use strict'

export function createGalleryMarkup(arr) {
  return arr.map((el) => {
    return `
  <a class="link photo-card" href="${el.largeImageURL}" >
    <img src="${el.webformatURL}" alt="${el.tags}" width="270" height="180" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
      ${el.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
      ${el.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
      ${el.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
      ${el.downloads}
      </p>
    </div>
  </a>
  `}).join('');
};