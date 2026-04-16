'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../faq/faq.module.css';
import en from '../../locales/en.json';
import vi from '../../locales/vi.json';

export default function TermsPage() {
  const [lang, setLang] = useState<'en' | 'vi'>('vi');
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
          <h1 className={styles.title}>{t.termsTitle}</h1>
          <p className={styles.description}>{t.termsDesc}</p>

          <div className={styles.faqList}>
            <div className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{t.termsTitle}</h2>
              <div className={styles.categoryItems}>
                <div className={styles.faqItem}>
                  <p className={styles.answer}>{t.termsDisclaimer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
