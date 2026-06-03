import { authorize } from '../auth/policy'
import type { EmployeePayrollReference } from '../payroll/types'
import type { GraphQLContext } from './context'
import { graphqlAuthError } from './errors'

const requirePayrollService = (ctx: GraphQLContext) => {
  if (!ctx.payroll) {
    throw new Error('Payroll service is not configured')
  }
  return ctx.payroll
}

const requireCompensationRead = (ctx: GraphQLContext): void => {
  const decision = authorize(ctx.principal, 'read', 'compensation')
  if (decision.allow) {
    return
  }

  throw graphqlAuthError(
    decision.reason,
    decision.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN',
  )
}

export const resolvers = {
  Query: {
    payrollStatus: () => 'ok',
  },

  Employee: {
    __resolveReference: (reference: { id: string }): EmployeePayrollReference => ({
      id: reference.id,
    }),

    compensationSummary: async (
      parent: EmployeePayrollReference,
      _args: unknown,
      ctx: GraphQLContext,
    ) => {
      requireCompensationRead(ctx)
      return requirePayrollService(ctx).getCompensationSummary(parent.id)
    },

    lastPayStub: async (
      parent: EmployeePayrollReference,
      _args: unknown,
      ctx: GraphQLContext,
    ) => {
      requireCompensationRead(ctx)
      return requirePayrollService(ctx).getLastPayStub(parent.id)
    },
  },
}
