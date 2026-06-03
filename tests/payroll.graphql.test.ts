import { describe, expect, test } from 'bun:test'
import { createApp } from '../src/app'
import type { PayrollService } from '../src/payroll/service'

const adminHeaders = {
  'x-mock-user-id': 'u-admin',
  'x-mock-roles': 'admin',
}

const viewerHeaders = {
  'x-mock-user-id': 'u-viewer',
  'x-mock-roles': 'viewer',
}

const EMPLOYEE_PAYROLL = /* GraphQL */ `
  query EmployeePayroll($representations: [_Any!]!) {
    _entities(representations: $representations) {
      ... on Employee {
        id
        compensationSummary {
          payGrade
          annualBase
        }
      }
    }
  }
`

const createMockPayrollService = (
  overrides: Partial<PayrollService> = {},
): PayrollService => ({
  getCompensationSummary: async () => ({
    payGrade: 'L5',
    currency: 'USD',
    annualBase: 125000,
  }),
  getLastPayStub: async () => ({
    periodEnd: '2026-05-15',
    netPay: 8000,
    currency: 'USD',
  }),
  ...overrides,
})

describe('Payroll subgraph', () => {
  test('compensation on Employee requires admin role', async () => {
    const app = createApp({ payroll: createMockPayrollService() })
    const res = await app.request('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...viewerHeaders },
      body: JSON.stringify({
        query: EMPLOYEE_PAYROLL,
        variables: {
          representations: [{ __typename: 'Employee', id: '11111111-1111-1111-1111-111111111111' }],
        },
      }),
    })
    const body = (await res.json()) as {
      errors?: Array<{ extensions?: { code?: string } }>
    }
    expect(body.errors?.[0]?.extensions?.code).toBe('FORBIDDEN')
  })

  test('compensation resolves for admin via _entities', async () => {
    const app = createApp({ payroll: createMockPayrollService() })
    const res = await app.request('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...adminHeaders },
      body: JSON.stringify({
        query: EMPLOYEE_PAYROLL,
        variables: {
          representations: [{ __typename: 'Employee', id: '11111111-1111-1111-1111-111111111111' }],
        },
      }),
    })
    const body = (await res.json()) as {
      data?: { _entities: Array<{ compensationSummary?: { payGrade: string } }> }
    }
    expect(body.data?._entities[0]?.compensationSummary?.payGrade).toBe('L5')
  })
})
