# Frontend Critical Issues (Updated)

## Executive summary
- Scope: React Native/Expo app (`fhpotion/`).
- Status: Several a11y and header consistency fixes landed. Redux thunks standardized for core domains.
- This update reflects current code as of today and prioritizes remaining issues.

Totals (approximate):
- Critical: 8 (3 fixed, 5 remaining)
- High: 10
- Medium: 8

---

## 🔴 Critical issues

1) Remaining legacy touchables (inconsistent UX and a11y)
- Locations: `app/(auth)/*`, `app/settings.tsx`, `app/editProfile.tsx`, `app/ReportScreen.tsx`
- Evidence: Multiple `TouchableOpacity` usages remain.
- Risk: Inconsistent pressed feedback, no unified ripple/press opacity, missing hitSlop, and a11y props.
- Action: Migrate to `Pressable` with consistent pressed styles and min touch target; reuse shared button styles.

2) Direct store access from infrastructure layer
- Location: `newService/config/websocket/websocketService.ts` (uses `store.dispatch(...)`)
- Risk: Couples infra to Redux store, harder to test, bypasses dependency injection.
- Action: Inject a `dispatch` function at initialization or expose event callbacks that UI layer wires to dispatch.

3) API cancellation and timeout policy gaps
- Locations: `apiConnector`/axios instance (review recommended), components making long-lived calls.
- Risk: State updates after unmount, wasted bandwidth on poor networks.
- Action: Ensure AbortController per request, default axios timeout (30s), and component cleanup cancels in-flight.

4) Authentication token storage security
- Location: `authApi` token handling.
- Risk: AsyncStorage is not secure; risk of token extraction on rooted devices.
- Action: Use `expo-secure-store`; add token rotation/refresh and expiry handling.

5) Accessibility parity across auth and large forms
- Locations: `app/(auth)/*`, `app/editProfile.tsx`, `app/settings.tsx`.
- Risk: Inputs/buttons missing `accessibilityLabel`, insufficient hit areas, header contrast/size variance.
- Action: Add labels/hints/roles, ensure min touch target per `MedicalTheme.accessibility`, verify color contrast.

Fixed in this pass
- Modal a11y: Added `accessible={false}` and `importantForAccessibility="no-hide-descendants"` to modal backdrops/containers in `AlertPopup`, `OTPVerificationPopup`, `EditAppointmentForm`, `bookingHeader` dropdown, `settings` and `editProfile` modals.

---

## 🟠 High priority

6) Animation driver usage review
- Locations: `app/(tabs)/add.tsx`, `app/index.tsx`, `app/splashScreen.tsx`, `newComponents/bookingHeader.tsx`.
- Notes: Some animations legitimately set `useNativeDriver: false` (height/width/color). For opacity/transform, ensure `useNativeDriver: true`.
- Action: Audit every `Animated.timing`:
  - Opacity/transform → `useNativeDriver: true`.
  - Layout/size/color → keep `false` but wrap in comments for rationale.

7) Unified header and StatusBar in all screens
- Done: Many tab screens and `ReportScreen` migrated to `ScreenHeader` and StatusBar standardized.
- Remaining: Auth screens and some deep modals still custom.
- Action: Adopt `ScreenHeader` where feasible; otherwise, match minHeight/insets; set explicit `StatusBar` per screen.

8) Inconsistent error handling in components
- Status: Thunks standardized; several components still check `result.type.endsWith('/fulfilled')`.
- Action: Optionally migrate to `.unwrap()` in components for cleaner try/catch handling and less branching.

9) Type gaps and external typings
- Note: `sockjs-client` typings warning persists (harmless but noisy).
- Action: Add `@types/sockjs-client` or module declaration shim; ensure all API/WS payloads have typed contracts.

10) Large component files
- Locations: `app/editProfile.tsx`, `app/settings.tsx`, `app/ReportScreen.tsx`.
- Risk: Cognitive load, higher bug risk, harder testing.
- Action: Extract subsections (modals, sections, list items) into focused components; add unit-level props/types.

---

## 🟡 Medium priority

11) Debounce search and avoid redundant work
- Location: `bookingHeader` search input.
- Action: Debounce input (300–400ms), memoize filter selectors, avoid re-computations on every keystroke.

12) Console logging policy
- Risk: Production logging noise and PII leaks.
- Action: Replace with environment-gated logger; scrub sensitive fields.

13) Theming and magic numbers
- Action: Replace hardcoded spacing, radii, and colors with `MedicalTheme` tokens; centralize elevations/shadows.

14) Image fallbacks
- Action: Add `onError`/placeholder to `expo-image` usages; consider low-quality placeholder or shimmer.

15) Empty/error/loading states consistency
- Action: Ensure consistent Empty and Error components across lists; skeletons for perceived performance.

---

## Cross-cutting verifications done
- Modal accessibility warnings fixed (aria-hidden focus block).
- Headers: Introduced `ScreenHeader` with `useSafeAreaInsets` and consistent height; updated critical screens.
- Redux Toolkit: Appointments, profile, stats, notifications refactored to thunks with loading/error states; `updatingIds` made serializable.
- WebSocket: UI updates use synchronous reducers where data is already authoritative; added basic validation.

---

## Concrete next actions
- Replace remaining `TouchableOpacity` with `Pressable` in:
  - `app/(auth)/*`, `app/settings.tsx`, `app/editProfile.tsx`, `app/ReportScreen.tsx`
  - Reuse shared button styles; add `hitSlop` and pressed feedback.
- Abstract `store.dispatch` out of `websocketService` via injected dispatcher or event callbacks.
- Audit all `Animated.timing` calls; set `useNativeDriver: true` for opacity/transform.
- Add `StatusBar` and `ScreenHeader` (or matching spec) to auth screens.
- Add `.unwrap()` adoption in components (optional but recommended).
- Introduce axios cancellation + timeouts policy; cancel on unmount.
- Add `expo-secure-store` for token; implement refresh and expiry strategy.
- Add lightweight logger; remove console logs from production builds.

---

Document version: 2.0  
Last updated: Today

