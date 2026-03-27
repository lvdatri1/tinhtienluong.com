'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './faq.module.css';
import en from '../../locales/en.json';
import vi from '../../locales/vi.json';

export default function FAQPage() {
  const [lang, setLang] = useState<'en' | 'vi'>('en');
  const t: any = lang === 'en' ? en : vi;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/" className={styles.backBtn}>
            ← {t.backToHome}
          </Link>
          <div className={styles.toggleGroup}>
            <button 
              className={`${styles.toggleBtn} ${lang === 'en' ? styles.active : ''}`}
              onClick={() => setLang('en')}
            >ENG</button>
            <button 
              className={`${styles.toggleBtn} ${lang === 'vi' ? styles.active : ''}`}
              onClick={() => setLang('vi')}
            >VIE</button>
          </div>
        </div>

        <div className={`${styles.card} glass-panel`}>
          <h1 className={styles.title}>{t.faqTitle}</h1>
          <p className={styles.description}>{t.faqDescription}</p>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h2 className={styles.question}>{t.q1}</h2>
              <p className={styles.answer}>{t.a1}</p>
            </div>
            
            <div className={styles.faqItem}>
              <h2 className={styles.question}>{t.q2}</h2>
              <p className={styles.answer}>{t.a2}</p>
            </div>

            <div className={styles.faqItem}>
              <h2 className={styles.question}>{t.q3}</h2>
              <p className={styles.answer}>{t.a3}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
