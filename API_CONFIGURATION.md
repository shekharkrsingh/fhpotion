## API configuration (Expo best practice)

Use environment-driven configuration so your app points to the correct backend on device without hardcoding.

### 1) Primary sources of truth
- EXPO_PUBLIC_API_BASE_URL
- EXPO_PUBLIC_WS_BASE_URL

These are available at runtime via `process.env.*` in your app code, and are safe to use in the client (Expo will inline them).

### 2) Where to set them
- app.config.js (development): reads `process.env` and puts values into `expo.extra`
- eas.json (builds): set per-profile env for dev/preview/production
- Optional: .env files for local dev (gitignored)

### 3) Code path (already implemented)
- `newService/config/apiConfig.ts` resolves base URLs in this order:
  1. `process.env.EXPO_PUBLIC_API_BASE_URL` / `EXPO_PUBLIC_WS_BASE_URL`
  2. `Constants.expoConfig.extra.apiBaseUrl` / `wsBaseUrl`
  3. Fallback: `https://docterdevserver-1-0.onrender.com/` (never localhost)
- `newService/apiConnector.ts` sets Axios `baseURL` to `API_BASE_URL`
- Endpoints compose from `API_BASE_URL`; WebSocket handshake composes from `WS_BASE_URL`

### 4) How to set for development (Expo Go)
Option A: export env variables before `npx expo start`:
```bash
export EXPO_PUBLIC_API_BASE_URL=https://docterdevserver-1-0.onrender.com
export EXPO_PUBLIC_WS_BASE_URL=https://docterdevserver-1-0.onrender.com
npx expo start -c
```

Option B: .env file (auto-loaded by app.config.js via dotenv):
```
# .env (gitignored)
EXPO_PUBLIC_API_BASE_URL=https://docterdevserver-1-0.onrender.com
EXPO_PUBLIC_WS_BASE_URL=https://docterdevserver-1-0.onrender.com
```
Then:
```bash
npx expo start -c
```

### 5) How to set for EAS build
- `eas.json` already configured to use the remote for development/preview/production:
```json
{
  "build": {
    "development": {
      "env": {
        "EXPO_PUBLIC_API_BASE_URL": "https://docterdevserver-1-0.onrender.com",
        "EXPO_PUBLIC_WS_BASE_URL": "https://docterdevserver-1-0.onrender.com"
      }
    }
  }
}
```
- If needed, use an env file:
```bash
echo "EXPO_PUBLIC_API_BASE_URL=https://docterdevserver-1-0.onrender.com" > .env.production
echo "EXPO_PUBLIC_WS_BASE_URL=https://docterdevserver-1-0.onrender.com" >> .env.production
eas build --profile production --env-file .env.production
```

### 6) Verify at runtime
- Add a temporary log in `apiConfig.ts` (during debugging only):
```ts
console.log("API_BASE_URL ->", API_BASE_URL);
console.log("WS_BASE_URL  ->", WS_BASE_URL);
```
- Start with cache clear, and fully reload Expo Go on device:
```bash
npx expo start -c
```

### 7) Common pitfalls
- Stale Metro cache or Expo Go cache → always use `-c` and reload the app
- Old dev client build with embedded env → rebuild your EAS dev client
- Phantom `.env` with localhost → remove or update `.env` values
- Multiple config sources → our resolver prioritizes `process.env` first

### 8) TL;DR
- Set EXPO_PUBLIC_* env vars
- Run `npx expo start -c`
- App reads env → extras → fallback (remote), never localhost


