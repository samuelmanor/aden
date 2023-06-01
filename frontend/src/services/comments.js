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

const exportObj = { create, setToken };

export default exportObj;