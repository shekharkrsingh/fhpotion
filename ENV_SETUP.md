# Environment Variables Setup Guide

This project uses environment variables to configure the backend API endpoints. The variables are recognized during both development and production builds.

## Setup

### 1. Create `.env` file

Create a `.env` file in the root directory with the following variables:

```env
# Backend API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
EXPO_PUBLIC_WS_BASE_URL=http://localhost:8080
```

**For Production:**
```env
EXPO_PUBLIC_API_BASE_URL=https://docterdevserver-1-0.onrender.com
EXPO_PUBLIC_WS_BASE_URL=https://docterdevserver-1-0.onrender.com
```

### 2. How It Works

The configuration uses a **three-tier approach** to ensure variables work in all environments:

1. **`expo-constants`** - Reads from `app.config.js` extra section (works in all builds)
2. **`process.env.EXPO_PUBLIC_*`** - Direct environment variable access (works in development)
3. **Fallback** - Defaults to `http://localhost:8080` if nothing is set

### 3. Development

For local development, create a `.env` file and the variables will be automatically picked up:

```bash
# Start the development server
npx expo start
```

The `.env` file is already in `.gitignore`, so it won't be committed to version control.

### 4. Production Builds (EAS Build)

Environment variables are configured in `eas.json` for each build profile:

- **Development**: Uses `http://localhost:8080`
- **Preview**: Uses production URL
- **Production**: Uses production URL

You can override these by:
1. Setting environment variables in EAS Build secrets
2. Modifying `eas.json` for each build profile
3. Using `--env-file` flag: `eas build --profile production --env-file .env.production`

### 5. Building with Custom Environment Variables

#### Option 1: Using .env file
```bash
# Create .env.production file
EXPO_PUBLIC_API_BASE_URL=https://your-production-api.com
EXPO_PUBLIC_WS_BASE_URL=https://your-production-api.com

# Build with the env file
eas build --profile production --env-file .env.production
```

#### Option 2: Using EAS Secrets
```bash
# Set secrets in EAS
eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value https://your-api.com
eas secret:create --scope project --name EXPO_PUBLIC_WS_BASE_URL --value https://your-api.com

# Build (secrets are automatically injected)
eas build --profile production
```

#### Option 3: Inline environment variables
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-api.com eas build --profile production
```

### 6. File Structure

```
fhpotion/
├── .env                    # Local development (gitignored)
├── .env.example            # Template (committed to git)
├── app.config.js           # Dynamic config that reads env vars
├── app.json                 # Static config (fallback)
├── eas.json                 # EAS Build configuration
└── newService/config/
    └── apiConfig.ts         # Reads env vars using expo-constants
```

### 7. Verification

To verify that environment variables are being read correctly, you can check:

1. **Development**: Check console logs or add a temporary log in `apiConfig.ts`
2. **Build**: The variables are baked into the app at build time via `app.config.js`

### 8. Important Notes

- ✅ Variables prefixed with `EXPO_PUBLIC_` are accessible in client-side code
- ✅ Variables are available at **build time** for native builds (iOS/Android)
- ✅ For web builds, variables are replaced at build time
- ✅ The `.env` file is gitignored - never commit sensitive values
- ✅ Use `app.config.js` (not `app.json`) to use environment variables in config

### 9. Troubleshooting

**Variables not working in build?**
- Make sure you're using `EXPO_PUBLIC_` prefix
- Check `eas.json` has the variables in the `env` section for your build profile
- Verify `app.config.js` is reading the variables correctly

**Variables not working in development?**
- Ensure `.env` file exists in the root directory
- Restart the Expo dev server after creating/modifying `.env`
- Check that variables start with `EXPO_PUBLIC_`

**Need different values per environment?**
- Use different `.env` files: `.env.development`, `.env.production`
- Configure different values in `eas.json` for each build profile
- Use EAS Secrets for sensitive values

