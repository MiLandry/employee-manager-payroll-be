import type { AppEnv } from '../env'
import {
  getCompensationSummary,
  getLastPayStub,
} from './repository'
import type { CompensationSummary, PayStub } from './types'

export type PayrollService = {
  getCompensationSummary: (employeeId: string) => Promise<CompensationSummary | null>
  getLastPayStub: (employeeId: string) => Promise<PayStub | null>
}

export const createPayrollService = (env: AppEnv): PayrollService => ({
  getCompensationSummary: (employeeId) =>
    getCompensationSummary(employeeId, { env }),
  getLastPayStub: (employeeId) => getLastPayStub(employeeId, { env }),
})
