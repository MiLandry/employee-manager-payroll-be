export const typeDefs = /* GraphQL */ `
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.3"
      import: ["@key", "@external"]
    )

  extend type Employee @key(fields: "id") {
    id: ID! @external
    compensationSummary: CompensationSummary
    lastPayStub: PayStub
  }

  type CompensationSummary {
    payGrade: String!
    currency: String!
    annualBase: Float!
  }

  type PayStub {
    periodEnd: String!
    netPay: Float!
    currency: String!
  }

  type Query {
    payrollStatus: String!
  }
`
