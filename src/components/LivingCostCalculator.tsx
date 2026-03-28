'use client';

import React, { useState, useMemo } from 'react';
import styles from './LivingCostCalculator.module.css';
import en from '../locales/en.json';
import vi from '../locales/vi.json';

interface CostData {
  rentCenter: number;
  rentOutside: number;
  meal: number;
  coffee: number;
  gym: number;
  utilities: number;
}

const CITY_DATA: Record<string, any> = {
  hcmc: {
    rentCenter: { local: 10000000, mid: 18000000, premium: 30000000 },
    rentOutside: { local: 5500000, mid: 10000000, premium: 18000000 },
    meal: { local: 35000, mid: 65000, premium: 180000 },
    coffee: { local: 20000, mid: 45000, premium: 85000 },
    gym: { local: 350000, mid: 800000, premium: 2000000 },
    utilities: { local: 1500000, mid: 2500000, premium: 4500000 }
  },
  hanoi: {
    rentCenter: { local: 9000000, mid: 16000000, premium: 26000000 },
    rentOutside: { local: 5000000, mid: 9000000, premium: 15000000 },
    meal: { local: 35000, mid: 55000, premium: 150000 },
    coffee: { local: 18000, mid: 40000, premium: 75000 },
    gym: { local: 300000, mid: 700000, premium: 1800000 },
    utilities: { local: 1200000, mid: 2200000, premium: 3800000 }
  },
  danang: {
    rentCenter: { local: 6500000, mid: 10000000, premium: 18000000 },
    rentOutside: { local: 4000000, mid: 6500000, premium: 10000000 },
    meal: { local: 30000, mid: 45000, premium: 100000 },
    coffee: { local: 15000, mid: 35000, premium: 65000 },
    gym: { local: 250000, mid: 550000, premium: 1200000 },
    utilities: { local: 1000000, mid: 1800000, premium: 2800000 }
  },
  haiphong: {
    rentCenter: { local: 7500000, mid: 12000000, premium: 20000000 },
    rentOutside: { local: 4000000, mid: 7000000, premium: 12000000 },
    meal: { local: 35000, mid: 50000, premium: 120000 },
    coffee: { local: 18000, mid: 40000, premium: 70000 },
    gym: { local: 280000, mid: 600000, premium: 1500000 },
    utilities: { local: 1100000, mid: 2000000, premium: 3200000 }
  },
  cantho: {
    rentCenter: { local: 5000000, mid: 8000000, premium: 14000000 },
    rentOutside: { local: 3000000, mid: 5000000, premium: 9000000 },
    meal: { local: 25000, mid: 40000, premium: 100000 },
    coffee: { local: 15000, mid: 30000, premium: 60000 },
    gym: { local: 200000, mid: 450000, premium: 1000000 },
    utilities: { local: 900000, mid: 1600000, premium: 2500000 }
  }
};

interface LivingCostProps {
  lang: 'en' | 'vi';
}

