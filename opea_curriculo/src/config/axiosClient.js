import axios from 'axios';

export const axiosClient = axios.create({ baseURL: 'https://homolog.planetasec.com.br/prova/front/api/clients' })