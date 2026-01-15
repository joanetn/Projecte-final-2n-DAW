const axios = require("axios");

const API = "http://localhost:4004";

exports.get = (url) => axios.get(`${API}${url}`).then(r => r.data);
exports.post = (url, body) => axios.post(`${API}${url}`, body).then(r => r.data);
