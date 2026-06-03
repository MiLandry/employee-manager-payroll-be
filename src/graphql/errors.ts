import { GraphQLError } from 'graphql'

export const graphqlAuthError = (
  message: string,
  code: 'UNAUTHENTICATED' | 'FORBIDDEN',
): GraphQLError =>
  new GraphQLError(message, {
    extensions: {
      code,
      http: { status: code === 'UNAUTHENTICATED' ? 401 : 403 },
    },
  })