export default function LivingCostCalculator({ lang }: LivingCostProps) {
  const t: any = lang === 'en' ? en : vi;
  const [city, setCity] = useState<'hcmc' | 'hanoi' | 'danang' | 'haiphong' | 'cantho'>('hcmc');
  const [lifestyle, setLifestyle] = useState<'local' | 'mid' | 'premium'>('mid');
  const [rentLocation, setRentLocation] = useState<'center' | 'outskirts'>('center');

  const currentData = useMemo(() => {
    const base = CITY_DATA[city];
    const ls = lifestyle;
    
    return {
      rentCenter: base.rentCenter[ls],
      rentOutside: base.rentOutside[ls],
      meal: base.meal[ls],
      coffee: base.coffee[ls],
      gym: base.gym[ls],
      utilities: base.utilities[ls],
      transport: ls === 'local' ? 800000 : ls === 'mid' ? 1500000 : 3500000
    };
  }, [city, lifestyle]);

  const totalMonthly = useMemo(() => {
    const monthlyFood = currentData.meal * 3 * 30;
    const monthlyCoffee = currentData.coffee * 30;
    const selectedRent = rentLocation === 'center' ? currentData.rentCenter : currentData.rentOutside;
    
    return Math.round(selectedRent + monthlyFood + monthlyCoffee + currentData.utilities + currentData.transport + currentData.gym);
  }, [currentData, rentLocation]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`${styles.container} glass-panel`}>
      <h2 className={styles.title}>{t.livingCostTitle}</h2>
      <p className={styles.subtitle}>{t.estimatedRange} (2024 - 2025)</p>

      <div className={styles.selectorGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.selectCity}</label>
          <select 
            className={styles.select}
            value={city}
            onChange={(e) => setCity(e.target.value as any)}
          >
            <option value="hcmc">Ho Chi Minh City</option>
            <option value="hanoi">Hanoi</option>
            <option value="danang">Da Nang</option>
            <option value="haiphong">Haiphong</option>
            <option value="cantho">Can Tho</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.lifestyle}</label>
          <select 
            className={styles.select}
            value={lifestyle}
            onChange={(e) => setLifestyle(e.target.value as any)}
          >
            <option value="local">{t.lifestyleLocal}</option>
            <option value="mid">{t.lifestyleMid}</option>
            <option value="premium">{t.lifestylePremium}</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.rentArea}</label>
          <div className={styles.toggleGroup}>
            <button 
              className={`${styles.toggleBtn} ${rentLocation === 'center' ? styles.active : ''}`}
              onClick={() => setRentLocation('center')}
            >{t.center}</button>
            <button 
              className={`${styles.toggleBtn} ${rentLocation === 'outskirts' ? styles.active : ''}`}
              onClick={() => setRentLocation('outskirts')}
            >{t.outskirts}</button>
          </div>
        </div>
      </div>

      <div className={styles.costGrid}>
        <div className={styles.categoryCard}>
          <h3 className={styles.categoryTitle}>{t.rent}</h3>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.rentCenter1BR}</span>
            <span className={`${styles.itemValue} ${rentLocation === 'center' ? styles.selected : ''}`}>
              {formatCurrency(currentData.rentCenter)}
            </span>
          </div>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.rentOutside1BR}</span>
            <span className={`${styles.itemValue} ${rentLocation === 'outskirts' ? styles.selected : ''}`}>
              {formatCurrency(currentData.rentOutside)}
            </span>
          </div>
        </div>

        <div className={styles.categoryCard}>
          <h3 className={styles.categoryTitle}>{t.food}</h3>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.mealLocal} ({t.perMeal})</span>
            <span className={styles.itemValue}>{formatCurrency(currentData.meal)}</span>
          </div>
          <div className={`${styles.costItem} ${styles.dailyRow}`}>
            <span className={styles.itemName}>{t.dailyFood} (3x)</span>
            <span className={styles.itemValue}>{formatCurrency(currentData.meal * 3)}</span>
          </div>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.coffee}</span>
            <span className={styles.itemValue}>{formatCurrency(currentData.coffee)}</span>
          </div>
        </div>

        <div className={styles.categoryCard}>
          <h3 className={styles.categoryTitle}>{t.other}</h3>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.utilities}</span>
            <span className={styles.itemValue}>{formatCurrency(currentData.utilities)}</span>
          </div>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.gym}</span>
            <span className={styles.itemValue}>{formatCurrency(currentData.gym)}</span>
          </div>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.transport}</span>
            <span className={styles.itemValue}>{formatCurrency(currentData.transport)}</span>
          </div>
        </div>
      </div>

      <div className={styles.totalCard}>
        <div className={styles.totalLabel}>{t.monthlyTotal}</div>
        <div className={styles.totalValue}>{formatCurrency(totalMonthly)}</div>
        <p className={styles.rangeText}>* {t.estimatedRange} (VND)</p>
      </div>
    </div>
  );
}
