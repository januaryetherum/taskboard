import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from './Icons';
import './Navigation.css';

// Contract address
const CONTRACT_ADDRESS = "ESN7PWw7Vu5dWsN5pBva8NABSeiPAUxAjqJNQr7pump";

const navItems = [
  { path: '/', label: 'Home', icon: 'diamond' },
  { path: '/how-it-works', label: 'How It Works', icon: 'hexagon' },
  { path: '/playground', label: 'Playground', icon: 'square' },
  { path: '/robots', label: 'Robots', icon: 'circle' },
  { path: '/docs', label: 'Docs', icon: 'grid' },
  { path: '/about', label: 'About', icon: 'triangle' },
];

const Navigation = () => {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.nav 
      className="navigation"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          <img src="/logo.png" alt="TaskBoard" className="logo-icon" />
          <span className="logo-text">TaskBoard</span>
        </NavLink>

        {/* Center - Navigation Links */}
        <div className="nav-center">
          <div className="nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon name={item.icon} size={16} />
                <span className="nav-label">{item.label}</span>
                {location.pathname === item.path && (
                  <motion.div
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right - Copy Contract and Social */}
        <div className="nav-right">
          <button className="copy-contract-btn" onClick={handleCopyContract}>
            {copied ? (
              <>
                <Icon name="check" size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Icon name="copy" size={14} />
                <span>Copy Contract</span>
              </>
            )}
          </button>
          <a 
            href="https://github.com/januaryetherum/taskboard" 
            className="social-btn" 
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="github" size={18} />
          </a>
          <a 
            href="https://x.com/TaskBoardRaaS" 
            className="social-btn" 
            aria-label="Twitter/X"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="twitter" size={18} />
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
