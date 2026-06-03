import type { Sql } from 'postgres'
import type { AppEnv } from '../env'
import { getPool } from '../db/connection'
import type { CompensationSummary, PayStub } from './types'

export type PayrollRepositoryDeps = {
  sql?: Sql
  env?: AppEnv
}

const resolveSql = (deps: PayrollRepositoryDeps): Sql => {
  if (deps.sql) {
    return deps.sql
  }
  if (!deps.env) {
    throw new Error('Payroll repository requires sql or env')
  }
  return getPool(deps.env)
}

export const getCompensationSummary = async (
  employeeId: string,
  deps: PayrollRepositoryDeps = {},
): Promise<CompensationSummary | null> => {
  const sql = resolveSql(deps)
  const rows = await sql<
    { pay_grade: string; currency: string; annual_base: string }[]
  >`
    SELECT pay_grade, currency, annual_base
    FROM employee_compensation
    WHERE employee_id = ${employeeId}
  `

  const row = rows[0]
  if (!row) {
    return null
  }

  return {
    payGrade: row.pay_grade,
    currency: row.currency,
    annualBase: Number(row.annual_base),
  }
}

export const getLastPayStub = async (
  employeeId: string,
  deps: PayrollRepositoryDeps = {},
): Promise<PayStub | null> => {
  const sql = resolveSql(deps)
  const rows = await sql<
    { period_end: Date; net_pay: string; currency: string }[]
  >`
    SELECT period_end, net_pay, currency
    FROM employee_pay_stubs
    WHERE employee_id = ${employeeId}
    ORDER BY period_end DESC
    LIMIT 1
  `

  const row = rows[0]
  if (!row) {
    return null
  }

  return {
    periodEnd: row.period_end.toISOString().slice(0, 10),
    netPay: Number(row.net_pay),
    currency: row.currency,
  }
}
