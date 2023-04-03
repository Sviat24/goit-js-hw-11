import '../src/css/styles.css';

import ApiService from './api-service';
import { getPhotoCard } from './photo-card';

import { Notify } from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
  scrollup: document.querySelector('.scrollup'),
};

refs.form.addEventListener('submit', onSearchImages);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const apiService = new ApiService();

onHideScrollup();
onHideLoadMoreBtn();

async function onSearchImages(event) {
  event.preventDefault();

  onHideLoadMoreBtn();

  clearGallery();

  apiService.query = event.currentTarget.elements.searchQuery.value.trim();

  if (apiService.query === '') {
    Notify.failure(
      'На жаль, немає зображень, що відповідають вашому запиту. Будь ласка, спробуйте ще раз.'
    );
    return;
  }

  apiService.resetPage();
  refs.form.reset();

  try {
    const data = await apiService.fetchImages();

    onShowLoadMoreBtn();
    onShowScrollup();

    const array = await appendImages(data);

    return array;
  } catch (error) {
    Notify.failure(
      'На жаль, немає зображень, що відповідають вашому запиту. Будь ласка, спробуйте ще раз.'
    );
    return error;
  }
}

async function onLoadMore() {
  onSmoothScrolling(refs.gallery);

  try {
    const data = await apiService.fetchImages();

    const array = await appendImages(data);

    return array;
  } catch (error) {
    Notify.failure(
      'На жаль, немає зображень, що відповідають вашому запиту. Будь ласка, спробуйте ще раз.'
    );
    return error;
  }
}

function appendImages(data) {
  const markup = data.hits.map(getPhotoCard).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  if (data.hits.length === 0) {
    onHideLoadMoreBtn();
    onHideScrollup();

    Notify.failure(
      'На жаль, немає зображень, що відповідають вашому запиту. Будь ласка, спробуйте ще раз.'
    );
    return;
  }

  if (apiService.page === 2) {
    Notify.success(`Ура! Ми знайшли ${data.totalHits} зображення.`);
  }

  const totalPage = Math.ceil(data.totalHits / 40);
  if (apiService.page > totalPage) {
    onHideLoadMoreBtn();
    Notify.info(`На жаль, ви досягли кінця результатів пошуку.`);
  }

  if (data.totalHits === 0) {
    onHideLoadMoreBtn();
    Notify.info(`На жаль, за вашим запитом нічого не знайдено.`);
  }

  lightbox.refresh();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function onShowLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function onHideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

function onSmoothScrolling() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onShowScrollup() {
  refs.scrollup.classList.remove('is-hidden');
}

function onHideScrollup() {
  refs.scrollup.classList.add('is-hidden');
}
