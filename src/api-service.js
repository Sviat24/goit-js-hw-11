import axios from 'axios';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const URL = 'https://pixabay.com/api/';

    const API_KEY = '34964611-89c8b59fd1bb99eb808496787';

    const ADD_PARAMETERS =
      'image_type=photo&orientation=horizontal&safesearch=true';

    const response = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuery}&${ADD_PARAMETERS}&page=${this.page}&per_page=40`
    );

    const data = response.data;

    if (!response.status) {
      throw new Error(response.status);
    }

    this.incrementPage();

    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
