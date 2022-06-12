import Axios from 'axios';
import { baseUrl } from '../environment';

const apiInstance = Axios.create({
  baseURL: baseUrl(),
});

export default apiInstance;
