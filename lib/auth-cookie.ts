const AUTH_COOKIE_NAME = "auth-token"
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

export function setAuthCookie(token: string) {
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`
}
