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

const CITY_DATA: Record<string, CostData> = {
  hcmc: {
    rentCenter: 16000000,
    rentOutside: 8500000,
    meal: 65000,
    coffee: 55000,
    gym: 800000,
    utilities: 2500000
  },
  hanoi: {
    rentCenter: 14000000,
    rentOutside: 7500000,
    meal: 55000,
    coffee: 50000,
    gym: 700000,
    utilities: 2200000
  },
  danang: {
    rentCenter: 9000000,
    rentOutside: 5500000,
    meal: 45000,
    coffee: 35000,
    gym: 500000,
    utilities: 1800000
  }
};

interface LivingCostProps {
  lang: 'en' | 'vi';
}

export default function LivingCostCalculator({ lang }: LivingCostProps) {
  const t: any = lang === 'en' ? en : vi;
  const [city, setCity] = useState<'hcmc' | 'hanoi' | 'danang'>('hcmc');
  const [lifestyle, setLifestyle] = useState<'local' | 'mid' | 'premium'>('mid');

  const lifestyleMultiplier = {
    local: 0.7,
    mid: 1,
    premium: 1.5
  };

  const currentData = useMemo(() => {
    const base = CITY_DATA[city];
    const mult = lifestyleMultiplier[lifestyle];
    
    return {
      rentCenter: Math.round(base.rentCenter * mult),
      rentOutside: Math.round(base.rentOutside * mult),
      meal: Math.round(base.meal * mult),
      coffee: Math.round(base.coffee * mult),
      gym: Math.round(base.gym * mult),
      utilities: Math.round(base.utilities * mult),
      transport: Math.round(1500000 * mult) // Grab/Bike avg
    };
  }, [city, lifestyle]);

  const totalMonthly = useMemo(() => {
    // Estimate total = Rent (Avg) + 30*3 Meals + 30 Coffees + Utilities + Transport + Gym
    const monthlyFood = currentData.meal * 3 * 30;
    const monthlyCoffee = currentData.coffee * 30;
    const avgRent = (currentData.rentCenter + currentData.rentOutside) / 2;
    
    return Math.round(avgRent + monthlyFood + monthlyCoffee + currentData.utilities + currentData.transport + currentData.gym);
  }, [currentData]);

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
      </div>

      <div className={styles.costGrid}>
        <div className={styles.categoryCard}>
          <h3 className={styles.categoryTitle}>{t.rent}</h3>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.rentCenter1BR}</span>
            <span className={styles.itemValue}>{formatCurrency(currentData.rentCenter)}</span>
          </div>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.rentOutside1BR}</span>
            <span className={styles.itemValue}>{formatCurrency(currentData.rentOutside)}</span>
          </div>
        </div>

        <div className={styles.categoryCard}>
          <h3 className={styles.categoryTitle}>{t.food}</h3>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.mealLocal}</span>
            <span className={styles.itemValue}>{formatCurrency(currentData.meal)}</span>
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
