import { gql, ApolloError } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import { createRefreshToken, createAccessToken, sendRefreshToken } from '../service/auth/tokens'

// db
const { User } = require('../../models')

const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: EmailAddress
    role: String
  }
  input UserInput {
    name: String!
    email: EmailAddress!
    password: String!
    role: String!
  }
  input UserCredentials {
    email: EmailAddress!
    password: String!
  }
  type LoginResponse {
    accessToken: String
    user: User
  }
  extend type Query {
    me: User
    users: [User]
  }
  extend type Mutation {
    register(input: UserInput!): Boolean
    login(input: UserCredentials!): LoginResponse
    logout: Boolean
    revokeRefreshTokens(id: ID!): Boolean
  }
`

const resolvers = {
  Query: {
    async me(_, __, { user }) {
      if (!user) return null
      return await User.findByPk(user.id)
    },
    async users() {
      return await User.findAll()
    }
  },
  Mutation: {
    async register(_, { input }) {
      const existingUser = await User.findOne({ where: { email: input.email } })
      if (existingUser) throw new Error("Email já cadastrado")

      try {
        await User.create({
          name: input.name,
          email: input.email,
          password: await bcrypt.hash(input.password, 10),
          role: input.role
        })
      } catch (err) {
        console.log(err)
        return false
      }

      return true
    },
    async login(_, { input }, { res }) {
      // find user
      const user = await User.findOne({ where: { email: input.email } })
      if (!user) throw new Error("Este usuário não existe")

      // check if passowrd is valid
      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) throw new Error("Senha incorreta")

      // send a httpOnly cookie
      sendRefreshToken(res, user)

      // return token
      return {
        accessToken: createAccessToken(user),
        user
      }
    },
    async logout(_, __, { res }) {
      sendRefreshToken(res, null)

      return true
    },
    async revokeRefreshTokens(_, { id }) {
      await User.increment(
        { tokenVersion: +1 },
        { where: { id: id } }
      )

      return true
    }
  }
}

module.exports = { typeDefs, resolvers }