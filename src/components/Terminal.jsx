import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Terminal.css';

const Terminal = ({ 
  title = 'terminal', 
  children, 
  typing = false,
  typingSpeed = 20,
  className = ''
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(typing);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!typing || !children) {
      setDisplayedContent(children);
      return;
    }

    const text = typeof children === 'string' ? children : '';
    let index = 0;
    setIsTyping(true);
    setDisplayedContent('');

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedContent(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [children, typing, typingSpeed]);

  return (
    <motion.div 
      className={`terminal ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-btn close"></span>
          <span className="terminal-btn minimize"></span>
          <span className="terminal-btn maximize"></span>
        </div>
        <span className="terminal-title">{title}</span>
        <div className="terminal-spacer"></div>
      </div>
      <div className="terminal-body" ref={contentRef}>
        <pre className="terminal-content">
          {typing ? displayedContent : children}
          {isTyping && <span className="terminal-cursor">█</span>}
        </pre>
      </div>
    </motion.div>
  );
};

export const TerminalLine = ({ prefix = '$', children, highlight = false }) => (
  <div className={`terminal-line ${highlight ? 'highlight' : ''}`}>
    <span className="terminal-prefix">{prefix}</span>
    <span className="terminal-text">{children}</span>
  </div>
);

export const TerminalOutput = ({ children, success = false, error = false }) => (
  <div className={`terminal-output ${success ? 'success' : ''} ${error ? 'error' : ''}`}>
    {children}
  </div>
);

export const TerminalSection = ({ title, children }) => (
  <div className="terminal-section">
    <div className="terminal-section-title"># {title}</div>
    {children}
  </div>
);

export default Terminal;
