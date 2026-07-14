/** Legacy single-session cookie (cleared on login/logout). */
export const COOKIE_NAME = "alhadid_session";

export const ACCESS_COOKIE = "alhadid_access";
export const REFRESH_COOKIE = "alhadid_refresh";

/** Short-lived access token (15 minutes). */
export const ACCESS_MAX_AGE_SECONDS = 60 * 15;

/** Long-lived refresh token (7 days). */
export const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** @deprecated Use ACCESS_MAX_AGE_SECONDS / REFRESH_MAX_AGE_SECONDS */
export const MAX_AGE_SECONDS = REFRESH_MAX_AGE_SECONDS;
