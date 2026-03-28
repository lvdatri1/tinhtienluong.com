'use client';

import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import BenefitCalculator from '@/components/BenefitCalculator';
import styles from './page.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'pit' | 'benefits'>('pit');
  const [lang, setLang] = useState<'en' | 'vi'>('en');

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.logo}>Tính Tiền Lương</h1>
          <p className={styles.description}>
            {lang === 'en' 
              ? 'The smartest way to calculate your Vietnam Net Income and Social Benefits.' 
              : 'Công cụ tính lương và các chế độ bảo hiểm thông minh nhất.'}
          </p>
        </div>

        <div className={styles.mainTabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'pit' ? styles.active : ''}`}
            onClick={() => setActiveTab('pit')}
          >
            {lang === 'en' ? 'Salary / PIT' : 'Lương / Thuế TNCN'}
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'benefits' ? styles.active : ''}`}
            onClick={() => setActiveTab('benefits')}
          >
            {lang === 'en' ? 'Social Insurance Benefits' : 'Các Chế Độ Bảo Hiểm'}
          </button>
        </div>

        {activeTab === 'pit' ? <Calculator /> : <BenefitCalculator lang={lang} />}
      </div>

      <section className={styles.seoContent}>
        <h2>About Vietnam Personal Income Tax 2024</h2>
        <p>
          The <strong>Vietnam Salary Calculator (Tinh Tien Luong)</strong> helps expats and local residents securely estimate their net income without any data leaving your device. It accurately evaluates modern progressive tax brackets (from 5% to 35%), compulsory insurance deductions like Social Insurance (8%), Health Insurance (1.5%), and Unemployment Insurance (1%), alongside base deductions like the 11M VND personal allowance. Calculate your USD or VND gross salary instantly across monthly, fortnightly, or annual tracking periods.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <a href="/faq" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Learn more in our FAQ →</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Tinh Tien Luong. Built with statically exported Next.js + Vanilla CSS.</p>
      </footer>
    </main>
  );
}
