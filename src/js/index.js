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

refs.form.elements.searchQuery.addEventListener("focus", onFocusInput)
refs.form.elements.searchQuery.addEventListener("blur", onBlurInput)

async function onEntry(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
     const result = await getImages(imgParams);
          createGallery(result.data);
          if (imgParams.page - 1 >= Math.ceil(result.data.totalHits / imgParams.per_page)) {
              observer.unobserve(refs.scroll)
                 Notify.info("Sorry, there are no images matching your search query. Please try again.")
        }
        
    }
  });
}

const createGallery = object => {
    const hitsArray = object.hits;
    
            markupResult(hitsArray, refs.gallery);
            imgParams.page += 1;
        }

const markupResult = (array, container) => {
        const markup = createMarkup(array);
        container.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();
    };


function createMarkup(images) {
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

const onFormSubmit = async evt => {
        evt.preventDefault();
        observer.unobserve(refs.scroll);
        imgParams.q = '';
        imgParams.page = 1;
        refs.gallery.innerHTML = '';
    await eventHandler(evt);

    };

refs.form.addEventListener('submit', onFormSubmit);

async function eventHandler(evt) {
    if (evt.target.elements.searchQuery.value.trim() === '') {
        Notify.info('Please, enter a word for search!');
        refs.form.reset()
    } else {
        imgParams.q = evt.target.elements.searchQuery.value;
       const result = await getImages(imgParams);
            createGallery(result.data);

            if (result.data.totalHits === 0) {
                return Notify.failure(
                'Sorry, there are no images matching your search query. Please try again')
            }

            Notify.success(`Hooray! We found ${result.data.totalHits} images`);
            
            if (result.data.total > imgParams.per_page) {
                observer.observe(refs.scroll);
            }
    }
}

function onFocusInput(e) {
    e.target.placeholder = "Search images..."
}

function onBlurInput(e) {
    e.target.placeholder = ""
}
