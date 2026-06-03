import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getPool } from '../src/db/connection'
import { loadEnv } from '../src/env'

const main = async (): Promise<void> => {
  const env = loadEnv()
  const sql = getPool(env)
  const seedPath = join(import.meta.dir, '../src/db/seeds/dev-payroll.sql')
  const seedSql = await readFile(seedPath, 'utf8')
  await sql.unsafe(seedSql)
  console.log('Payroll seed data applied.')
  await sql.end({ timeout: 5 })
}

if (import.meta.main) {
  main().catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
}
