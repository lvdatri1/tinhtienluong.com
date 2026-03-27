'use client';

import React, { useState } from 'react';
import styles from './Calculator.module.css';
import { calculateNetIncome, TaxResult } from '../utils/taxCalculation';
import en from '../locales/en.json';
import vi from '../locales/vi.json';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import InfoTooltip from './Tooltip';

export default function Calculator() {
  const [lang, setLang] = useState<'en' | 'vi'>('en');
  const t: any = lang === 'en' ? en : vi;

  const [grossSalary, setGrossSalary] = useState<string>('30000000');
  const [dependents, setDependents] = useState<number>(0);
  const [currency, setCurrency] = useState<'VND' | 'USD'>('VND');
  const [isExpat, setIsExpat] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<string>('25000');
  const [period, setPeriod] = useState<'monthly' | 'annually' | 'fortnightly'>('monthly');
  
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
      exchangeRate: parsedRate,
      period
    });

    setResult(res);
  };

  const handleGrossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/,/g, '');
    if (val === '') {
      setGrossSalary('');
      return;
    }
    if (!isNaN(Number(val))) {
      if (val.endsWith('.')) {
        setGrossSalary(val);
      } else {
        const parts = val.split('.');
        if (parts.length > 2) return;
        parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
        setGrossSalary(parts.join('.'));
      }
    }
  };

  const handlePeriodChange = (newPeriod: 'monthly' | 'annually' | 'fortnightly') => {
    if (period === newPeriod) return;
    
    const rawGross = parseFloat(grossSalary.replace(/,/g, ''));
    if (!isNaN(rawGross) && rawGross > 0) {
      let annualGross = rawGross;
      if (period === 'monthly') annualGross = rawGross * 12;
      if (period === 'fortnightly') annualGross = rawGross * 26;

      let newGross = annualGross;
      if (newPeriod === 'monthly') newGross = annualGross / 12;
      if (newPeriod === 'fortnightly') newGross = annualGross / 26;

      const formatted = newGross.toFixed(currency === 'USD' ? 2 : 0);
      const parts = formatted.split('.');
      parts[0] = parseFloat(parts[0]).toLocaleString('en-US');
      setGrossSalary(parts.join('.'));

      if (result) {
        const parsedRate = parseFloat(exchangeRate.replace(/,/g, ''));
        if (!isNaN(parsedRate) && parsedRate > 0) {
          setResult(calculateNetIncome({
            grossSalary: newGross,
            dependents,
            isExpat,
            currency,
            exchangeRate: parsedRate,
            period: newPeriod
          }));
        }
      }
    }
    
    setPeriod(newPeriod);
  };

  const formatCurrency = (amount: number, forceCurrency: 'VND' | 'USD') => {
    const value = forceCurrency === 'USD' ? amount / parseFloat(exchangeRate) : amount;
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: forceCurrency,
      maximumFractionDigits: forceCurrency === 'USD' ? 2 : 0,
    }).format(value);
  };

  const getChartData = () => {
    if (!result) return [];
    
    const total = result.netIncomeVND + result.personalIncomeTaxVND + result.totalInsuranceVND;

    return [
      { name: t.netIncome, value: result.netIncomeVND, color: '#10b981', percentStr: total > 0 ? ((result.netIncomeVND / total) * 100).toFixed(1) : 0 },
      { name: t.personalIncomeTax, value: result.personalIncomeTaxVND, color: '#ef4444', percentStr: total > 0 ? ((result.personalIncomeTaxVND / total) * 100).toFixed(1) : 0 },
      { name: t.totalInsurance, value: result.totalInsuranceVND, color: '#f59e0b', percentStr: total > 0 ? ((result.totalInsuranceVND / total) * 100).toFixed(1) : 0 }
    ].filter(item => item.value > 0);
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
              className={`${styles.toggleBtn} ${period === 'monthly' ? styles.active : ''}`}
              onClick={() => handlePeriodChange('monthly')}
            >{t.monthly}</button>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${period === 'annually' ? styles.active : ''}`}
              onClick={() => handlePeriodChange('annually')}
            >{t.annually}</button>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${period === 'fortnightly' ? styles.active : ''}`}
              onClick={() => handlePeriodChange('fortnightly')}
            >{t.fortnightly}</button>
          </div>

          <div className={styles.toggleGroup}>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${currency === 'VND' ? styles.active : ''}`}
              onClick={() => setCurrency('VND')}
            >VND Input</button>
            <button 
              type="button" 
              className={`${styles.toggleBtn} ${currency === 'USD' ? styles.active : ''}`}
              onClick={() => setCurrency('USD')}
            >USD Input</button>
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
            <label className={styles.label}>
              {t.grossSalary} ({currency})
              <InfoTooltip text={t.grossTooltip}>
                <span className={styles.infoIcon}>ⓘ</span>
              </InfoTooltip>
            </label>
            <input 
              type="text" 
              inputMode="decimal"
              className={styles.input} 
              value={grossSalary}
              onChange={handleGrossChange}
              placeholder={`e.g. ${currency === 'USD' ? '2,500' : '30,000,000'}`}
              required
            />
            {grossSalary && exchangeRate && !isNaN(parseFloat(grossSalary.replace(/,/g, ''))) && (
              <div className={styles.helperText}>
                ≈ {new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'vi-VN', {
                  style: 'currency',
                  currency: currency === 'USD' ? 'VND' : 'USD',
                  maximumFractionDigits: currency === 'USD' ? 0 : 2,
                }).format(currency === 'USD' 
                  ? parseFloat(grossSalary.replace(/,/g, '')) * parseFloat(exchangeRate) 
                  : parseFloat(grossSalary.replace(/,/g, '')) / parseFloat(exchangeRate)
                )}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              {t.dependents}
              <InfoTooltip text={t.dependentTooltip}>
                <span className={styles.infoIcon}>ⓘ</span>
              </InfoTooltip>
            </label>
            <input 
              type="number" 
              className={styles.input} 
              value={dependents}
              onChange={(e) => setDependents(parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>

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

          <button type="submit" className={styles.submitBtn}>{t.calculate}</button>
        </form>
      </div>

      {result && (
        <div className={`${styles.card} glass-panel ${styles.resultsPanel}`}>
          <div className={styles.resultBreakdown}>
            <div className={styles.resultHeader}>
              <span>Breakdown</span>
              <span className={styles.resultColRight}>VND</span>
              <span className={styles.resultColRight}>USD</span>
            </div>

            <div className={`${styles.resultRow} ${styles.bold}`}>
              <span>{t.grossIncome}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.grossVND, 'VND')}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.grossVND, 'USD')}</span>
            </div>
            
            <div className={`${styles.resultRow} ${styles.deduction}`}>
              <span>- {t.socialInsurance}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.socialInsuranceVND, 'VND')}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.socialInsuranceVND, 'USD')}</span>
            </div>
            <div className={`${styles.resultRow} ${styles.deduction}`}>
              <span>- {t.healthInsurance}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.healthInsuranceVND, 'VND')}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.healthInsuranceVND, 'USD')}</span>
            </div>
            {!isExpat && (
              <div className={`${styles.resultRow} ${styles.deduction}`}>
                <span>- {t.unemploymentInsurance}</span>
                <span className={styles.resultColRight}>{formatCurrency(result.unemploymentInsuranceVND, 'VND')}</span>
                <span className={styles.resultColRight}>{formatCurrency(result.unemploymentInsuranceVND, 'USD')}</span>
              </div>
            )}

            <div className={`${styles.resultRow} ${styles.bold}`}>
              <span>{t.totalBeforeTax}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.totalBeforeTaxVND, 'VND')}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.totalBeforeTaxVND, 'USD')}</span>
            </div>

            <div className={`${styles.resultRow} ${styles.deduction}`}>
              <span>- {t.personalDeduction}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.personalDeductionVND, 'VND')}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.personalDeductionVND, 'USD')}</span>
            </div>
            
            {result.dependentDeductionVND > 0 && (
              <div className={`${styles.resultRow} ${styles.deduction}`}>
                <span>- {t.dependentDeduction}</span>
                <span className={styles.resultColRight}>{formatCurrency(result.dependentDeductionVND, 'VND')}</span>
                <span className={styles.resultColRight}>{formatCurrency(result.dependentDeductionVND, 'USD')}</span>
              </div>
            )}

            <div className={styles.resultRow}>
              <span>{t.taxableIncome}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.taxableIncomeVND, 'VND')}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.taxableIncomeVND, 'USD')}</span>
            </div>

            <div className={`${styles.resultRow} ${styles.deduction}`}>
              <span>- {t.personalIncomeTax}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.personalIncomeTaxVND, 'VND')}</span>
              <span className={styles.resultColRight}>{formatCurrency(result.personalIncomeTaxVND, 'USD')}</span>
            </div>

            <div className={styles.netIncomeRow}>
              <span className={styles.netIncomeLabel}>{t.netIncome}</span>
              <span className={styles.netIncomeValue}>{formatCurrency(result.netIncomeVND, 'VND')}</span>
              <span className={styles.netIncomeValue}>{formatCurrency(result.netIncomeVND, 'USD')}</span>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>{t.incomeBreakdown} (VND)</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={getChartData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    label={(props: any) => {
                      const { cx, cy, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return percent > 0.05 ? (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
                          {`${(percent * 100).toFixed(1)}%`}
                        </text>
                      ) : null;
                    }}
                    labelLine={false}
                  >
                    {getChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any, name: any, props: any) => [
                      `${formatCurrency(Number(value), 'VND')} (${props.payload.percentStr}%)`,
                      name
                    ]}
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
