import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { resolveMockPrincipal } from './auth/mockPrincipal'
import type { Principal } from './auth/types'
import { createGraphQLYoga } from './graphql/yoga'
import type { PayrollService } from './payroll/service'

export type AppDeps = {
  resolvePrincipal?: (request: Request) => Principal | null
  payroll?: PayrollService
}

export const createApp = (deps: AppDeps): Hono => {
  const app = new Hono()
  const yoga = createGraphQLYoga(deps)

  app.use(
    '*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: [
        'Content-Type',
        'Accept',
        'x-mock-user-id',
        'x-mock-roles',
        'x-mock-tenant-id',
      ],
    }),
  )

  app.all('/graphql', async (c) => {
    return yoga.fetch(c.req.raw)
  })

  app.onError((err, c) => {
    console.error(err)
    return c.json({ error: err.message || 'Internal Server Error' }, 500)
  })

  return app
}
