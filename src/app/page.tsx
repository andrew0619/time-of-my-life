'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import TimeCanvas from '../components/TimeCanvas';
import LifeExpectancyAdjuster from '../components/LifeExpectancyAdjuster';
import '../styles/globals.css';
import '../i18n';

// 生成年份選項
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 100;
  const years = [];
  
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  
  return years;
};

// 生成月份選項
const generateMonthOptions = () => {
  const months = [];
  
  for (let month = 1; month <= 12; month++) {
    months.push(month);
  }
  
  return months;
};

// 生成日期選項
const generateDayOptions = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  return days;
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState(1990);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [dayOptions, setDayOptions] = useState<number[]>([]);
  
  // 更新日期選項
  useEffect(() => {
    setDayOptions(generateDayOptions(birthYear, birthMonth));
    // 如果選擇的日期超過了當月的天數，調整為當月最後一天
    const daysInSelectedMonth = new Date(birthYear, birthMonth, 0).getDate();
    if (birthDay > daysInSelectedMonth) {
      setBirthDay(daysInSelectedMonth);
    }
  }, [birthYear, birthMonth, birthDay]);
  
  // 切換語言
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh-TW' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  // 出生日期
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
  
  // 啟動模擬
  const startSimulation = () => {
    if (!name) return;
    setIsSimulationStarted(true);
  };
  
  // 重設模擬
  const resetSimulation = () => {
    setIsSimulationStarted(false);
  };
  
  return (
    <main className="container">
      <motion.div 
        className="language-switch"
        onClick={toggleLanguage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {t('languageSwitch')}
      </motion.div>
      
      {!isSimulationStarted ? (
        <motion.div 
          className="controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="serif" style={{ marginBottom: '30px', fontSize: '24px', textAlign: 'center' }}>
            {t('title')}
          </h1>
          
          <div className="form-group">
            <label className="form-label">{t('nameLabel')}</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder={t('nameLabel')}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">{t('birthDateLabel')}</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                value={birthYear} 
                onChange={(e) => setBirthYear(Number(e.target.value))}
                style={{ flex: 2 }}
              >
                {generateYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select 
                value={birthMonth} 
                onChange={(e) => setBirthMonth(Number(e.target.value))}
                style={{ flex: 1 }}
              >
                {generateMonthOptions().map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select 
                value={birthDay} 
                onChange={(e) => setBirthDay(Number(e.target.value))}
                style={{ flex: 1 }}
              >
                {dayOptions.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">{t('lifeExpectancyLabel')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="range" 
                min="20" 
                max="120" 
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ minWidth: '40px' }}>{lifeExpectancy} {t('yearsOld')}</span>
            </div>
          </div>
          
          <motion.button 
            onClick={startSimulation}
            style={{ marginTop: '20px' }}
            disabled={!name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('startButton')}
          </motion.button>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', position: 'relative' }}>
          <TimeCanvas
            name={name}
            birthDate={birthDate}
            lifeExpectancy={lifeExpectancy}
            isSimulationStarted={isSimulationStarted}
          />
          
          <LifeExpectancyAdjuster
            lifeExpectancy={lifeExpectancy}
            setLifeExpectancy={setLifeExpectancy}
            isSimulationStarted={isSimulationStarted}
          />
          
          <motion.button
            onClick={resetSimulation}
            style={{ 
              position: 'absolute', 
              bottom: '-50px', 
              fontSize: '14px',
              padding: '8px 20px'
            }}
            className="reset-button"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            {t('reset')}
          </motion.button>
        </div>
      )}
    </main>
  );
} 