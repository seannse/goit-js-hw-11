import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayAPI } from './pixabay-api.js';
import { createGalleryMarkup } from './create-markup.js';

const refs = {
  formEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

const pixabayApi = new PixabayAPI();

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.formEl.addEventListener('submit', onFormElSubmit);

function onFormElSubmit(event) {
  event.preventDefault();

  refs.btnLoadMore.style.display = 'none';
  event.target.elements.searchBtn.disabled = true;

  pixabayApi.query = event.target.elements.searchQuery.value;
  pixabayApi.page = 1;
  // refs.galleryEl.scrollTop = 0;

  pixabayApi
    .getPhotos()
    .then(onPixabayApiResolvedFirst)
    .catch(onPixabayApiRejected)
    .finally(() => {
      event.target.elements.searchBtn.disabled = false;
    });
}

function onPixabayApiResolvedFirst(obj) {
  const {
    data: { totalHits, hits },
  } = obj;
  if (!hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.galleryEl.innerHTML = '';
    return;
  }

  refs.galleryEl.innerHTML = createGalleryMarkup(hits);
  Notify.success(`Hooray! We found ${totalHits} images.`);
  simpleLightBox.refresh();
  // onSmoothScroll();
  window.scrollTo(0, 0);
  // window.scroll({
  //   top: 0,
  //   left: 0,
  //   behavior: 'smooth'
  // });

  if (totalHits >= pixabayApi.per_page) {
    refs.btnLoadMore.style.display = 'block';
    refs.btnLoadMore.addEventListener('click', onBtnLoadMoreClick);
  }
}

function onPixabayApiRejected(err) {
  console.log(err);
}

function onBtnLoadMoreClick(event) {
  event.target.disabled = true;
  pixabayApi.page += 1;
  pixabayApi.countHits += pixabayApi.per_page;

  pixabayApi
    .getPhotos()
    .then(onPixabayApiResolvedMore)
    .catch(onPixabayApiRejected)
    .finally(() => {
      event.target.disabled = false;
    });
}

function onPixabayApiResolvedMore(obj) {
  const {
    data: { totalHits, hits },
  } = obj;

  refs.galleryEl.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
  simpleLightBox.refresh();
  onSmoothScroll();
  if (totalHits <= pixabayApi.countHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.btnLoadMore.removeEventListener('click', onBtnLoadMoreClick);
    refs.btnLoadMore.style.display = 'none';
  }
}
//  doesn't work, why???
function onSmoothScroll() {
  const { height: cardHeight } =
    refs.galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
