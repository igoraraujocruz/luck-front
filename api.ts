import axios from 'axios';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
    baseURL: baseUrl,
});
