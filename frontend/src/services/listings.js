import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/listings';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

// const getAll = () => {
//   const req = axios.get(baseUrl);
//   return req.then(res => res.data);
// };

const search = async (filters) => {
  const req = await axios.post(`${baseUrl}/search`, filters);
  return req.then(res => res.data);
};

const getFilters = () => {
  const req = axios.get(`${baseUrl}/filters`);
  return req.then(res => res.data);
};

const create = async newObj => {
  const config = {
    headers: { Authorization: token }
  };

  const res = await axios.post(baseUrl, newObj, config);
  return res.data;
}

const exportObj = { search, getFilters, create, setToken };

export default exportObj;