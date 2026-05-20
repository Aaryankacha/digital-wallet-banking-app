import api from './api';

/** Register a new user */
export const registerUser = (data) => api.post('/auth/register', data);

/** Login – returns { token, user } */
export const loginUser = (data) => api.post('/auth/login', data);
