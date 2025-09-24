import SubscriptionApi from '../api/SubscriptionApi';

export const SERVER_URL = 'http://localhost:7070/';
export const SERVER_URL_WS = `${SERVER_URL}ws`;
export const SERVER_URL_SSE = `${SERVER_URL}sse`;
export const SSE = new EventSource(SERVER_URL_SSE);
export const WS = new WebSocket(SERVER_URL_WS);
export const SUBSCRIPTION = new SubscriptionApi(SERVER_URL);
