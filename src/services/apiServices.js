import Axios from 'axios';
import { baseUrl } from '../environment';

const apiInstance = Axios.create({
  baseURL: baseUrl(),
  headers: {
    Authorization: localStorage.getItem('TOKEN'),
  },
});

export default apiInstance;
