
// # .env
// const BASE_URL="http://localhost:8080/";
// const WEBSOCKET_BASE="http://localhost:8080/";

// # Cloud URLs (for deployment)
const BASE_URL="https://docterdevserver-1-0.onrender.com/"
const WEBSOCKET_BASE="https://docterdevserver-1-0.onrender.com/"


export const API_BASE_URL: string = BASE_URL.endsWith("/")
  ? BASE_URL
  : `${BASE_URL}/`;

export const WS_BASE_URL: string = WEBSOCKET_BASE.endsWith("/")
  ? WEBSOCKET_BASE
  : `${WEBSOCKET_BASE}/`;
