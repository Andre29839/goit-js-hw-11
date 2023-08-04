import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { imgParams, getImages } from './appi.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    scroll: document.querySelector('.scroll'),
    options: {
        root: null,
        rootMargin: '500px',
        threshold: 1.0,
    },
}

const observer = new IntersectionObserver(onEntry, refs.options)
let lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      getImages(imgParams).then(result => {
          createGallery(result.data);
      });
    }
  });
}

const createGallery = object => {
        const totalHits = object.totalHits;
        const hitsArray = object.hits;
        if (hitsArray.length === 0) {
            Notify.failure(
                'Sorry, there are no images matching your search query. Please try again'
            );
        } else {
            if (imgParams.page === 1) {
                Notify.success(`Hooray! We found ${totalHits} images`);
            }
            markupResult(hitsArray, refs.gallery);
            imgParams.page += 1;
        }
    };

const markupResult = (array, container) => {
        const markup = createMarkup(array);
        container.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();
    };


function createMarkup(images) {
    console.log(images);
  return images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery-item" href="${largeImageURL}">
  <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${downloads}
      </p>
    </div>
    </div>
    </a>`;
      }
    )
    .join('');
}

const onFormSubmit = evt => {
        observer.disconnect();
        evt.preventDefault();
        imgParams.q = '';
        imgParams.page = 1;
        refs.gallery.innerHTML = '';
        eventHandler(evt);
    };

refs.form.addEventListener('submit', onFormSubmit);

const eventHandler = evt => {
    if (evt.target.elements.searchQuery.value === '') {
        Notify.info('Please, enter a word for search!');
    } else {
        imgParams.q = evt.target.elements.searchQuery.value;
        getImages(imgParams).then(result => {
            createGallery(result.data);
            observer.observe(refs.scroll);
        });
    }
}

refs.form.elements.searchQuery.addEventListener("focus", onFocusInput)

function onFocusInput(e) {
    e.target.placeholder = "Search images..."
}

refs.form.elements.searchQuery.addEventListener("blur", onBlurInput)

function onBlurInput(e) {
    e.target.placeholder = ""
}