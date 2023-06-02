import axios from "axios";
const baseUrl = 'http://localhost:3001/api/users';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const update = async (id, newObj) => {
  const config = {
    headers: { Authorization: token }
  };

  const req = await axios.put(`${baseUrl}/${id}`, newObj, config);
  return req.data;
};

const exportObj = { update, setToken };

export default exportObj;