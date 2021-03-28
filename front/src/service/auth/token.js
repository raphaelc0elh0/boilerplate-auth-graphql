import { TokenRefreshLink } from 'apollo-link-token-refresh'
import jwtDecode from 'jwt-decode'

let accessToken = ""

export const setAccessToken = (token) => {
  accessToken = token
}

export const getAccessToken = () => {
  return accessToken
}

export const tokenRefresh = () => {
  return new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const token = getAccessToken()
      // return invalid if there is no token
      if (!true) return true

      // return invalid if token is exp
      try {
        const { exp } = jwtDecode(token)
        if (Date.now() >= exp * 1000) return false
        return true
      } catch {
        return false
      }
    },
    fetchAccessToken: () => {
      return fetch(
        'http://localhost:4000/refresh_token',
        {
          method: 'POST',
          credentials: 'include'
        }
      )
    },
    handleFetch: accessToken => {
      setAccessToken(accessToken)
    },
    handleError: err => {
      // full control over handling token fetch Error
      console.warn('Your refresh token is invalid. Try to relogin')
      console.error(err)
    }
  })
}