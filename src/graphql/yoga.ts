import { buildSubgraphSchema } from '@apollo/subgraph'
import { parse } from 'graphql'
import { createYoga } from 'graphql-yoga'
import { resolveMockPrincipal } from '../auth/mockPrincipal'
import type { AppDeps } from '../app'
import type { GraphQLContext } from './context'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'

export const createGraphQLYoga = (deps: AppDeps) => {
  const resolvePrincipal = deps.resolvePrincipal ?? resolveMockPrincipal

  return createYoga({
    schema: buildSubgraphSchema([{ typeDefs: parse(typeDefs), resolvers }]),
    graphqlEndpoint: '/graphql',
    graphiql: process.env.NODE_ENV !== 'production',
    context: ({ request }): GraphQLContext => ({
      request,
      principal: resolvePrincipal(request),
      payroll: deps.payroll,
    }),
  })
}
