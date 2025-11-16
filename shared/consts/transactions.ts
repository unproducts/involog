export const transactionCategoriesMap = {
  ADV: 'Advertising',
  BIL: 'Bills',
  CAR: 'Car',
  ENT: 'Entertainment',
  EQU: 'Equipment',
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
  CON: 'Consulting',
  FEE: 'Fees',
  INT: 'Interest',
  INV: 'Investment',
  LOA: 'Loan',
  SLE: 'Sale',
} as const;

export type TransactionCategory = keyof typeof transactionCategoriesMap;
export const transactionCategories = Object.keys(transactionCategoriesMap) as TransactionCategory[];
transactionCategories.sort();

export const transactionCategoryDetails = transactionCategories.map((code) => ({
  category: transactionCategoriesMap[code as TransactionCategory],
  code: code as TransactionCategory,
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
