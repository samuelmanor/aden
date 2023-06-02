import axios from "axios";
const baseUrl = 'http://localhost:3001/api/comments';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const create = async (newObj) => {
  const config = {
    headers: { Authorization: token }
  };

  const res = await axios.post(baseUrl, newObj, config);
  return res.data;
};

const update = async (id, newObj) => {
  const config = {
    headers: { Authorization: token }
  };

  const req = await axios.patch(`${baseUrl}/${id}`, newObj, config);
  return req.data;
};

const exportObj = { create, update, setToken };

export default exportObj;