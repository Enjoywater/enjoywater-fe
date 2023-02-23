import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api.sixshop.com',
  headers: {
    'Content-type': 'application/json',
  },
});

export default axiosClient;
