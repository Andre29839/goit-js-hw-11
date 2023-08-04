import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38624276-36ed6cbc10c2af1663e372e7f';

export const imgParams = {
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
};

const customAxios = axios.create({
  baseURL: `${BASE_URL}?key=${API_KEY}`,
});

export const getImages = async params => {
  try {
    const result = await customAxios.get('', { params });
    return result;
  } catch {
    Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
};