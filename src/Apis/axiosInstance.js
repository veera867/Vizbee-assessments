import axios from 'axios';

const instance = axios.create({

  // baseURL: 'http://127.0.0.1:8000', // Replace with your base URL
  //baseURL: 'http://127.0.0.1:7000',

  //baseURL: ' http://34.72.245.226:8000', // Replace with your base URL

});

export default instance;
