import { rule, shield, allow, deny } from 'graphql-shield'

const isLoggedIn = rule({ cache: 'contextual' })(
  async (_, __, { user }) => {
    if (user) {
      return true
    }
    throw new Error("Você não está logado")
  },
)

const isNotLoggedIn = rule({ cache: 'contextual' })(
  async (_, __, { user }) => {
    if (user) {
      throw new Error("Você já está logado")
    }
    return true
  },
)

export const permissions = shield(
  {
    Query: {
      "*": allow
    },
    Mutation: {
      "*": allow
    },
  },
  {
    fallbackRule: allow,
    debug: true
  }
)