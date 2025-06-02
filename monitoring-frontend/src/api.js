import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Local FastAPI backend

export const getContacts = async () => {
  const response = await axios.get(`${API_URL}/contacts`);
  return response.data;
};

export const getDeals = async () => {
  const response = await axios.get(`${API_URL}/deals`);
  return response.data;
};
