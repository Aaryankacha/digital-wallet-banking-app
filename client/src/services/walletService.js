import api from './api';

/** Get wallet balance (own — JWT identifies user) */
export const getBalance = () => api.get('/api/wallet/balance/${email}');

/** Send money to another user */
export const sendMoney = (data) => api.post('/api/wallet/send', data);

/** Request money from another user */
export const requestMoney = (data) => api.post('/api/wallet/request', data);

/** Get all transactions for logged-in user; optionally filter by ?category=&type= */
export const getTransactions = (email) => api.get('/api/transactions/${email});
