// Constants as of July 1, 2024
export const BASE_SALARY = 2340000;

export const REGIONAL_MINIMUM_WAGES = {
  1: 4960000,
  2: 4410000,
  3: 3860000,
  4: 3450000
};

export interface UnemploymentResult {
  monthlyPayout: number;
  durationMonths: number;
  maxCap: number;
}

export interface DeathBenefitResult {
  funeralAllowance: number;
  monthlySurvivorBenefit: number;
  oneTimeSurvivorBenefit: number;
}

/**
 * Calculate Unemployment Benefit
 * @param avgSalary6Mo The average monthly salary of the 6 consecutive months before termination
 * @param contributionMonths Total contribution months to UI
 * @param region Region 1, 2, 3, or 4
 */
export function calculateUnemploymentBenefit(
  avgSalary6Mo: number,
  contributionMonths: number,
  region: 1 | 2 | 3 | 4
): UnemploymentResult {
  const basePayout = avgSalary6Mo * 0.6;
  const maxCap = REGIONAL_MINIMUM_WAGES[region] * 5;
  const monthlyPayout = Math.min(basePayout, maxCap);

  // Duration logic:
  // 12-36 months = 3 months benefit
  // Every extra 12 months = +1 month benefit
  // Max 12 months
  let durationMonths = 0;
  if (contributionMonths >= 12) {
    durationMonths = 3 + Math.floor((contributionMonths - 36) / 12);
    if (contributionMonths < 36) durationMonths = 3;
    durationMonths = Math.min(durationMonths, 12);
  }

  return {
    monthlyPayout,
    durationMonths,
    maxCap
  };
}

/**
 * Calculate basic Death Benefits
 * @param avgSalaryLife Average salary used for SI contribution (for one-time benefit calculation)
 * @param hasUnskilledRelative If the relative has no direct support (70% vs 50% rate)
 * @param yearsPost2014 Contribution years after 2014
 * @param yearsPre2014 Contribution years before 2014
 */
export function calculateDeathSupport(
  avgSalaryLife: number,
  hasUnskilledRelative: boolean,
  yearsPost2014: number,
  yearsPre2014: number
): DeathBenefitResult {
  const funeralAllowance = BASE_SALARY * 10;
  
  // Monthly benefit per relative
  const monthlySurvivorBenefit = hasUnskilledRelative 
    ? BASE_SALARY * 0.7 
    : BASE_SALARY * 0.5;

  // One-time benefit (approximate logic)
  const oneTimeSurvivorBenefit = (yearsPre2014 * 1.5 + yearsPost2014 * 2) * avgSalaryLife;

  return {
    funeralAllowance,
    monthlySurvivorBenefit,
    oneTimeSurvivorBenefit
  };
}
