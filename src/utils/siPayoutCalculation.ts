/**
 * Social Insurance One-time Payout (BHXH Một Lần) Calculation Rules (2025)
 * Based on Circular 01/2025/TT-BLDTBXH
 */

export const SI_COEFFICIENTS: Record<number, number> = {
  1994: 5.63,
  1995: 4.78,
  1996: 4.51,
  1997: 4.37,
  1998: 4.14,
  1999: 4.00,
  2000: 3.89,
  2001: 3.89,
  2002: 3.74,
  2003: 3.55,
  2004: 3.25,
  2005: 2.98,
  2006: 2.75,
  2007: 2.52,
  2008: 2.17,
  2009: 2.05,
  2010: 1.90,
  2011: 1.60,
  2012: 1.47,
  2013: 1.42,
  2014: 1.39,
  2015: 1.41,
  2016: 1.38,
  2017: 1.34,
  2018: 1.30,
  2019: 1.26,
  2020: 1.23,
  2021: 1.21,
  2022: 1.16,
  2023: 1.08,
  2024: 1.02,
  2025: 1.00,
};

export interface SIPeriod {
  year: number;
  months: number;
  salary: number;
}

export interface SIPayoutResult {
  avgSalary: number;
  totalBefore2014Years: number;
  totalFrom2014Years: number;
  payoutBefore2014: number;
  payoutFrom2014: number;
  totalPayout: number;
  details: any[];
}

/**
 * Rounds months to years as per SI rules:
 * 1-6 months = 0.5 year
 * 7-12 months = 1.0 year
 */
export const roundMonthsToSiYears = (months: number): number => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) return years;
  if (remainingMonths <= 6) return years + 0.5;
  return years + 1;
};

export const calculateOneTimeSIPayout = (periods: SIPeriod[]): SIPayoutResult => {
  let totalAdjustedSalary = 0;
  let totalMonths = 0;
  let totalMonthsBefore2014 = 0;
  let totalMonthsFrom2014 = 0;
  const details: any[] = [];

  periods.forEach(p => {
    const coeff = SI_COEFFICIENTS[p.year] || 1.0;
    const adjustedSalaryRow = p.salary * coeff * p.months;
    
    totalAdjustedSalary += adjustedSalaryRow;
    totalMonths += p.months;

    if (p.year < 2014) {
      totalMonthsBefore2014 += p.months;
    } else {
      totalMonthsFrom2014 += p.months;
    }

    details.push({
      ...p,
      coeff,
      adjustedTotal: adjustedSalaryRow
    });
  });

  const avgSalary = totalMonths > 0 ? totalAdjustedSalary / totalMonths : 0;

  // Multipliers
  // Before 2014: 1.5 x years
  // From 2014: 2.0 x years
  
  const yearsBefore2014 = roundMonthsToSiYears(totalMonthsBefore2014);
  const yearsFrom2014 = roundMonthsToSiYears(totalMonthsFrom2014);

  const payoutBefore2014 = avgSalary * 1.5 * yearsBefore2014;
  const payoutFrom2014 = avgSalary * 2.0 * yearsFrom2014;

  return {
    avgSalary,
    totalBefore2014Years: yearsBefore2014,
    totalFrom2014Years: yearsFrom2014,
    payoutBefore2014,
    payoutFrom2014,
    totalPayout: payoutBefore2014 + payoutFrom2014,
    details
  };
};
