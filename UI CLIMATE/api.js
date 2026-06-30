import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

export const getStates = () => api.get('/states').then((r) => r.data)

export const getHistory = (state, params = {}) =>
  api.get(`/history/${encodeURIComponent(state)}`, { params }).then((r) => r.data)

export const getHistorySummary = (state) =>
  api.get(`/history/${encodeURIComponent(state)}/summary`).then((r) => r.data)

export const getForecast = (state) =>
  api.get(`/forecast/${encodeURIComponent(state)}`).then((r) => r.data)

export const getRiskForecast = () => api.get('/risk-forecast').then((r) => r.data)

export const postPredict = (state, date) =>
  api.post('/predict', { state, date }).then((r) => r.data)

export default api
