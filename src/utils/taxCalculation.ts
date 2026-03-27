export interface TaxConfig {
  grossSalary: number;
  dependents: number;
  isExpat: boolean;
  currency: 'VND' | 'USD';
  exchangeRate: number; // 1 USD = ? VND
  period: 'monthly' | 'annually' | 'fortnightly';
}

export interface TaxResult {
  grossVND: number;
  grossUSD: number;
  socialInsuranceVND: number;
  healthInsuranceVND: number;
  unemploymentInsuranceVND: number;
  totalInsuranceVND: number;
  totalBeforeTaxVND: number;
  personalDeductionVND: number;
  dependentDeductionVND: number;
  taxableIncomeVND: number;
  personalIncomeTaxVND: number;
  netIncomeVND: number;
  netIncomeUSD: number;
}

// Vietnam Tax Constants (Region I, typical default) ALL IN MONTHLY BASIS
const BASE_SALARY_SI_HI = 2340000;
const REGION_1_MIN_WAGE = 4960000;
const CAP_SI_HI = BASE_SALARY_SI_HI * 20; // 46,800,000
const CAP_UI = REGION_1_MIN_WAGE * 20;    // 99,200,000

const RATE_SI = 0.08;
const RATE_HI = 0.015;
const RATE_UI = 0.01;

const PERSONAL_DEDUCTION = 11000000;
const DEPENDENT_DEDUCTION = 4400000;

function calculatePIT(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  
  let tax = 0;
  
  if (taxableIncome > 80000000) {
    tax += (taxableIncome - 80000000) * 0.35;
    taxableIncome = 80000000;
  }
  if (taxableIncome > 52000000) {
    tax += (taxableIncome - 52000000) * 0.30;
    taxableIncome = 52000000;
  }
  if (taxableIncome > 32000000) {
    tax += (taxableIncome - 32000000) * 0.25;
    taxableIncome = 32000000;
  }
  if (taxableIncome > 18000000) {
    tax += (taxableIncome - 18000000) * 0.20;
    taxableIncome = 18000000;
  }
  if (taxableIncome > 10000000) {
    tax += (taxableIncome - 10000000) * 0.15;
    taxableIncome = 10000000;
  }
  if (taxableIncome > 5000000) {
    tax += (taxableIncome - 5000000) * 0.10;
    taxableIncome = 5000000;
  }
  if (taxableIncome > 0) {
    tax += taxableIncome * 0.05;
  }
  
  return tax;
}

export function calculateNetIncome(config: TaxConfig): TaxResult {
  const { grossSalary, dependents, isExpat, currency, exchangeRate, period } = config;

  // 1. Convert to Monthly basis for Vietnam PIT laws
  let monthlyScale = 1;
  if (period === 'annually') monthlyScale = 1 / 12;
  else if (period === 'fortnightly') monthlyScale = 26 / 12;
  
  const monthlyGross = grossSalary * monthlyScale;

  // Convert gross to VND for calculation
  const grossVND = currency === 'USD' ? monthlyGross * exchangeRate : monthlyGross;

  // Insurance Calculations (Caps applied accurately to Monthly gross)
  const siSalary = Math.min(grossVND, CAP_SI_HI);
  const hiSalary = Math.min(grossVND, CAP_SI_HI);
  const uiSalary = Math.min(grossVND, CAP_UI);

  const socialInsuranceVND = siSalary * RATE_SI;
  const healthInsuranceVND = hiSalary * RATE_HI;
  const unemploymentInsuranceVND = isExpat ? 0 : uiSalary * RATE_UI;

  const totalInsurance = socialInsuranceVND + healthInsuranceVND + unemploymentInsuranceVND;
  const totalBeforeTaxVND = grossVND - totalInsurance;

  const personalDeductionVND = PERSONAL_DEDUCTION;
  const dependentDeductionVND = dependents * DEPENDENT_DEDUCTION;
  
  const totalDeductions = personalDeductionVND + dependentDeductionVND;

  const taxableIncomeVND = Math.max(0, totalBeforeTaxVND - totalDeductions);
  const personalIncomeTaxVND = calculatePIT(taxableIncomeVND);

  const netIncomeVND = totalBeforeTaxVND - personalIncomeTaxVND;

  // 2. Scale back to the requested Period
  const resultScale = 1 / monthlyScale;
  
  const finalGrossVND = grossVND * resultScale;
  const finalNetVND = netIncomeVND * resultScale;

  return {
    grossVND: finalGrossVND,
    grossUSD: finalGrossVND / exchangeRate,
    socialInsuranceVND: socialInsuranceVND * resultScale,
    healthInsuranceVND: healthInsuranceVND * resultScale,
    unemploymentInsuranceVND: unemploymentInsuranceVND * resultScale,
    totalInsuranceVND: totalInsurance * resultScale,
    totalBeforeTaxVND: totalBeforeTaxVND * resultScale,
    personalDeductionVND: personalDeductionVND * resultScale,
    dependentDeductionVND: dependentDeductionVND * resultScale,
    taxableIncomeVND: taxableIncomeVND * resultScale,
    personalIncomeTaxVND: personalIncomeTaxVND * resultScale,
    netIncomeVND: finalNetVND,
    netIncomeUSD: finalNetVND / exchangeRate
  };
}
