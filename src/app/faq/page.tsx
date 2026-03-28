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
            {Object.values(t.faqCategories || {}).map((category: any, catIdx: number) => (
              <div key={catIdx} className={styles.categorySection}>
                <h2 className={styles.categoryTitle}>{category.title}</h2>
                <div className={styles.categoryItems}>
                  {category.items.map((item: any, itemIdx: number) => (
                    <div key={itemIdx} className={styles.faqItem}>
                      <h3 className={styles.question}>{item.q}</h3>
                      <p className={styles.answer}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
