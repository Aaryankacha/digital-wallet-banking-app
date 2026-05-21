import api from './api';

export const getBalance = (email) => api.get(`/api/balance/${email}`);
export const sendMoney = (data) => api.post('/api/sendMoney', data);
export const requestMoney = (data) => api.post('/api/wallet/request', data);
export const getTransactions = (email) => api.get(`/api/transactions/${email}`);
