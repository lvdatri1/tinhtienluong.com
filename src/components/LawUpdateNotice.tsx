'use client';

import React from 'react';
import styles from './LawUpdateNotice.module.css';
import en from '../locales/en.json';
import vi from '../locales/vi.json';

interface LawUpdateProps {
  lang: 'en' | 'vi';
}

export default function LawUpdateNotice({ lang }: LawUpdateProps) {
  const t: any = lang === 'en' ? en : vi;

  return (
    <div className={`${styles.container} no-print`}>
      <span className={styles.icon}>⚖️</span>
      <div className={styles.content}>
        <h4 className={styles.title}>{t.law41UpdateTitle}</h4>
        <p className={styles.summary}>{t.law41UpdateSummary}</p>
      </div>
    </div>
  );
}
