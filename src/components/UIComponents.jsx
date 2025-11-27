import { motion } from 'framer-motion';
import './UIComponents.css';

export const Card = ({ 
  children, 
  variant = 'default', 
  hover = true,
  className = '',
  ...props 
}) => (
  <motion.div 
    className={`card card-${variant} ${className}`}
    whileHover={hover ? { y: -5, scale: 1.02 } : {}}
    transition={{ duration: 0.2 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon,
  disabled = false,
  className = '',
  ...props 
}) => (
  <motion.button 
    className={`btn btn-${variant} btn-${size} ${className}`}
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    disabled={disabled}
    {...props}
  >
    {icon && <span className="btn-icon">{icon}</span>}
    {children}
  </motion.button>
);

export const Badge = ({ children, variant = 'default', className = '' }) => (
  <span className={`badge badge-${variant} ${className}`}>
    {children}
  </span>
);

export const Stat = ({ label, value, suffix = '', prefix = '' }) => (
  <div className="stat">
    <div className="stat-value">
      {prefix}{value}{suffix}
    </div>
    <div className="stat-label">{label}</div>
  </div>
);

export const Divider = ({ text }) => (
  <div className="divider">
    <span className="divider-line"></span>
    {text && <span className="divider-text">{text}</span>}
    <span className="divider-line"></span>
  </div>
);

export const Grid = ({ children, cols = 3, gap = '2rem', className = '' }) => (
  <div 
    className={`grid ${className}`} 
    style={{ 
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap 
    }}
  >
    {children}
  </div>
);

export const Section = ({ 
  children, 
  id,
  title, 
  subtitle,
  className = '',
  centered = false 
}) => (
  <section id={id} className={`section ${centered ? 'centered' : ''} ${className}`}>
    {(title || subtitle) && (
      <div className="section-header">
        {title && <h2 className="section-title">{title}</h2>}
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

export const GlowText = ({ children, color = 'primary', as: Component = 'span' }) => (
  <Component className={`glow-text glow-${color}`}>
    {children}
  </Component>
);

export const TypeWriter = ({ text, speed = 50, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);
  
  return <span className={className}>{displayText}</span>;
};

import { useState, useEffect } from 'react';

export const AnimatedNumber = ({ value, duration = 2000, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(Math.floor(startValue + (value - startValue) * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

export const FeatureItem = ({ icon, title, description }) => (
  <div className="feature-item">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

export const StepItem = ({ number, title, description, isLast = false }) => (
  <div className="step-item">
    <div className="step-number">{number}</div>
    <div className="step-content">
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </div>
    {!isLast && <div className="step-connector"></div>}
  </div>
);
