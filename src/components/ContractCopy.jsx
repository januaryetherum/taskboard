import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icons';
import './ContractCopy.css';

const ContractCopy = () => {
  const [copied, setCopied] = useState(false);
  
  // Placeholder contract address
  const contractAddress = 'TBD...XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="contract-copy">
      <button className="contract-btn" onClick={handleCopy} title="Copy Contract">
        <Icon name="copy" size={16} />
      </button>
      
      <AnimatePresence>
        {copied && (
          <motion.div
            className="copy-notification"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Icon name="check" size={14} color="white" />
            <span>Done</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContractCopy;
