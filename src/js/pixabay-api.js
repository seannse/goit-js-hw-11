'use strict';
import axios, { formToJSON } from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '32832453-e3254b3d4cedd40db7f429e0f';

  constructor() {
    this.page = 1;
    this.query = null;
    this.per_page = 40;
    this.countHits = this.per_page;
  }

  async getPhotos() {
    const axiosParams = {
      params: {
        key: PixabayAPI.API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.per_page,
      },
    };

    return await axios.get(PixabayAPI.BASE_URL, axiosParams);
  }
}

//   onToDoUpdate(completed, id) {
//     return fetch(`${ToDoApi.BASE_URL}/${id}`, {
//       method: 'PATCH',
//       body: JSON.stringify({
//         completed,
//       }),
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8',
//       },
//     })
//       .then(response => response.json())
//       .then(json => console.log(json));
//   }
