import api from './api';

/** Get wallet balance (own — JWT identifies user) */
export const getBalance = () => api.get('/wallet/balance');

/** Send money to another user */
export const sendMoney = (data) => api.post('/wallet/send', data);

/** Request money from another user */
export const requestMoney = (data) => api.post('/wallet/request', data);

/** Get all transactions for logged-in user; optionally filter by ?category=&type= */
export const getTransactions = (params = {}) => api.get('/transactions', { params });
