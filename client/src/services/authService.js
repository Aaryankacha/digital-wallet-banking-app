import api from './api';

/** Register a new user */
export const registerUser = (data) => api.post('/api/register', data);

/** Login – returns { token, user } */
export const loginUser = (data) => api.post('/api/login', data);
