import fs from 'fs'
import path from 'path'
import { makeExecutableSchema, gql } from 'apollo-server-express'
import { merge as mergeResolvers } from 'graphql-merge-resolvers'
import { typeDefs as scalarsTypeDefs, resolvers as scalarsResolvers } from 'graphql-scalars'

const defaultTypeDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`

// stitch all schemas in folder
let modulesTypeDefs = []
let modulesResolvers = {}
const basename = path.basename(__filename)

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const module = require(path.join(__dirname, file));
    modulesTypeDefs.push(module.typeDefs)
    modulesResolvers = mergeResolvers([modulesResolvers, module.resolvers], {})
  })

// merge schemas with graphql-scalars library schema
const mergedSchema = makeExecutableSchema({
  typeDefs: [defaultTypeDefs, ...scalarsTypeDefs, ...modulesTypeDefs],
  resolvers: mergeResolvers([scalarsResolvers, modulesResolvers], {})
})

module.exports = mergedSchema