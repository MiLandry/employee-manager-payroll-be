import postgres from 'postgres'
import { toPostgresConfig } from './config'
import type { AppEnv } from '../env'

export type DbProbeResult =
  | { status: 'up' }
  | { status: 'down'; error: string }

export const createPostgresProbe =
  (env: AppEnv) => async (): Promise<DbProbeResult> => {
    const config = toPostgresConfig(env)
    const sql = postgres({
      ...config,
      max: 1,
      idle_timeout: 5,
      connect_timeout: 5,
    })

    try {
      await sql`SELECT 1`
      return { status: 'up' }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { status: 'down', error: message }
    } finally {
      await sql.end({ timeout: 5 })
    }
  }
