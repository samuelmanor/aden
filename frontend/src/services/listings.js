import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/listings';

// let token = null;

// const setToken = newToken => {
//   token = `Bearer ${newToken}`;
// };

// const getAll = () => {
//   const req = axios.get(baseUrl);
//   return req.then(res => res.data);
// };

const search = (filters) => {
  const req = axios.post(`${baseUrl}/search`, filters);
  return req.then(res => res.data);
};

const getFilters = () => {
  const req = axios.get(`${baseUrl}/filters`);
  return req.then(res => res.data);
};

const exportObj = { search, getFilters };

export default exportObj;