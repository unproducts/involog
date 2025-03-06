export const expenseCategoriesMap = {
  ADV: 'Advertising',
  BIL: 'Bills',
  CAR: 'Car',
  CON: 'Consulting',
  ENT: 'Entertainment',
  EQU: 'Equipment',
  FEE: 'Fees',
  INS: 'Insurance',
  LAB: 'Labor',
  OFF: 'Office',
  RNT: 'Rent',
  SAL: 'Salary',
  SFT: 'Software',
  TAX: 'Taxes',
  TRV: 'Travel',
  UTL: 'Utilities',
  OTH: 'Other',
} as const;

export type ExpenseCategory = keyof typeof expenseCategoriesMap;
export const expenseCategories = Object.keys(expenseCategoriesMap) as ExpenseCategory[];
expenseCategories.sort();

export const expenseCategoryDetails = expenseCategories.map((code) => ({
  category: expenseCategoriesMap[code as ExpenseCategory],
  code: code as ExpenseCategory,
}));

export const incomeCategoriesMap = {
  CON: 'Consulting',
  FEE: 'Fees',
  INT: 'Interest',
  INV: 'Investment',
  LAB: 'Labor',
  LOA: 'Loan',
  SAL: 'Salary',
  SFT: 'Software',
  SLE: 'Sale',
  OTH: 'Other',
} as const;

export type IncomeCategory = keyof typeof incomeCategoriesMap;
export const incomeCategories = Object.keys(incomeCategoriesMap) as IncomeCategory[];
incomeCategories.sort();

export const incomeCategoryDetails = incomeCategories.map((code) => ({
  category: incomeCategoriesMap[code as IncomeCategory],
  code: code as IncomeCategory,
}));

export const TransactionTypes = {
  I: 'Income',
  E: 'Expense',
} as const;

export type TransactionType = keyof typeof TransactionTypes;
export const transactionTypes = Object.keys(TransactionTypes) as TransactionType[];
transactionTypes.sort();

export const transactionTypeDetails = transactionTypes.map((code) => ({
  type: TransactionTypes[code as TransactionType],
  code: code as TransactionType,
}));
