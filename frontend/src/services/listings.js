import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/listings';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const search = async (filters) => {
  const req = await axios.post(`${baseUrl}/search`, filters);
  return req.data; // return req.then(res => res.data);
};

const getFilters = () => {
  const req = axios.get(`${baseUrl}/filters`);
  return req.then(res => res.data);
};

const create = async (newObj) => {
  const config = {
    headers: { Authorization: token }
  };

  const res = await axios.post(baseUrl, newObj, config);
  return res.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  };

  const res = await axios.delete(`${baseUrl}/${id}`, config);
  console.log(res.data);
};

const exportObj = { search, getFilters, create, remove, setToken };

export default exportObj;