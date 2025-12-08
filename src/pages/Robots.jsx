import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, Card, Badge, Grid } from '../components/UIComponents';
import { RobotIcon } from '../components/RobotIcons';
import './Robots.css';

// SOL price for conversions
const SOL_PRICE_USD = 133;

const robotCategories = [
  {
    id: 'aerial',
    name: 'Aerial Drones',
    icon: 'drone',
    description: 'Autonomous flying units for surveillance, mapping, and aerial operations. Equipped with cameras, sensors, and GPS navigation.',
    useCases: ['Security Patrol', 'Aerial Photography', 'Site Survey', 'Inventory Tracking'],
    specs: {
      flight: 'Up to 45 min',
      payload: '2-5 kg',
      range: '10+ km',
      speed: '60 km/h',
    },
    features: ['GPS Navigation', 'Obstacle Avoidance', 'Night Vision', 'Real-time Streaming'],
    basePrice: { min: 15000, max: 75000 },
    integrationCost: { min: 5000, max: 20000 },
    deliveryDays: { min: 5, max: 14 },
  },
  {
    id: 'humanoid',
    name: 'Humanoid Workers',
    icon: 'humanoid',
    description: 'Bipedal robots designed for human-like tasks in warehouses, factories, and service environments. Versatile and adaptable.',
    useCases: ['Warehouse Picking', 'Assembly Line', 'Customer Service', 'Inspection'],
    specs: {
      height: '1.5-1.8 m',
      payload: '20-50 kg',
      battery: '8-12 hours',
      dexterity: 'High',
    },
    features: ['Object Recognition', 'Voice Interface', 'Multi-axis Arms', 'Learning AI'],
    basePrice: { min: 150000, max: 500000 },
    integrationCost: { min: 50000, max: 150000 },
    deliveryDays: { min: 21, max: 45 },
  },
  {
    id: 'delivery',
    name: 'Delivery Bots',
    icon: 'delivery',
    description: 'Ground-based autonomous vehicles for last-mile delivery. Navigate sidewalks and urban environments safely.',
    useCases: ['Package Delivery', 'Food Delivery', 'Medical Supply', 'Document Transport'],
    specs: {
      capacity: '10-30 kg',
      range: '20+ km',
      speed: '6 km/h',
      terrain: 'Urban/Suburban',
    },
    features: ['Sidewalk Navigation', 'Weather Resistant', 'Secure Compartment', 'Customer App'],
    basePrice: { min: 25000, max: 60000 },
    integrationCost: { min: 8000, max: 25000 },
    deliveryDays: { min: 7, max: 21 },
  },
  {
    id: 'industrial',
    name: 'Industrial Arms',
    icon: 'industrial',
    description: 'Heavy-duty robotic systems for manufacturing, construction, and industrial applications. Precision and power combined.',
    useCases: ['Welding', 'Material Handling', 'Painting', 'Precision Assembly'],
    specs: {
      reach: '1-3 meters',
      payload: '50-500 kg',
      precision: '±0.1mm',
      cycles: '10M+',
    },
    features: ['Force Feedback', 'Safety Certified', 'Multi-tool', 'Programmable'],
    basePrice: { min: 40000, max: 150000 },
    integrationCost: { min: 20000, max: 80000 },
    deliveryDays: { min: 14, max: 30 },
  },
];

const usdToSol = (usd) => Math.round((usd / SOL_PRICE_USD) * 10) / 10;

