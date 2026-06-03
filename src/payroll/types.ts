export type CompensationSummary = {
  payGrade: string
  currency: string
  annualBase: number
}

export type PayStub = {
  periodEnd: string
  netPay: number
  currency: string
}

export type EmployeePayrollReference = {
  id: string
}
