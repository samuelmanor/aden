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

const getFiltered = (filters) => {
  const req = axios.get(baseUrl, filters);
  return req.then(res => res.data);
};

const exportObj = { getFiltered };

export default exportObj;