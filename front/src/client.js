import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, Observable } from 'apollo-link'
import { getAccessToken, tokenRefresh } from './service/auth/token'

const cache = new InMemoryCache()

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle
    Promise.resolve(operation)
      .then(operation => {
        // add the authorization to the headers
        const accessToken = getAccessToken()

        operation.setContext({
          headers: {
            authorization: accessToken ? `bearer ${accessToken}` : "",
          }
        })
      })
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        })
      })
      .catch(observer.error.bind(observer))

    return () => {
      if (handle) handle.unsubscribe()
    }
  })
)

export const client = new ApolloClient({
  link: ApolloLink.from([
    tokenRefresh(),
    onError(({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors, "graphql error")
      console.log(networkError, "network error")
    }),
    requestLink,
    new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'include'
    })
  ]),
  cache
})
