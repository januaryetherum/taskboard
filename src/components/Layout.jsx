import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import AnimatedBackground from './AnimatedBackground';
import CursorFollower from './CursorFollower';
import ChatWidget from './ChatWidget';
import Icon from './Icons';
import './Layout.css';

const pageColorSchemes = {
  '/': 'blue',
  '/how-it-works': 'green',
  '/playground': 'purple',
  '/robots': 'orange',
  '/docs': 'terminal',
  '/about': 'neutral',
};

const Layout = ({ children }) => {
  const location = useLocation();
  const colorScheme = pageColorSchemes[location.pathname] || 'blue';

  useEffect(() => {
    document.documentElement.setAttribute('data-page', location.pathname.replace('/', '') || 'home');
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="layout">
      <CursorFollower />
      <AnimatedBackground colorScheme={colorScheme} />
      <Navigation />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <ChatWidget />
    </div>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      {/* Quick Navigation */}
      <div className="footer-nav">
        <div className="footer-nav-section">
          <h4>Protocol</h4>
          <a href="/" className="footer-nav-link">Home</a>
          <a href="/how-it-works" className="footer-nav-link">How It Works</a>
          <a href="/playground" className="footer-nav-link">Playground</a>
        </div>
        <div className="footer-nav-section">
          <h4>Resources</h4>
          <a href="/robots" className="footer-nav-link">Robots</a>
          <a href="/docs" className="footer-nav-link">Documentation</a>
          <a href="/about" className="footer-nav-link">About</a>
        </div>
        <div className="footer-nav-section">
          <h4>Social</h4>
          <a href="https://github.com/januaryetherum/taskboard" className="footer-nav-link" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://x.com/TaskBoardRaaS" className="footer-nav-link" target="_blank" rel="noopener noreferrer">Twitter/X</a>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-brand">
          <img src="/logo.png" alt="TaskBoard" className="footer-logo-img" />
          <span className="footer-name">TaskBoard</span>
        </div>
        <div className="footer-copy">
          <span className="footer-year">2025</span>
          <span className="footer-divider">·</span>
          <span>Built on Solana</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Layout;
