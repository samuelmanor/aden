import axios from "axios";
const baseUrl = 'http://localhost:3001/api/users';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const read = async (id) => {
  const req = await axios.get(`${baseUrl}/${id}`);
  return req.data;
};

const create = async (obj) => {
  const req = await axios.create(baseUrl, obj);
  console.log(req.data);
};

const update = async (id, obj) => {
  const config = {
    headers: { Authorization: token }
  };

  const req = await axios.put(`${baseUrl}/${id}`, obj, config);
  return req.data;
};

const exportObj = { read, create, update, setToken };

export default exportObj;