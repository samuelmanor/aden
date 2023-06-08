import axios from "axios";
const baseUrl = 'http://localhost:3001/api/users';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const create = async (obj) => {
  const req = axios.create(baseUrl, obj);
  console.log(req.data);
};

const update = async (id, obj) => {
  const config = {
    headers: { Authorization: token }
  };

  const req = await axios.put(`${baseUrl}/${id}`, obj, config);
  return req.data;
};

const exportObj = { create, update, setToken };

export default exportObj;