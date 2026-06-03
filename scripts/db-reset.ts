import { loadEnv } from '../src/env'
import { runMigrations } from '../src/db/migrate'
import { getPool } from '../src/db/connection'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const main = async (): Promise<void> => {
  const env = loadEnv()
  const sql = getPool(env)

  await sql`DROP TABLE IF EXISTS employee_pay_stubs CASCADE`
  await sql`DROP TABLE IF EXISTS employee_compensation CASCADE`
  await sql`DROP TABLE IF EXISTS schema_migrations CASCADE`

  await sql.end({ timeout: 5 })

  await runMigrations(env)

  const seedPath = join(import.meta.dir, '../src/db/seeds/dev-payroll.sql')
  const seedSql = await readFile(seedPath, 'utf8')
  const seedPool = getPool(env)
  await seedPool.unsafe(seedSql)
  await seedPool.end({ timeout: 5 })

  console.log('Payroll database reset complete.')
}

if (import.meta.main) {
  main().catch((error) => {
    console.error('Reset failed:', error)
    process.exit(1)
  })
}
