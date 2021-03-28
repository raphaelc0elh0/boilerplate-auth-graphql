import "dotenv/config"
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const expressJWT = require("express-jwt")
const { ApolloServer } = require("apollo-server-express")
const { applyMiddleware } = require("graphql-middleware")
const helmet = require('helmet')

const schema = require('./src/graphql')
import { context } from './middleware/context'
import { permissions } from './middleware/shield'
import { verifyRefreshToken } from "./src/service/auth/tokens"

// express server
const app = express()

//cors
const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true
}
app.use(cors(corsConfig));

// cookieParser (passes cookies in headers as req.cookies)
app.use(cookieParser())
app.post("/refresh_token", (req, res) => {
  return verifyRefreshToken({ req, res })
})

// expressJWT (passes authorization header bearer value already validated as req.user)
const auth = expressJWT({
  secret: process.env.ACCESS_TOKEN_SECRET,
  algorithms: ['sha1', 'RS256', 'HS256'],
  credentialsRequired: false,
})
app.use(auth)

// apollo server
const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: context,
  formatError: error => ({
    message: error.message,
    state: error.originalError && error.originalError.state,
    locations: error.locations,
    path: error.path
  })
})
server.applyMiddleware({ app, cors: false })

// helmet
app.use(helmet())

app.listen(4000, () =>
  console.log(`🚀 Server ready at: http://localhost:4000`)
)