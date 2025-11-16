# API Architecture Documentation

## Overview
This project uses a layered API architecture with centralized configuration, endpoint management, and a unified API connector pattern. The architecture follows Redux for state management and integrates with React Native components.

## Architecture Layers

### 1. **API Configuration Layer** (`newService/config/`)

#### `apiConfig.ts`
- **Purpose**: Centralized base URL configuration
- **Features**:
  - Defines `API_BASE_URL` and `WS_BASE_URL` (WebSocket)
  - Supports local development and cloud deployment
  - Automatically handles trailing slashes

```typescript
// Previous local defaults:
// const BASE_URL = "http://localhost:8080/";
// const WEBSOCKET_BASE = "http://localhost:8080/";
// Remote hosted defaults:
const BASE_URL = "https://docterdevserver-1-0.onrender.com/";
const WEBSOCKET_BASE = "https://docterdevserver-1-0.onrender.com/";
```

#### `apiEndpoints/` Directory
Organized endpoint definitions by domain:
- `authEndpoints.ts` - Authentication endpoints
- `appointmentEndpoints.ts` - Appointment management
- `doctorEndpoints.ts` - Doctor profile and statistics
- `notificationEndpoints.ts` - Notification management
- `reportEndpoints.ts` - Report generation

**Pattern**: Each endpoint file exports an object with endpoint functions/strings:
```typescript
export const appointmentEndpoints = {
  bookAppointment: `${API_BASE_URL}api/v1/appointments/book`,
  getAppointmentById: (id: string) => `${API_BASE_URL}api/v1/appointments/${id}`,
  // ...
};
```

### 2. **API Connector Layer** (`newService/apiConnector.ts`)

#### Core Function: `apiConnector`
- **Purpose**: Unified HTTP request handler using Axios
- **Features**:
  - Automatic token injection via interceptors
  - Token validation and authentication redirect
  - Support for multiple response types (JSON, arraybuffer, blob, etc.)
  - Type-safe generic responses

#### Request Interceptor
```typescript
axiosInstance.interceptors.request.use(async (config) => {
  const tokenRequired = (config as any).tokenRequired ?? true;
  
  if (tokenRequired) {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.replace('/(auth)'); // Auto-redirect to login
      return Promise.reject({ /* 401 error */ });
    }
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  return config;
});
```

#### Usage Pattern
```typescript
const response = await apiConnector<T>({
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: endpoint,
  bodyData?: object,
  headers?: Record<string, string>,
  params?: Record<string, any>,
  tokenRequired?: boolean, // Default: true
  responseType?: 'json' | 'arraybuffer' | 'blob' | 'text',
});
```

### 3. **API Service Layer** (`newService/config/api/`)

Domain-specific API functions organized by feature:
- `authApi.ts` - Authentication operations
- `appointmentApi.ts` - Appointment CRUD operations
- `profileApi.ts` - Doctor profile management
- `notificationApi.ts` - Notification operations
- `statisticsApi.ts` - Statistics fetching
- `reportsAPI.ts` - PDF report generation

#### Pattern: Redux Thunk Actions
Most API functions are Redux thunks that:
1. Dispatch loading state
2. Call `apiConnector`
3. Handle success/error
4. Update Redux store
5. Return boolean or data

**Example from `appointmentApi.ts`:**
```typescript
export const getAppointments = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const response = await apiConnector({
      method: "GET",
      url: appointmentEndpoints.getTodaysAppointments,
      tokenRequired: true,
    });

    if (response.status === 200 && response.data?.success) {
      dispatch(setAppointments(response.data.data || []));
      dispatch(setSuccess(true));
      return true;
    }

    dispatch(setError(response.data?.message || "Failed to fetch appointments"));
    return false;
  } catch (error: any) {
    return handleApiError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};
```

#### Special Cases

**1. Auth API (`authApi.ts`)**
- Uses direct function calls (not Redux thunks)
- Manually manages AsyncStorage for tokens
- Returns boolean success/failure
- Example: `loginDoctor(email, password)`

**2. Reports API (`reportsAPI.ts`)**
- Returns binary data (PDF)
- Uses `responseType: 'arraybuffer'`
- Validates PDF headers
- Returns `{ pdfData: Uint8Array; fileName: string }`

