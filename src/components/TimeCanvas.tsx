import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TimeBox from './TimeBox';

interface TimeCanvasProps {
  name: string;
  birthDate: Date;
  lifeExpectancy: number;
  isSimulationStarted: boolean;
}

const TimeCanvas: React.FC<TimeCanvasProps> = ({
  name, 
  birthDate, 
  lifeExpectancy,
  isSimulationStarted
}) => {
  const { t } = useTranslation();
  const [currentBoxes, setCurrentBoxes] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [elapsedDays, setElapsedDays] = useState(0);
  
  // 計算總共的月數
  const totalMonths = lifeExpectancy * 12;
  
  // 計算從出生到現在的月數
  const now = new Date();
  const ageInMonths = 
    (now.getFullYear() - birthDate.getFullYear()) * 12 + 
    (now.getMonth() - birthDate.getMonth());
    
  // 計算從出生到現在的天數
  const ageInDays = Math.floor(
    (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // 適配畫布大小
  const canvasSize = 600; // 最大畫布大小
  
  // 計算合適的方塊大小和間隙
  const boxesPerRow = Math.ceil(Math.sqrt(totalMonths));
  const gap = 2; // 間隙大小
  const boxSize = (canvasSize - (boxesPerRow + 1) * gap) / boxesPerRow;
  
  // 創建方塊陣列
  const boxes = Array.from({ length: totalMonths }, (_, i) => {
    const delay = isSimulationStarted ? Math.min(i * 0.01, 0.5) : 0;
    const isFilled = i < currentBoxes;
    return { id: i, delay, isFilled };
  });
  
  // 模擬時間流逝
  useEffect(() => {
    if (!isSimulationStarted) return;
    
    // 顯示描述
    setTimeout(() => setShowDescription(true), 1000);
    
    // 填充方塊的動畫
    let startTime = Date.now();
    let frame: number;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      // 使動畫開始慢，後來越來越快
      const progress = Math.min(1, Math.pow(elapsed / (ageInMonths * 100), 0.8));
      const newBoxes = Math.floor(progress * ageInMonths);
      
      setCurrentBoxes(newBoxes);
      setElapsedDays(Math.floor(progress * ageInDays));
      
      if (newBoxes < ageInMonths) {
        frame = requestAnimationFrame(animate);
      }
    };
    
    frame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isSimulationStarted, ageInMonths, ageInDays]);
  
  // 淡出描述文字
  useEffect(() => {
    if (!showDescription) return;
    
    const timeout = setTimeout(() => {
      setShowDescription(false);
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [showDescription]);

  // 計算年月天數換算
  const daysToMonthsAndYears = (days: number) => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    return { days, months, years };
  };

  const timeData = daysToMonthsAndYears(elapsedDays);
  
  return (
    <div className="canvas-container">
      <AnimatePresence>
        {showDescription && (
          <motion.div 
            className="description serif"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.95, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {t('description')}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="time-info-panel"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.div 
          className="time-display-title serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {t('timeElapsed')}
        </motion.div>
        
        <motion.div 
          className="time-display-value"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 1.5
          }}
        >
          <span className="time-number">{timeData.days.toLocaleString()}</span>
          <span className="time-unit">{t('days')}</span>
        </motion.div>
        
        <motion.div 
          className="time-display-equivalent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="equivalent-row">
            <span className="equal-sign">=</span>
            <span className="time-number">{timeData.months}</span>
            <span className="time-unit-small">{t('months')}</span>
          </div>
          
          <div className="equivalent-row">
            <span className="equal-sign">=</span>
            <span className="time-number">{timeData.years}</span>
            <span className="time-unit-small">{t('years')}</span>
          </div>
        </motion.div>

        <motion.div 
          className="time-display-title serif" 
          style={{ marginTop: '25px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          {t('timeRemaining')}
        </motion.div>
        
        <motion.div 
          className="time-display-value"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span className="time-number">
              {Math.max(0, (lifeExpectancy * 365 - elapsedDays)).toLocaleString()}
            </span>
            <span className="time-unit">{t('days')}</span>
          </div>
        </motion.div>
      </motion.div>
      
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          width: canvasSize,
          height: canvasSize,
        }}
      >
        {boxes.map(box => (
          <TimeBox 
            key={box.id}
            isFilled={box.isFilled}
            delay={box.delay}
            boxSize={boxSize}
            gap={gap}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeCanvas; 