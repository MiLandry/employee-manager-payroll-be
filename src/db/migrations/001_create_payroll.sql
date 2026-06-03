CREATE TABLE employee_compensation (
  employee_id UUID PRIMARY KEY,
  pay_grade TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  annual_base NUMERIC(12, 2) NOT NULL CHECK (annual_base >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE employee_pay_stubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employee_compensation (employee_id) ON DELETE CASCADE,
  period_end DATE NOT NULL,
  net_pay NUMERIC(12, 2) NOT NULL CHECK (net_pay >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pay_stubs_employee_period ON employee_pay_stubs (employee_id, period_end DESC);
