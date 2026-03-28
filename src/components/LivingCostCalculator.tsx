'use client';

import React, { useState, useMemo } from 'react';
import styles from './LivingCostCalculator.module.css';
import en from '../locales/en.json';
import vi from '../locales/vi.json';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

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

  const EXCHANGE_RATE = 25500; // Reference 1 USD = 25,500 VND (March 2025 avg)

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

  const comparativeData = useMemo(() => {
    const size = householdSize;
    const ls = lifestyle;
    const sizeMultUtilities = size === 1 ? 1 : size === 2 ? 1.5 : 2.2;
    const sizeMultLinear = size === 1 ? 1 : size === 2 ? 2 : 3.5;

    // Calculate Average
    const cities = Object.keys(CITY_DATA);
    let avgTotal = 0;
    cities.forEach(c => {
      const data = CITY_DATA[c];
      const rent = Math.round((housingType === 'room' ? data.room[ls] : housingType === 'studio' ? data.studio[ls] : data.apartment[ls]) * (rentLocation === 'outskirts' ? 0.7 : 1));
      const transport = ls === 'local' ? 800000 : ls === 'mid' ? 1500000 : 3500000;
      
      const monFood = data.meal[ls] * 3 * 30 * sizeMultLinear;
      const monCoffee = data.coffee[ls] * 30 * sizeMultLinear;
      const monUtil = data.utilities[ls] * sizeMultUtilities;
      const monTrans = transport * sizeMultLinear;
      const monGym = data.gym[ls] * sizeMultLinear;
      
      avgTotal += (rent + monFood + monCoffee + monUtil + monTrans + monGym);
    });
    
    const nationalAvg = Math.round(avgTotal / cities.length);

    return [
      { name: t.nationalAvg, value: nationalAvg, fill: 'rgba(255, 255, 255, 0.2)' },
      { name: t.selectedCity, value: totalMonthly, fill: 'var(--primary)' }
    ];
  }, [totalMonthly, householdSize, lifestyle, housingType, rentLocation, t]);

  const formatCurrency = (amount: number, currency: 'VND' | 'USD' = 'VND') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount / EXCHANGE_RATE);
    }
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
              <span className={styles.usdRef}>{formatCurrency(currentData.rent, 'USD')}</span>
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
            <span className={styles.itemValue}>
              {formatCurrency(currentData.meal)}
              <span className={styles.usdRef}>{formatCurrency(currentData.meal, 'USD')}</span>
            </span>
          </div>
          <div className={`${styles.costItem} ${styles.dailyRow}`}>
            <span className={styles.itemName}>{t.dailyFood} (3x)</span>
            <span className={styles.itemValue}>
              {formatCurrency(currentData.meal * 3)}
              <span className={styles.usdRef}>{formatCurrency(currentData.meal * 3, 'USD')}</span>
            </span>
          </div>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.coffee}</span>
            <span className={styles.itemValue}>
              {formatCurrency(currentData.coffee)}
              <span className={styles.usdRef}>{formatCurrency(currentData.coffee, 'USD')}</span>
            </span>
          </div>
        </div>

        <div className={styles.categoryCard}>
          <h3 className={styles.categoryTitle}>{t.other}</h3>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.utilities}</span>
            <span className={styles.itemValue}>
              {formatCurrency(currentData.utilities)}
              <span className={styles.usdRef}>{formatCurrency(currentData.utilities, 'USD')}</span>
            </span>
          </div>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.gym}</span>
            <span className={styles.itemValue}>
              {formatCurrency(currentData.gym)}
              <span className={styles.usdRef}>{formatCurrency(currentData.gym, 'USD')}</span>
            </span>
          </div>
          <div className={styles.costItem}>
            <span className={styles.itemName}>{t.transport}</span>
            <span className={styles.itemValue}>
              {formatCurrency(currentData.transport)}
              <span className={styles.usdRef}>{formatCurrency(currentData.transport, 'USD')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.totalCard}>
        <div className={styles.totalLabel}>{t.monthlyTotal}</div>
        <div className={styles.totalValue}>
          {formatCurrency(totalMonthly)}
          <span className={styles.usdTotal}>≈ {formatCurrency(totalMonthly, 'USD')}</span>
        </div>
        <p className={styles.rangeText}>* {t.estimatedRange} (VND) - $1 ≈ {formatCurrency(EXCHANGE_RATE)}</p>
      </div>

      <div className={`${styles.chartSection} no-print`}>
        <h3 className={styles.chartTitle}>{t.comparativeTitle}</h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={comparativeData} layout="vertical" margin={{ left: 20, right: 40 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={lang === 'en' ? 100 : 120}
                stroke="var(--text-secondary)"
                fontSize={12}
              />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: '#1e293b', border: '1px solid var(--surface-border)', borderRadius: '8px' }}
                formatter={(val: any) => val ? [formatCurrency(Number(val)), ''] : ['', '']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                {comparativeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${styles.printContainer} no-print`}>
        <button className={styles.printBtn} onClick={() => window.print()}>
          🖨️ {t.printReport}
        </button>
      </div>
    </div>
  );
}
