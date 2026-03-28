'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './SIPayoutCalculator.module.css';
import en from '../locales/en.json';
import vi from '../locales/vi.json';
import { 
  calculateOneTimeSIPayout, 
  SIPayoutResult, 
  SIPeriod 
} from '../utils/siPayoutCalculation';

interface SIPayoutProps {
  lang: 'en' | 'vi';
}

export default function SIPayoutCalculator({ lang }: SIPayoutProps) {
  const t: any = lang === 'en' ? en : vi;
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick');

  // Quick mode states
  const [quickAvgSalary, setQuickAvgSalary] = useState<string>('20,000,000');
  const [quickYearsBefore, setQuickYearsBefore] = useState<number>(2);
  const [quickYearsAfter, setQuickYearsAfter] = useState<number>(3);

  // Detailed mode states
  const [detailedPeriods, setDetailedPeriods] = useState<SIPeriod[]>([
    { year: 2023, months: 12, salary: 15000000 },
    { year: 2024, months: 6, salary: 18000000 }
  ]);

  const [result, setResult] = useState<SIPayoutResult | null>(null);

  useEffect(() => {
    if (mode === 'quick') {
      const cleanAvg = parseFloat(quickAvgSalary.replace(/[^0-9]/g, '')) || 0;
      // Synthesize periods for the calc function
      const synthPeriods: SIPeriod[] = [
        { year: 2013, months: quickYearsBefore * 12, salary: cleanAvg },
        { year: 2014, months: quickYearsAfter * 12, salary: cleanAvg }
      ];
      setResult(calculateOneTimeSIPayout(synthPeriods));
    } else {
      setResult(calculateOneTimeSIPayout(detailedPeriods));
    }
  }, [mode, quickAvgSalary, quickYearsBefore, quickYearsAfter, detailedPeriods]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddPeriod = () => {
    setDetailedPeriods([...detailedPeriods, { year: 2025, months: 12, salary: 10000000 }]);
  };

  const updatePeriod = (index: number, field: keyof SIPeriod, value: number) => {
    const next = [...detailedPeriods];
    next[index] = { ...next[index], [field]: value };
    setDetailedPeriods(next);
  };

  const removePeriod = (index: number) => {
    setDetailedPeriods(detailedPeriods.filter((_, i) => i !== index));
  };

  return (
    <div className={`${styles.container} glass-panel`}>
      <h2 className={styles.title}>{t.bhxhOneTimeTitle}</h2>
      <p className={styles.subtitle}>{t.bhxhOneTimeSubtitle}</p>

      <div className={styles.modeSwitcher}>
        <button 
          className={`${styles.modeBtn} ${mode === 'quick' ? styles.active : ''}`}
          onClick={() => setMode('quick')}
        >{t.quickMode}</button>
        <button 
          className={`${styles.modeBtn} ${mode === 'detailed' ? styles.active : ''}`}
          onClick={() => setMode('detailed')}
        >{t.detailedMode}</button>
      </div>

      {mode === 'quick' ? (
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t.avgSalarySI} (VND)</label>
            <input 
              type="text"
              className={styles.input}
              value={quickAvgSalary}
              onChange={(e) => {
                const numeric = e.target.value.replace(/[^0-9]/g, '');
                if (numeric === '') setQuickAvgSalary('');
                else setQuickAvgSalary(parseInt(numeric, 10).toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN'));
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t.yearsBefore2014}</label>
            <input 
              type="number" 
              className={styles.input} 
              value={quickYearsBefore}
              onChange={(e) => setQuickYearsBefore(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t.yearsFrom2014}</label>
            <input 
              type="number" 
              className={styles.input} 
              value={quickYearsAfter}
              onChange={(e) => setQuickYearsAfter(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      ) : (
        <div className={styles.detailedArea}>
          <table className={styles.periodTable}>
            <thead>
              <tr>
                <th>{t.year}</th>
                <th>{t.months}</th>
                <th>{t.monthlySalary}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {detailedPeriods.map((period, idx) => (
                <tr key={idx}>
                  <td>
                    <input 
                      type="number" 
                      className={styles.input} 
                      style={{width: '90px'}}
                      value={period.year}
                      onChange={(e) => updatePeriod(idx, 'year', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      className={styles.input} 
                      style={{width: '70px'}}
                      value={period.months}
                      onChange={(e) => updatePeriod(idx, 'months', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className={styles.input} 
                      value={period.salary.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN')}
                      onChange={(e) => {
                        const numeric = e.target.value.replace(/[^0-9]/g, '');
                        updatePeriod(idx, 'salary', parseInt(numeric, 10) || 0);
                      }}
                    />
                  </td>
                  <td>
                    <button className={styles.removeBtn} onClick={() => removePeriod(idx)}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.addBtn} onClick={handleAddPeriod}>+ {t.addPeriod}</button>
        </div>
      )}

      {result && (
        <div className={styles.resultsArea}>
          <h3 className={styles.resultTitle}>{t.payoutBreakdown}</h3>
          <div className={styles.resultList}>
            <div className={styles.resultRow}>
              <span>{t.inflationAdjustedAvg}</span>
              <span className={styles.value}>{formatCurrency(result.avgSalary)}</span>
            </div>
            <div className={styles.resultRow}>
              <span>{t.totalDurationRounded}</span>
              <span className={styles.value}>{result.totalBefore2014Years + result.totalFrom2014Years} {t.years}</span>
            </div>
            <div className={styles.resultRow}>
              <span>{t.payoutBefore2014} (1.5x)</span>
              <span className={styles.value}>{formatCurrency(result.payoutBefore2014)}</span>
            </div>
            <div className={styles.resultRow}>
              <span>{t.payoutFrom2014} (2.0x)</span>
              <span className={styles.value}>{formatCurrency(result.payoutFrom2014)}</span>
            </div>
          </div>

          <div className={styles.totalPayoutRow}>
            <span>{t.totalMoneyReceived}</span>
            <span className={styles.totalValue}>{formatCurrency(result.totalPayout)}</span>
          </div>

          <p className={styles.disclaimer}>* {t.roundingNotice}</p>
        </div>
      )}
    </div>
  );
}
