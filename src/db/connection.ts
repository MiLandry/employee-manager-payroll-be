import postgres from 'postgres'
import type { Sql } from 'postgres'
import { toPostgresConfig } from './config'
import type { AppEnv } from '../env'

let pool: Sql | undefined

export const getPool = (env: AppEnv): Sql => {
  if (!pool) {
    const config = toPostgresConfig(env)
    pool = postgres({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 5,
    })
  }
  return pool
}

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end({ timeout: 5 })
    pool = undefined
  }
}
