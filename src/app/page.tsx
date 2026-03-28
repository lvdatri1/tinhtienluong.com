'use client';

import React, { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import BenefitCalculator from '@/components/BenefitCalculator';
import LivingCostCalculator from '@/components/LivingCostCalculator';
import MortgageCalculator from '@/components/MortgageCalculator';
import styles from './page.module.css';
import en from '../locales/en.json';
import vi from '../locales/vi.json';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'pit' | 'benefits' | 'cost' | 'mortgage'>('pit');
  const [lang, setLang] = useState<'en' | 'vi'>('en');
  const t: any = lang === 'en' ? en : vi;

  useEffect(() => {
    document.title = t.pageTitle;
    document.documentElement.lang = lang;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t.metaDescription);
    }
  }, [lang, t.pageTitle, t.metaDescription]);

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.langToggle}>
             <button 
              className={`${styles.toggleBtn} ${lang === 'en' ? styles.active : ''}`}
              onClick={() => setLang('en')}
            >ENG</button>
            <button 
              className={`${styles.toggleBtn} ${lang === 'vi' ? styles.active : ''}`}
              onClick={() => setLang('vi')}
            >VIE</button>
          </div>
          <h1 className={styles.logo}>{t.title}</h1>
          <p className={styles.description}>{t.subtitle}</p>
        </div>

        <div className={styles.mainTabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'pit' ? styles.active : ''}`}
            onClick={() => setActiveTab('pit')}
          >
            {t.salaryTab}
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'benefits' ? styles.active : ''}`}
            onClick={() => setActiveTab('benefits')}
          >
            {t.benefitsTab}
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'cost' ? styles.active : ''}`}
            onClick={() => setActiveTab('cost')}
          >
            {t.livingCostTab}
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'mortgage' ? styles.active : ''}`}
            onClick={() => setActiveTab('mortgage')}
          >
            {t.mortgageTab}
          </button>
        </div>

        {activeTab === 'pit' && <Calculator initialLang={lang} />}
        {activeTab === 'benefits' && <BenefitCalculator lang={lang} />}
        {activeTab === 'cost' && <LivingCostCalculator lang={lang} />}
        {activeTab === 'mortgage' && <MortgageCalculator lang={lang} />}

        <div className={styles.disclaimerBox}>
          <p>{t.disclaimer}</p>
        </div>
      </div>

      <section className={styles.seoContent}>
        <h2>{t.seoTitle}</h2>
        <p>{t.seoDescription}</p>
        <div style={{ marginTop: '1.5rem' }}>
          <a href="/faq" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>{t.learnMoreFaq} →</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Tinh Tien Luong. {t.footerCredit}</p>
      </footer>
    </main>
  );
}
