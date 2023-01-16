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

let previousValue = '';

refs.formEl.addEventListener('submit', onFormElSubmit);

async function onFormElSubmit(event) {
  event.preventDefault();

  if (previousValue === event.target.elements.searchQuery.value) {
    return
  }

  previousValue = event.target.elements.searchQuery.value;
  refs.btnLoadMore.style.display = 'none';
  event.target.elements.searchBtn.disabled = true;
  pixabayApi.query = previousValue;
  pixabayApi.page = 1;

  try {
    onPixabayApiResolvedFirst(await pixabayApi.getPhotos())
  } catch (error){
    console.log(error)
  } finally {
    event.target.elements.searchBtn.disabled = false;
  }
    // .then(onPixabayApiResolvedFirst)
    // .catch(onPixabayApiRejected)
    // .finally(() => {
    //   event.target.elements.searchBtn.disabled = false;
    // });
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
  
  window.scrollTo(0, 0);

  if (totalHits >= pixabayApi.per_page) {
    refs.btnLoadMore.style.display = 'block';
    refs.btnLoadMore.addEventListener('click', onBtnLoadMoreClick);
  }
}

// function onPixabayApiRejected(err) {
//   console.log(err);
// }

async function onBtnLoadMoreClick(event) {
  event.target.disabled = true;
  pixabayApi.page += 1;
  pixabayApi.countHits += pixabayApi.per_page;

  try {
    onPixabayApiResolvedMore(await pixabayApi.getPhotos())
  } catch (error){
    console.log(error)
  } finally {
    event.target.disabled = false;
  }

//   pixabayApi
//     .getPhotos()
//     .then(onPixabayApiResolvedMore)
//     .catch(onPixabayApiRejected)
//     .finally(() => {
//       event.target.disabled = false;
//     });
}

function onPixabayApiResolvedMore(obj) {
  const {
    data: { totalHits, hits },
  } = obj;

  refs.galleryEl.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
  simpleLightBox.refresh();
  onSmoothScroll();

  if (!hits.length) {
    Notify.info("We're sorry, but you've reached the end of search results.");
      refs.btnLoadMore.removeEventListener('click', onBtnLoadMoreClick);
      refs.btnLoadMore.style.display = 'none';
  };
  // if (totalHits <= pixabayApi.countHits) {
  //   Notify.info("We're sorry, but you've reached the end of search results.");
  //   refs.btnLoadMore.removeEventListener('click', onBtnLoadMoreClick);
  //   refs.btnLoadMore.style.display = 'none';
  // }
}

function onSmoothScroll() {
  const { height: cardHeight } =
    refs.galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
