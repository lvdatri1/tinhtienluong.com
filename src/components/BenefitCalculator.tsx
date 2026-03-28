'use client';

import React, { useState, useEffect } from 'react';
import styles from './BenefitCalculator.module.css';
import en from '../locales/en.json';
import vi from '../locales/vi.json';
import { 
  calculateUnemploymentBenefit, 
  calculateDeathSupport,
  REGIONAL_MINIMUM_WAGES 
} from '../utils/benefitCalculation';

interface BenefitProps {
  lang: 'en' | 'vi';
}

export default function BenefitCalculator({ lang }: BenefitProps) {
  const t: any = lang === 'en' ? en : vi;
  const [mode, setMode] = useState<'unemployment' | 'death' | 'maternity' | 'sickness'>('unemployment');
  
  // Unemployment States
  const [avgSalary, setAvgSalary] = useState<string>('20000000');
  const [contributionYears, setContributionYears] = useState<number>(3);
  const [region, setRegion] = useState<1 | 2 | 3 | 4>(1);
  const [unemploymentResult, setUnemploymentResult] = useState<any>(null);

  // Death Support States
  const [relatives, setRelatives] = useState<number>(1);
  const [hasUnskilled, setHasUnskilled] = useState<boolean>(false);
  const [deathResult, setDeathResult] = useState<any>(null);

  // Sickness & Maternity
  const [sickDays, setSickDays] = useState<number>(5);
  const [maternityResult, setMaternityResult] = useState<any>(null);
  const [sicknessResult, setSicknessResult] = useState<any>(null);

  const BASE_SALARY = 2340000; // 2.34M VND as of 2024

  useEffect(() => {
    const cleanAvg = parseFloat(avgSalary.replace(/[^0-9]/g, '')) || 0;

    if (mode === 'unemployment') {
      const res = calculateUnemploymentBenefit(
        cleanAvg,
        contributionYears * 12,
        region
      );
      setUnemploymentResult(res);
    } else if (mode === 'death') {
      const res = calculateDeathSupport(
        cleanAvg,
        hasUnskilled,
        contributionYears,
        0
      );
      setDeathResult(res);
    } else if (mode === 'maternity') {
      setMaternityResult({
        total: cleanAvg * 6,
        allowance: BASE_SALARY * 2
      });
    } else if (mode === 'sickness') {
      const dailyRate = (cleanAvg / 24) * 0.75;
      setSicknessResult({
        dailyRate,
        total: dailyRate * sickDays
      });
    }
  }, [mode, avgSalary, contributionYears, region, hasUnskilled, sickDays]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`${styles.container} glass-panel`}>
      <div className={styles.typeSwitcher}>
        <button 
          className={`${styles.typeBtn} ${mode === 'unemployment' ? styles.active : ''}`}
          onClick={() => setMode('unemployment')}
        >{t.unemploymentMode}</button>
        <button 
          className={`${styles.typeBtn} ${mode === 'death' ? styles.active : ''}`}
          onClick={() => setMode('death')}
        >{t.deathSupportMode}</button>
        <button 
          className={`${styles.typeBtn} ${mode === 'maternity' ? styles.active : ''}`}
          onClick={() => setMode('maternity')}
        >{t.maternityMode}</button>
        <button 
          className={`${styles.typeBtn} ${mode === 'sickness' ? styles.active : ''}`}
          onClick={() => setMode('sickness')}
        >{t.sicknessMode}</button>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.avgSalary6Mo} (VND)</label>
          <input 
            type="text"
            className={styles.input}
            value={avgSalary}
            onChange={(e) => {
              const numeric = e.target.value.replace(/[^0-9]/g, '');
              if (numeric === '') setAvgSalary('');
              else setAvgSalary(parseInt(numeric, 10).toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN'));
            }}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.contributionYears}</label>
          <input 
            type="number"
            className={styles.input}
            value={contributionYears}
            onChange={(e) => setContributionYears(parseInt(e.target.value) || 0)}
          />
        </div>

        {mode === 'unemployment' && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t.selectRegion}</label>
            <select 
              className={styles.select}
              value={region}
              onChange={(e) => setRegion(parseInt(e.target.value) as any)}
            >
              <option value={1}>{t.region1}</option>
              <option value={2}>{t.region2}</option>
              <option value={3}>{t.region3}</option>
              <option value={4}>{t.region4}</option>
            </select>
          </div>
        )}

        {mode === 'death' && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t.numRelatives}</label>
            <div className={styles.checkboxGroup}>
              <input 
                type="number" 
                className={styles.input} 
                style={{width: '60px'}}
                value={relatives}
                onChange={(e) => setRelatives(parseInt(e.target.value) || 0)}
              />
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={hasUnskilled} 
                  onChange={(e) => setHasUnskilled(e.target.checked)}
                />
                {t.hasNoDirectSupport}
              </label>
            </div>
          </div>
        )}

        {mode === 'sickness' && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t.sickLeaveDays}</label>
            <input 
              type="number" 
              className={styles.input} 
              value={sickDays}
              onChange={(e) => setSickDays(parseInt(e.target.value) || 0)}
            />
          </div>
        )}
      </div>

      <div className={styles.resultsArea}>
        <h3 className={styles.resultTitle}>{t.benefitDetails}</h3>
        
        {mode === 'unemployment' && unemploymentResult && (
          <div className={styles.resultList}>
            <div className={styles.resultRow}>
              <span>{t.payoutPerMonth}</span>
              <span className={styles.value}>{formatCurrency(unemploymentResult.monthlyPayout)}</span>
            </div>
            <div className={styles.resultRow}>
              <span>{t.payoutDuration}</span>
              <span className={styles.value}>{unemploymentResult.durationMonths}</span>
            </div>
            <div className={styles.resultRow}>
              <span>{t.maxPayoutCap}</span>
              <span className={styles.value}>{formatCurrency(unemploymentResult.maxCap)}</span>
            </div>
          </div>
        )}

         {mode === 'death' && deathResult && (
           <div className={styles.resultList}>
             <div className={styles.resultRow}>
               <span>{t.funeralAllowance}</span>
               <span className={styles.value}>{formatCurrency(deathResult.funeralAllowance)}</span>
             </div>
             <div className={styles.resultRow}>
               <span>{t.survivorBenefit} ({t.monthly})</span>
               <span className={styles.value}>
                 {formatCurrency(deathResult.monthlySurvivorBenefit * relatives)}
               </span>
             </div>
             <div className={styles.resultRow}>
               <span>{t.survivorBenefitOneTime}</span>
               <span className={styles.value}>{formatCurrency(deathResult.oneTimeSurvivorBenefit)}</span>
             </div>
           </div>
         )}
 
         {mode === 'maternity' && maternityResult && (
           <div className={styles.resultList}>
             <div className={styles.resultRow}>
               <span>{t.oneTimeAllowance}</span>
               <span className={styles.value}>{formatCurrency(maternityResult.allowance)}</span>
             </div>
             <div className={styles.resultRow}>
               <span>{t.benefitTitleMaternity}</span>
               <span className={styles.value}>{formatCurrency(maternityResult.total)}</span>
             </div>
             <div className={styles.resultRow} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
               <span style={{ fontWeight: '800' }}>{t.totalPayment}</span>
               <span className={styles.value} style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>
                 {formatCurrency(maternityResult.total + maternityResult.allowance)}
               </span>
             </div>
           </div>
         )}
 
         {mode === 'sickness' && sicknessResult && (
           <div className={styles.resultList}>
             <div className={styles.resultRow}>
               <span>{t.benefitTitleSickness}</span>
               <span className={styles.value}>{formatCurrency(sicknessResult.total)}</span>
             </div>
             <div className={styles.resultRow}>
               <span>{t.monthly} ({t.avgSalary6Mo})</span>
               <span className={styles.value}>{avgSalary}</span>
             </div>
           </div>
         )}

        <div className={`${styles.printContainer} no-print`}>
          <button className={styles.printBtn} onClick={() => window.print()}>
            🖨️ {t.printReport}
          </button>
        </div>
       </div>
    </div>
  );
}
