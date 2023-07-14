import axios from 'axios';

const instance = axios.create({

  //  baseURL: 'https://127.0.0.1:8000', // Replace with your base URL
  // baseURL: 'http://127.0.0.1:8000',


  //  baseURL: ' http://34.135.225.91:8000', // Replace with your base URL

  baseURL: 'https://34.135.225.91:8000', // Replace with your base URL


});

export default instance;
