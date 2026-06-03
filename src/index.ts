import { ZodError } from 'zod'
import { createApp } from './app'
import { createPostgresProbe } from './db/probe'
import { createPayrollService } from './payroll/service'
import { loadEnv } from './env'

const readEnv = () => {
  try {
    return loadEnv()
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Invalid environment:', error.flatten().fieldErrors)
    } else {
      console.error('Invalid environment:', error)
    }
    process.exit(1)
  }
}

const env = readEnv()
const probeDb = createPostgresProbe(env)

const bootstrap = async (): Promise<void> => {
  const initial = await probeDb()
  if (initial.status !== 'up') {
    console.error('PostgreSQL connection failed — exiting.', initial.error)
    process.exit(1)
  }

  const app = createApp({
    payroll: createPayrollService(env),
  })

  Bun.serve({
    port: env.PORT,
    fetch: app.fetch,
  })

  console.log(
    `Payroll subgraph on http://localhost:${env.PORT}/graphql (PostgreSQL OK at startup)`,
  )
}

void bootstrap()
