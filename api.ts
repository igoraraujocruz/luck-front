import axios from 'axios';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_API_LOCALHOST
    : process.env.NEXT_PUBLIC_API_PRODUCTION;

export const api = axios.create({
    baseURL: baseUrl,
});