// Success Modal Component
const SuccessModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="success-modal"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="success-icon-container">
              <motion.div 
                className="success-circle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
              >
                <motion.svg 
                  viewBox="0 0 24 24" 
                  className="success-checkmark"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  />
                </motion.svg>
              </motion.div>
            </div>
            
            <motion.h2 
              className="success-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Order Received!
            </motion.h2>
            
            <motion.p 
              className="success-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              We will contact you shortly to confirm your order and arrange delivery details.
            </motion.p>
            
            <motion.div 
              className="success-particles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.span
                  key={i}
                  className="particle"
                  initial={{ 
                    opacity: 0, 
                    x: 0, 
                    y: 0,
                    scale: 0 
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    x: Math.cos(i * 30 * Math.PI / 180) * 100,
                    y: Math.sin(i * 30 * Math.PI / 180) * 100,
                    scale: [0, 1, 0]
                  }}
                  transition={{ 
                    delay: 0.4 + i * 0.05,
                    duration: 1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
            
            <motion.button 
              className="success-close-btn"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Browsing
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Order Form Component
const OrderForm = ({ robot, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    quantity: 1,
    priceTier: 'standard',
    includeIntegration: true,
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return email.includes('@') && email.includes('.');
  };

  const validatePhone = (phone) => {
    // Phone should only contain numbers, spaces, +, -, ()
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    return /^\d+$/.test(cleanPhone) && cleanPhone.length >= 7;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number should contain only digits';
    }
    if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to Terms of Service';
    }
    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = 'You must agree to Privacy Policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success - simulate order
    onSuccess();
  };

  // Price tier multipliers
  const tierMultipliers = {
    budget: 0,
    standard: 0.5,
    premium: 1
  };
  const tierMultiplier = tierMultipliers[formData.priceTier];
  
  const baseUnit = robot.basePrice.min + (robot.basePrice.max - robot.basePrice.min) * tierMultiplier;
  const baseTotal = baseUnit * formData.quantity;
  const integration = formData.includeIntegration 
    ? (robot.integrationCost.min + (robot.integrationCost.max - robot.integrationCost.min) * tierMultiplier)
    : 0;
  const totalUSD = Math.round(baseTotal + integration);
  const deliveryDays = Math.round(robot.deliveryDays.min + (robot.deliveryDays.max - robot.deliveryDays.min) * tierMultiplier);

  return (
    <motion.div 
      className="order-form-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="order-form-container"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="order-form-header">
          <div className="order-robot-info">
            <RobotIcon type={robot.icon} size={60} color="var(--accent-primary)" />
            <div>
              <h3>Order {robot.name}</h3>
              <p>Configure and place your order</p>
            </div>
          </div>
          <button className="order-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-section">
            <h4>Configuration</h4>
            
            <div className="form-row">
              <label>Quantity</label>
              <div className="quantity-input">
                <button type="button" onClick={() => handleChange('quantity', Math.max(1, formData.quantity - 1))}>−</button>
                <span>{formData.quantity}</span>
                <button type="button" onClick={() => handleChange('quantity', formData.quantity + 1)}>+</button>
              </div>
            </div>

            <div className="form-row">
              <label>Price Tier</label>
              <div className="tier-toggles">
                <button 
                  type="button"
                  className={`tier-toggle ${formData.priceTier === 'budget' ? 'active' : ''}`}
                  onClick={() => handleChange('priceTier', 'budget')}
                >
                  Budget
                </button>
                <button 
                  type="button"
                  className={`tier-toggle ${formData.priceTier === 'standard' ? 'active' : ''}`}
                  onClick={() => handleChange('priceTier', 'standard')}
                >
                  Standard
                </button>
                <button 
                  type="button"
                  className={`tier-toggle ${formData.priceTier === 'premium' ? 'active' : ''}`}
                  onClick={() => handleChange('priceTier', 'premium')}
                >
                  Premium
                </button>
              </div>
            </div>

            <div className="form-row checkbox-row">
              <label className="checkbox-label integration-label">
                <input
                  type="checkbox"
                  checked={formData.includeIntegration}
                  onChange={(e) => handleChange('includeIntegration', e.target.checked)}
                />
                <span className="checkbox-text">Include Integration & Setup</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h4>Contact Information</h4>
            
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your@email.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 234 567 8900"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Full delivery address including city, state, and zip code"
                rows={3}
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
          </div>

          <div className="order-summary">
            <h4>Order Summary</h4>
            <div className="summary-line">
              <span>{robot.name} × {formData.quantity}</span>
              <span>${baseTotal.toLocaleString()}</span>
            </div>
            {formData.includeIntegration && (
              <div className="summary-line">
                <span>Integration & Setup</span>
                <span>${integration.toLocaleString()}</span>
              </div>
            )}
            <div className="summary-line delivery">
              <span>Estimated Delivery</span>
              <span>{deliveryDays} days</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${totalUSD.toLocaleString()} <small>({usdToSol(totalUSD)} SOL)</small></span>
            </div>
          </div>

          <div className="agreement-section">
            <label className={`checkbox-label agreement-label ${errors.agreeTerms ? 'error' : ''}`}>
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
              />
              <span className="checkbox-text">I agree to the Terms of Service</span>
            </label>
            {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
            
            <label className={`checkbox-label agreement-label ${errors.agreePrivacy ? 'error' : ''}`}>
              <input
                type="checkbox"
                checked={formData.agreePrivacy}
                onChange={(e) => handleChange('agreePrivacy', e.target.checked)}
              />
              <span className="checkbox-text">I agree to the Privacy Policy</span>
            </label>
            {errors.agreePrivacy && <span className="error-text">{errors.agreePrivacy}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-order-btn"
            disabled={!formData.agreeTerms || !formData.agreePrivacy}
          >
            Place Order
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Robots = () => {
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOrderClick = (robot) => {
    setSelectedRobot(robot);
  };

  const handleOrderSuccess = () => {
    setSelectedRobot(null);
    setShowSuccess(true);
  };

  return (
    <div className="robots-page">
      {/* Header */}
      <section className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge>Fleet Overview</Badge>
          <h1 className="page-title">Robot Categories</h1>
          <p className="page-description">
            TaskBoard supports diverse robot types, each optimized for specific tasks. 
            Select a robot and place your order.
          </p>
        </motion.div>
      </section>

      {/* Robot Categories */}
      <div className="robot-categories">
        {robotCategories.map((category, index) => (
          <motion.div
            key={category.id}
            className="category-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="category-content">
              <div className="category-header">
                <div className="category-visual">
                  <RobotIcon 
                    type={category.icon} 
                    size={120} 
                    color="var(--accent-primary)" 
                  />
                </div>
                <div className="category-intro">
                  <h2 className="category-name">{category.name}</h2>
                  <p className="category-description">{category.description}</p>
                  <div className="category-price-range">
                    <span className="price-label">Starting from</span>
                    <span className="price-value">${category.basePrice.min.toLocaleString()}</span>
                    <span className="price-sol">({usdToSol(category.basePrice.min)} SOL)</span>
                  </div>
                </div>
              </div>

              <div className="category-details">
                <div className="category-specs">
                  <h4 className="detail-title">Specifications</h4>
                  <div className="specs-grid">
                    {Object.entries(category.specs).map(([key, value]) => (
                      <div key={key} className="spec-item">
                        <span className="spec-label">{key}</span>
                        <span className="spec-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="category-features">
                  <h4 className="detail-title">Features</h4>
                  <div className="features-list">
                    {category.features.map((feature, i) => (
                      <span key={i} className="feature-tag">◇ {feature}</span>
                    ))}
                  </div>
                </div>

                <div className="category-usecases">
                  <h4 className="detail-title">Use Cases</h4>
                  <div className="usecases-list">
                    {category.useCases.map((useCase, i) => (
                      <Badge key={i}>{useCase}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="category-action">
                <motion.button
                  className="order-btn"
                  onClick={() => handleOrderClick(category)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Order Now</span>
                  <span className="btn-arrow">→</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <Section className="stats-section">
        <div className="stats-container">
          <motion.div 
            className="stat-block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="stat-icon">
              <RobotIcon type="drone" size={50} color="var(--accent-primary)" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Aerial Fleet</span>
              <span className="stat-note">Drones & UAVs</span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon">
              <RobotIcon type="humanoid" size={50} color="var(--accent-primary)" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Ground Units</span>
              <span className="stat-note">Humanoids & Workers</span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon">
              <RobotIcon type="delivery" size={50} color="var(--accent-primary)" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Delivery Bots</span>
              <span className="stat-note">Last-Mile Fleet</span>
            </div>
          </motion.div>

          <motion.div 
            className="stat-block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon">
              <RobotIcon type="industrial" size={50} color="var(--accent-primary)" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Industrial</span>
              <span className="stat-note">Heavy Machinery</span>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Order Form Modal */}
      <AnimatePresence>
        {selectedRobot && (
          <OrderForm 
            robot={selectedRobot}
            onClose={() => setSelectedRobot(null)}
            onSuccess={handleOrderSuccess}
          />
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default Robots;
