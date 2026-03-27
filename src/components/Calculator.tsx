'use client';

import React, { useState } from 'react';
import styles from './Calculator.module.css';
import { calculateNetIncome, TaxResult } from '../utils/taxCalculation';
import en from '../locales/en.json';
import vi from '../locales/vi.json';

export default function Calculator() {
  const [lang, setLang] = useState<'en' | 'vi'>('en');
  const t = lang === 'en' ? en : vi;

  const [grossSalary, setGrossSalary] = useState<string>('30000000');
  const [dependents, setDependents] = useState<number>(0);
  const [currency, setCurrency] = useState<'VND' | 'USD'>('VND');
  const [isExpat, setIsExpat] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<string>('25000');
  
  const [result, setResult] = useState<TaxResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedGross = parseFloat(grossSalary.replace(/,/g, ''));
    const parsedRate = parseFloat(exchangeRate.replace(/,/g, ''));

    if (isNaN(parsedGross) || isNaN(parsedRate) || parsedGross <= 0 || parsedRate <= 0) return;

    const res = calculateNetIncome({
      grossSalary: parsedGross,
      dependents,
      isExpat,
      currency,
      exchangeRate: parsedRate
    });

    setResult(res);
  };

  const formatCurrency = (amount: number, forceCurrency?: 'VND' | 'USD') => {
    const displayCurrency = forceCurrency || currency;
    const value = displayCurrency === 'USD' ? amount / parseFloat(exchangeRate) : amount;
    
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: displayCurrency,
      maximumFractionDigits: displayCurrency === 'USD' ? 2 : 0,
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} glass-panel`}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.settingsRow}>
          <div className={styles.toggleGroup}>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${lang === 'en' ? styles.active : ''}`}
              onClick={() => setLang('en')}
            >ENG</button>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${lang === 'vi' ? styles.active : ''}`}
              onClick={() => setLang('vi')}
            >VIE</button>
          </div>

          <div className={styles.toggleGroup}>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${currency === 'VND' ? styles.active : ''}`}
              onClick={() => setCurrency('VND')}
            >VND</button>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${currency === 'USD' ? styles.active : ''}`}
              onClick={() => setCurrency('USD')}
            >USD</button>
          </div>

          <div className={styles.toggleGroup}>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${!isExpat ? styles.active : ''}`}
              onClick={() => setIsExpat(false)}
            >{t.isLocal}</button>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${isExpat ? styles.active : ''}`}
              onClick={() => setIsExpat(true)}
            >{t.isExpat}</button>
          </div>
        </div>

        <form onSubmit={handleCalculate} className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t.grossSalary}</label>
            <input 
              type="number" 
              className={styles.input} 
              value={grossSalary}
              onChange={(e) => setGrossSalary(e.target.value)}
              placeholder="e.g. 30000000"
              required
              min="0"
              step="any"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>{t.dependents}</label>
            <input 
              type="number" 
              className={styles.input} 
              value={dependents}
              onChange={(e) => setDependents(parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>

          {currency === 'USD' && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>{t.exchangeRate}</label>
              <input 
                type="number" 
                className={styles.input} 
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                required
                min="0"
              />
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>{t.calculate}</button>
        </form>
      </div>

      {result && (
        <div className={`${styles.card} glass-panel ${styles.resultsPanel}`}>
          <div className={styles.resultBreakdown}>
            <div className={`${styles.resultRow} ${styles.bold}`}>
              <span>{t.grossIncome}</span>
              <span>{formatCurrency(result.grossVND)}</span>
            </div>
            
            <div className={`${styles.resultRow} ${styles.deduction}`}>
              <span>- {t.socialInsurance}</span>
              <span>{formatCurrency(result.socialInsuranceVND)}</span>
            </div>
            <div className={`${styles.resultRow} ${styles.deduction}`}>
              <span>- {t.healthInsurance}</span>
              <span>{formatCurrency(result.healthInsuranceVND)}</span>
            </div>
            {!isExpat && (
              <div className={`${styles.resultRow} ${styles.deduction}`}>
                <span>- {t.unemploymentInsurance}</span>
                <span>{formatCurrency(result.unemploymentInsuranceVND)}</span>
              </div>
            )}

            <div className={`${styles.resultRow} ${styles.bold}`}>
              <span>{t.totalBeforeTax}</span>
              <span>{formatCurrency(result.totalBeforeTaxVND)}</span>
            </div>

            <div className={`${styles.resultRow} ${styles.deduction}`}>
              <span>- {t.personalDeduction}</span>
              <span>{formatCurrency(result.personalDeductionVND)}</span>
            </div>
            
            {result.dependentDeductionVND > 0 && (
              <div className={`${styles.resultRow} ${styles.deduction}`}>
                <span>- {t.dependentDeduction}</span>
                <span>{formatCurrency(result.dependentDeductionVND)}</span>
              </div>
            )}

            <div className={styles.resultRow}>
              <span>{t.taxableIncome}</span>
              <span>{formatCurrency(result.taxableIncomeVND)}</span>
            </div>

            <div className={`${styles.resultRow} ${styles.deduction}`}>
              <span>- {t.personalIncomeTax}</span>
              <span>{formatCurrency(result.personalIncomeTaxVND)}</span>
            </div>

            <div className={styles.netIncomeRow}>
              <span className={styles.netIncomeLabel}>{t.netIncome}</span>
              <span className={styles.netIncomeValue}>{formatCurrency(result.netIncomeVND)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
