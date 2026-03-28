'use client';

import React, { useState, useMemo } from 'react';
import styles from './MortgageCalculator.module.css';
import en from '../locales/en.json';
import vi from '../locales/vi.json';

interface MortgageProps {
  lang: 'en' | 'vi';
}

interface PaymentRow {
  month: number;
  principal: number;
  interest: number;
  total: number;
  remaining: number;
  isPromo: boolean;
}

export default function MortgageCalculator({ lang }: MortgageProps) {
  const t: any = lang === 'en' ? en : vi;
  const [loanAmount, setLoanAmount] = useState<string>('1000000000');
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [promoRate, setPromoRate] = useState<number>(7.5);
  const [promoMonths, setPromoMonths] = useState<number>(12);
  const [floatingRate, setFloatingRate] = useState<number>(12.5);
  const [method, setMethod] = useState<'reducing' | 'annuity'>('reducing');

  const schedule = useMemo(() => {
    const rawAmount = parseFloat(loanAmount.replace(/[^0-9]/g, '')) || 0;
    const totalMonths = loanTerm * 12;
    if (rawAmount === 0 || totalMonths === 0) return [];

    let remaining = rawAmount;
    const rows: PaymentRow[] = [];
    
    if (method === 'reducing') {
      const monthlyPrincipal = rawAmount / totalMonths;
      for (let m = 1; m <= totalMonths; m++) {
        const isPromo = m <= promoMonths;
        const currentRate = (isPromo ? promoRate : floatingRate) / 100 / 12;
        const interest = remaining * currentRate;
        const total = monthlyPrincipal + interest;
        remaining -= monthlyPrincipal;
        
        rows.push({
          month: m,
          principal: monthlyPrincipal,
          interest,
          total,
          remaining: Math.max(0, remaining),
          isPromo
        });
      }
    } else {
      // Annuity implementation with rate change support
      for (let m = 1; m <= totalMonths; m++) {
        const isPromo = m <= promoMonths;
        const currentRate = (isPromo ? promoRate : floatingRate) / 100 / 12;
        const remainingTerm = totalMonths - m + 1;
        
        // Recalculate EMI whenever the rate changes
        const emi = remaining * currentRate * Math.pow(1 + currentRate, remainingTerm) / (Math.pow(1 + currentRate, remainingTerm) - 1);
        
        const interest = remaining * currentRate;
        const principal = emi - interest;
        remaining -= principal;

        rows.push({
          month: m,
          principal,
          interest,
          total: emi,
          remaining: Math.max(0, remaining),
          isPromo
        });
      }
    }

    return rows;
  }, [loanAmount, loanTerm, promoRate, promoMonths, floatingRate, method]);

  const summary = useMemo(() => {
    if (schedule.length === 0) return { firstMonth: 0, totalInterest: 0, totalPayment: 0 };
    const firstMonth = schedule[0].total;
    const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
    const totalPayment = schedule.reduce((sum, row) => sum + row.total, 0);
    return { firstMonth, totalInterest, totalPayment };
  }, [schedule]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '');
    if (numeric === '') setLoanAmount('');
    else setLoanAmount(parseInt(numeric, 10).toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN'));
  };

  return (
    <div className={`${styles.container} glass-panel`}>
      <h2 className={styles.title}>{t.mortgageTitle}</h2>
      <p className={styles.subtitle}>{t.firstMonthPayment}</p>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.loanAmount} (VND)</label>
          <input 
            type="text"
            className={styles.input}
            value={loanAmount}
            onChange={handleAmountChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.loanTerm}</label>
          <input 
            type="number"
            className={styles.input}
            value={loanTerm}
            onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.promoRate}</label>
          <input 
            type="number"
            step="0.1"
            className={styles.input}
            value={promoRate}
            onChange={(e) => setPromoRate(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.promoMonths}</label>
          <input 
            type="number"
            className={styles.input}
            value={promoMonths}
            onChange={(e) => setPromoMonths(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.floatingRate}</label>
          <input 
            type="number"
            step="0.1"
            className={styles.input}
            value={floatingRate}
            onChange={(e) => setFloatingRate(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.repaymentMethod}</label>
          <select 
            className={styles.select}
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
          >
            <option value="reducing">{t.reducingBalance}</option>
            <option value="annuity">{t.annuityFixed}</option>
          </select>
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>{t.firstMonthPayment}</div>
          <div className={styles.summaryValue}>{formatCurrency(summary.firstMonth)}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>{t.totalInterest}</div>
          <div className={styles.summaryValue}>{formatCurrency(summary.totalInterest)}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>{t.totalPayment}</div>
          <div className={styles.summaryValue}>{formatCurrency(summary.totalPayment)}</div>
        </div>
      </div>

      <h3 className={styles.title} style={{ fontSize: '1.4rem' }}>{t.amortizationSchedule}</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t.month}</th>
              <th>{t.monthlyPrincipal}</th>
              <th>{t.monthlyInterest}</th>
              <th>Total</th>
              <th>{t.remainingBalance}</th>
            </tr>
          </thead>
          <tbody>
            {schedule.slice(0, 100).map((row) => (
              <tr key={row.month} className={row.isPromo ? styles.promo : ''}>
                <td>
                  {row.month}
                  {row.isPromo && <span className={styles.promoBadge}>promo</span>}
                </td>
                <td>{formatCurrency(row.principal)}</td>
                <td>{formatCurrency(row.interest)}</td>
                <td>{formatCurrency(row.total)}</td>
                <td>{formatCurrency(row.remaining)}</td>
              </tr>
            ))}
            {schedule.length > 100 && (
              <tr>
                <td colSpan={5} style={{textAlign: 'center', opacity: 0.6}}>... showing first 100 months ...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
