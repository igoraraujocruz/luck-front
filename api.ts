import axios from 'axios';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : 'https://api.duckluckie.fun';

export const api = axios.create({
    baseURL: baseUrl,
});