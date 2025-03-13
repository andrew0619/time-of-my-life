import React from 'react';
import { motion } from 'framer-motion';

interface TimeBoxProps {
  isFilled: boolean;
  delay: number;
  boxSize: number;
  gap: number;
}

const TimeBox: React.FC<TimeBoxProps> = ({ isFilled, delay, boxSize, gap }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1,
        scale: 1,
        backgroundColor: isFilled ? 'var(--box-filled-color)' : 'transparent',
        boxShadow: isFilled ? 'var(--box-filled-glow)' : 'none'
      }}
      transition={{ 
        duration: 0.5, 
        delay,
        backgroundColor: { duration: 0.5 },
        boxShadow: { duration: 0.5 },
        scale: { 
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }}
      style={{ 
        width: boxSize, 
        height: boxSize, 
        border: '1px solid var(--box-border-color)',
        margin: `${gap/2}px`,
        backdropFilter: isFilled ? 'blur(2px)' : 'none',
        borderRadius: '2px',
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    />
  );
};

export default TimeBox; 