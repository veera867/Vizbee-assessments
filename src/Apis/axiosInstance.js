import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://8000-gathianalyt-skillmetric-oirvhb1lrus.ws-us96b.gitpod.io', // Replace with your base URL
});

export default instance;