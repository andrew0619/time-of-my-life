import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface LifeExpectancyAdjusterProps {
  lifeExpectancy: number;
  setLifeExpectancy: (value: number) => void;
  isSimulationStarted: boolean;
}

const LifeExpectancyAdjuster: React.FC<LifeExpectancyAdjusterProps> = ({
  lifeExpectancy,
  setLifeExpectancy,
  isSimulationStarted
}) => {
  const { t } = useTranslation();
  
  if (!isSimulationStarted) return null;
  
  return (
    <motion.div 
      className="left-controls"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <div className="control-title">{t('lifeExpectancyLabel')}</div>
      
      <div className="button-group">
        <motion.button 
          onClick={() => setLifeExpectancy(Math.max(lifeExpectancy - 1, 20))}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="control-button"
        >
          -
        </motion.button>
        
        <span className="life-expectancy-value">{lifeExpectancy}</span>
        
        <motion.button 
          onClick={() => setLifeExpectancy(Math.min(lifeExpectancy + 1, 120))}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="control-button"
        >
          +
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LifeExpectancyAdjuster; 