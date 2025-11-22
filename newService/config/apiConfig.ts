import Constants from "expo-constants";

/**
 * Expo best practice:
 * 1) Prefer EXPO_PUBLIC_* env vars at runtime (works in dev and EAS builds)
 * 2) Fallback to app config extras (app.config.js / app.json -> extra.apiBaseUrl/wsBaseUrl)
 * 3) Final fallback to a sensible default (remote), never localhost
 */
const resolveUrl = (envVar?: string | undefined, extraVar?: string | undefined, fallback: string = "https://docterdevserver-1-0.onrender.com/"): string => {
  const raw = envVar || extraVar || fallback;
  return raw.endsWith("/") ? raw : `${raw}/`;
};

const extras = Constants?.expoConfig?.extra as any | undefined;

export const API_BASE_URL: string = resolveUrl(
  process.env.EXPO_PUBLIC_API_BASE_URL,
  extras?.apiBaseUrl
);

export const WS_BASE_URL: string = resolveUrl(
  process.env.EXPO_PUBLIC_WS_BASE_URL,
  extras?.wsBaseUrl
);
