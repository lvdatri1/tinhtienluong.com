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
    room: { local: 3500000, mid: 6000000, premium: 10000000 },
    studio: { local: 8000000, mid: 15000000, premium: 25000000 },
    apartment: { local: 15000000, mid: 28000000, premium: 50000000 },
    meal: { local: 35000, mid: 65000, premium: 180000 },
    coffee: { local: 20000, mid: 45000, premium: 85000 },
    gym: { local: 350000, mid: 800000, premium: 2000000 },
    utilities: { local: 1000000, mid: 2000000, premium: 4000000 }
  },
  hanoi: {
    room: { local: 3000000, mid: 5500000, premium: 9000000 },
    studio: { local: 7000000, mid: 13000000, premium: 22000000 },
    apartment: { local: 13000000, mid: 25000000, premium: 45000000 },
    meal: { local: 35000, mid: 55000, premium: 150000 },
    coffee: { local: 18000, mid: 40000, premium: 75000 },
    gym: { local: 300000, mid: 700000, premium: 1800000 },
    utilities: { local: 900000, mid: 1800000, premium: 3500000 }
  },
  danang: {
    room: { local: 2500000, mid: 4000000, premium: 6500000 },
    studio: { local: 5000000, mid: 8500000, premium: 15000000 },
    apartment: { local: 9000000, mid: 16000000, premium: 30000000 },
    meal: { local: 30000, mid: 45000, premium: 100000 },
    coffee: { local: 15000, mid: 35000, premium: 65000 },
    gym: { local: 250000, mid: 550000, premium: 1200000 },
    utilities: { local: 800000, mid: 1500000, premium: 2500000 }
  },
  haiphong: {
    room: { local: 2800000, mid: 4500000, premium: 7000000 },
    studio: { local: 6000000, mid: 10000000, premium: 18000000 },
    apartment: { local: 11000000, mid: 20000000, premium: 35000000 },
    meal: { local: 35000, mid: 50000, premium: 120000 },
    coffee: { local: 18000, mid: 40000, premium: 70000 },
    gym: { local: 280000, mid: 600000, premium: 1500000 },
    utilities: { local: 900000, mid: 1600000, premium: 2800000 }
  },
  cantho: {
    room: { local: 2000000, mid: 3500000, premium: 5500000 },
    studio: { local: 4000000, mid: 7000000, premium: 12000000 },
    apartment: { local: 8000000, mid: 14000000, premium: 25000000 },
    meal: { local: 25000, mid: 40000, premium: 100000 },
    coffee: { local: 15000, mid: 30000, premium: 60000 },
    gym: { local: 200000, mid: 450000, premium: 1000000 },
    utilities: { local: 700000, mid: 1400000, premium: 2200000 }
  },
  vungtau: {
    room: { local: 2800000, mid: 4500000, premium: 7500000 },
    studio: { local: 5500000, mid: 9500000, premium: 16000000 },
    apartment: { local: 11000000, mid: 19000000, premium: 35000000 },
    meal: { local: 35000, mid: 55000, premium: 130000 },
    coffee: { local: 20000, mid: 40000, premium: 70000 },
    gym: { local: 300000, mid: 650000, premium: 1500000 },
    utilities: { local: 850000, mid: 1600000, premium: 2800000 }
  },
  nhatrang: {
    room: { local: 2500000, mid: 4200000, premium: 7000000 },
    studio: { local: 5000000, mid: 9000000, premium: 15000000 },
    apartment: { local: 10000000, mid: 18000000, premium: 32000000 },
    meal: { local: 30000, mid: 50000, premium: 120000 },
    coffee: { local: 18000, mid: 35000, premium: 65000 },
    gym: { local: 280000, mid: 600000, premium: 1300000 },
    utilities: { local: 800000, mid: 1500000, premium: 2500000 }
  }
};

interface LivingCostProps {
  lang: 'en' | 'vi';
}

export default function LivingCostCalculator({ lang }: LivingCostProps) {
  const t: any = lang === 'en' ? en : vi;
  const [city, setCity] = useState<'hcmc' | 'hanoi' | 'danang' | 'haiphong' | 'cantho' | 'vungtau' | 'nhatrang'>('hcmc');
  const [lifestyle, setLifestyle] = useState<'local' | 'mid' | 'premium'>('mid');
  const [rentLocation, setRentLocation] = useState<'center' | 'outskirts'>('center');
  const [householdSize, setHouseholdSize] = useState<number>(1);
  const [housingType, setHousingType] = useState<'room' | 'studio' | 'apartment'>('studio');

  const currentData = useMemo(() => {
    const base = CITY_DATA[city];
    const ls = lifestyle;
    
    // Rent logic: Base price according to type, multiplied by 0.7 if outskirts
    const roomBase = base.room[ls];
    const studioBase = base.studio[ls];
    const apartmentBase = base.apartment[ls];
    const areaMult = rentLocation === 'outskirts' ? 0.7 : 1;

    return {
      rent: Math.round((housingType === 'room' ? roomBase : housingType === 'studio' ? studioBase : apartmentBase) * areaMult),
      meal: base.meal[ls],
      coffee: base.coffee[ls],
      gym: base.gym[ls],
      utilities: base.utilities[ls],
      transport: ls === 'local' ? 800000 : ls === 'mid' ? 1500000 : 3500000
    };
  }, [city, lifestyle, housingType, rentLocation]);

  const totalMonthly = useMemo(() => {
    const size = householdSize;
    // Scale factors: Food/Transport linear, Utilities shared (1.5x for 2, 2.2x for 4)
    const sizeMultUtilities = size === 1 ? 1 : size === 2 ? 1.5 : 2.2;
    const sizeMultLinear = size === 1 ? 1 : size === 2 ? 2 : 3.5;

    const monthlyFood = currentData.meal * 3 * 30 * sizeMultLinear;
    const monthlyCoffee = currentData.coffee * 30 * sizeMultLinear;
    const monthlyUtilities = currentData.utilities * sizeMultUtilities;
    const monthlyTransport = currentData.transport * sizeMultLinear;
    const monthlyGym = currentData.gym * sizeMultLinear;
    
    return Math.round(currentData.rent + monthlyFood + monthlyCoffee + monthlyUtilities + monthlyTransport + monthlyGym);
  }, [currentData, householdSize]);

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
            <option value="vungtau">{t.vungtau}</option>
            <option value="nhatrang">{t.nhatrang}</option>
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
          <label className={styles.label}>{t.householdSize}</label>
          <select 
            className={styles.select}
            value={householdSize}
            onChange={(e) => setHouseholdSize(parseInt(e.target.value))}
          >
            <option value="1">{t.single}</option>
            <option value="2">{t.couple}</option>
            <option value="4">{t.family}</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>{t.housingType}</label>
          <select 
            className={styles.select}
            value={housingType}
            onChange={(e) => setHousingType(e.target.value as any)}
          >
            <option value="room">{t.sharedRoom}</option>
            <option value="studio">{t.studio}</option>
            <option value="apartment">{t.apartment2BR}</option>
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
            <span className={styles.itemName}>
              {housingType === 'room' ? t.sharedRoom : housingType === 'studio' ? t.studio : t.apartment2BR}
            </span>
            <span className={`${styles.itemValue} styles.selected`}>
              {formatCurrency(currentData.rent)}
            </span>
          </div>
          <div className={styles.costItem} style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            <span className={styles.itemName}>{rentLocation === 'center' ? t.center : t.outskirts}</span>
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