### 4. **Component Usage Layer**

#### Pattern 1: Redux Thunk Dispatch (Most Common)
```typescript
// In component
const dispatch = useDispatch<AppDispatch>();
const { appointments, loading, error } = useSelector((state: RootState) => state.appointments);

useEffect(() => {
  dispatch(getAppointments());
}, [dispatch]);

// With async/await
const handleRefresh = async () => {
  await dispatch(getAppointments());
};
```

#### Pattern 2: Direct Function Call (Auth)
```typescript
// In login component
const handleLogin = async () => {
  setIsLoading(true);
  const success = await loginDoctor(email, password);
  if (success) {
    router.replace('/splashScreen');
  }
  setIsLoading(false);
};
```

#### Pattern 3: Error Handling
```typescript
try {
  const result = await dispatch(updateAppointment(id, data));
  if (result) {
    Toast.show({ type: 'success', text1: 'Updated!' });
  }
} catch (error) {
  // Error already handled in Redux store
  Toast.show({ type: 'error', text1: 'Update failed' });
}
```

## Key Features

### 1. **Automatic Authentication**
- Token automatically injected from AsyncStorage
- Missing token triggers redirect to login
- Configurable per-request via `tokenRequired: false`

### 2. **Error Handling**
- Centralized error handling in API functions
- Automatic state reversion on failure (for updates)
- Consistent error message extraction
- 401 handling with auto-logout

### 3. **State Management Integration**
- All API calls update Redux store
- Loading states managed automatically
- Success/error states tracked
- Optimistic updates with rollback capability

### 4. **Type Safety**
- Generic types for API responses
- TypeScript interfaces for request/response data
- Type-safe endpoint functions

### 5. **Response Format**
Expected API response structure:
```typescript
{
  success: boolean;
  data: T; // Actual data
  message?: string; // Optional message
}
```

## Legacy Code

**Note**: There's a legacy `apiFactory.ts` file at the root that appears to be an older implementation. The current architecture uses the `newService/` directory structure.

## WebSocket Integration

WebSocket endpoints are defined separately:
- `websocketEndpoints.ts` - WebSocket endpoint definitions
- `websocketService.ts` - WebSocket connection management
- Used for real-time appointment updates

## Best Practices Observed

1. ✅ **Separation of Concerns**: Endpoints, connector, and services are separated
2. ✅ **Centralized Configuration**: Base URLs in one place
3. ✅ **Consistent Error Handling**: Standardized error processing
4. ✅ **Type Safety**: TypeScript throughout
5. ✅ **State Management**: Redux integration for data flow
6. ✅ **Token Management**: Automatic token injection
7. ✅ **Loading States**: Built-in loading state management

## Example Flow: Creating an Appointment

1. **Component** calls `dispatch(addAppointment(appointmentData))`
2. **Redux Thunk** (`appointmentApi.ts`) dispatches `setLoading(true)`
3. **API Connector** adds token to headers via interceptor
4. **HTTP Request** sent to `appointmentEndpoints.bookAppointment`
5. **Response** received and validated
6. **Redux Store** updated with `addAppointmentInStore(response.data.data)`
7. **Component** re-renders with new data from Redux store

## File Structure Summary

```
newService/
├── apiConnector.ts              # Core HTTP client
├── config/
│   ├── apiConfig.ts             # Base URLs
│   ├── api/
│   │   ├── authApi.ts          # Auth functions
│   │   ├── appointmentApi.ts   # Appointment functions
│   │   ├── profileApi.ts       # Profile functions
│   │   ├── notificationApi.ts # Notification functions
│   │   ├── statisticsApi.ts   # Statistics functions
│   │   └── reportsAPI.ts       # Report generation
│   └── apiEndpoints/
│       ├── index.ts            # Barrel export
│       ├── authEndpoints.ts
│       ├── appointmentEndpoints.ts
│       ├── doctorEndpoints.ts
│       ├── notificationEndpoints.ts
│       └── reportEndpoints.ts
└── websocket/
    └── websocketService.ts     # WebSocket management
```

