import React from 'react';
import Calculator from '../components/Calculator';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.logo}>Tính Tiền Lương</h1>
          <p className={styles.description}>
            The smartest way to calculate your Vietnam Net Income.
          </p>
        </div>
        
        <Calculator />
      </div>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Tinh Tien Luong. Built with statically exported Next.js + Vanilla CSS.</p>
      </footer>
    </main>
  );
}
