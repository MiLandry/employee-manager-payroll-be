import type { Principal } from '../auth/types'
import type { PayrollService } from '../payroll/service'

export type GraphQLContext = {
  request: Request
  principal: Principal | null
  payroll?: PayrollService
}
