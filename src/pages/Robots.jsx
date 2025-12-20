import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, Card, Badge, Grid } from '../components/UIComponents';
import { RobotIcon } from '../components/RobotIcons';
import './Robots.css';

// SOL price for conversions (December 2024)
const SOL_PRICE_USD = 126;

// ROI Calculator Data - 3 tiers per robot type
const roiData = {
  drone: {
    name: 'Aerial Drone',
    icon: 'drone',
    models: {
      budget: {
        name: 'DJI Mini 3 Pro',
        price: 1500,
        maintenance: 150,
        efficiency: 0.7, // 70% of max revenue
        battery: '34 min',
        payload: '0.5 kg',
      },
      standard: {
        name: 'DJI Matrice 30',
        price: 12000,
        maintenance: 1200,
        efficiency: 1.0,
        battery: '41 min',
        payload: '2.7 kg',
      },
      premium: {
        name: 'DJI Matrice 350 RTK',
        price: 28000,
        maintenance: 2800,
        efficiency: 1.3, // 130% revenue (advanced features)
        battery: '55 min',
        payload: '2.7 kg',
      },
    },
    taskTypes: {
      inspection: { label: 'Infrastructure Inspection', hourlyRevenue: 85 },
      survey: { label: 'Land Survey & Mapping', hourlyRevenue: 95 },
      security: { label: 'Security Patrol', hourlyRevenue: 60 },
      photography: { label: 'Aerial Photography', hourlyRevenue: 120 },
    },
  },
  humanoid: {
    name: 'Humanoid Robot',
    icon: 'humanoid',
    models: {
      budget: {
        name: 'Unitree G1',
        price: 16000,
        maintenance: 1600,
        efficiency: 0.7,
        battery: '2 hours',
        payload: '3 kg',
      },
      standard: {
        name: 'Unitree H1',
        price: 90000,
        maintenance: 9000,
        efficiency: 1.0,
        battery: '4 hours',
        payload: '10 kg',
      },
      premium: {
        name: 'Boston Dynamics Atlas',
        price: 200000,
        maintenance: 20000,
        efficiency: 1.4,
        battery: '8 hours',
        payload: '25 kg',
      },
    },
    taskTypes: {
      warehouse: { label: 'Warehouse Operations', hourlyRevenue: 45 },
      assembly: { label: 'Assembly Line', hourlyRevenue: 55 },
      service: { label: 'Customer Service', hourlyRevenue: 35 },
      inspection: { label: 'Quality Inspection', hourlyRevenue: 50 },
    },
  },
  delivery: {
    name: 'Delivery Bot',
    icon: 'delivery',
    models: {
      budget: {
        name: 'Kiwibot K3',
        price: 2500,
        maintenance: 250,
        efficiency: 0.6,
        battery: '6 hours',
        payload: '10 kg',
      },
      standard: {
        name: 'Starship Bot',
        price: 8000,
        maintenance: 800,
        efficiency: 1.0,
        battery: '12 hours',
        payload: '20 kg',
      },
      premium: {
        name: 'Nuro R3',
        price: 50000,
        maintenance: 5000,
        efficiency: 1.5,
        battery: '24 hours',
        payload: '190 kg',
      },
    },
    taskTypes: {
      food: { label: 'Food Delivery', hourlyRevenue: 22 },
      packages: { label: 'Package Delivery', hourlyRevenue: 28 },
      medical: { label: 'Medical Supplies', hourlyRevenue: 35 },
      documents: { label: 'Document Transport', hourlyRevenue: 18 },
    },
  },
  industrial: {
    name: 'Industrial Arm',
    icon: 'industrial',
    models: {
      budget: {
        name: 'FANUC LR Mate',
        price: 25000,
        maintenance: 2500,
        efficiency: 0.75,
        reach: '0.7 m',
        payload: '7 kg',
      },
      standard: {
        name: 'KUKA KR CYBERTECH',
        price: 55000,
        maintenance: 5500,
        efficiency: 1.0,
        reach: '2.0 m',
        payload: '20 kg',
      },
      premium: {
        name: 'KUKA KR QUANTEC',
        price: 120000,
        maintenance: 12000,
        efficiency: 1.35,
        reach: '3.1 m',
        payload: '120 kg',
      },
    },
    taskTypes: {
      welding: { label: 'Welding Operations', hourlyRevenue: 110 },
      handling: { label: 'Material Handling', hourlyRevenue: 85 },
      assembly: { label: 'Precision Assembly', hourlyRevenue: 95 },
      painting: { label: 'Painting/Coating', hourlyRevenue: 100 },
    },
  },
};

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

// ROI Calculator Component
const ROICalculator = () => {
  const [robotType, setRobotType] = useState('drone');
  const [modelTier, setModelTier] = useState('standard');
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [taskType, setTaskType] = useState('');
  const [showResults, setShowResults] = useState(false);

  const robot = roiData[robotType];
  const taskTypes = robot?.taskTypes || {};
  const models = robot?.models || {};
  const selectedModel = models[modelTier];

  // Set default task type when robot changes
  const handleRobotChange = (type) => {
    setRobotType(type);
    setTaskType(Object.keys(roiData[type].taskTypes)[0]);
    setShowResults(false);
  };

  // Initialize task type on first render
  if (!taskType && robot) {
    setTaskType(Object.keys(taskTypes)[0]);
  }

  const calculateROI = () => {
    if (!robot || !taskType || !selectedModel) return null;

    const task = taskTypes[taskType];
    const baseHourlyRevenue = task?.hourlyRevenue || 0;
    const hourlyRevenue = baseHourlyRevenue * selectedModel.efficiency;
    
    // Working days per month/year
    const workDaysPerMonth = 22;
    const workDaysPerYear = 260;
    
    // Revenue calculations
    const dailyRevenue = hourlyRevenue * hoursPerDay;
    const monthlyRevenue = dailyRevenue * workDaysPerMonth;
    const yearlyRevenue = dailyRevenue * workDaysPerYear;
    
    // Costs
    const totalInitialCost = selectedModel.price;
    const yearlyMaintenance = selectedModel.maintenance;
    const monthlyMaintenance = yearlyMaintenance / 12;
    
    // Energy cost estimate (rough)
    const dailyEnergyCost = hoursPerDay * 0.5; // ~$0.5 per hour of operation
    const monthlyEnergyCost = dailyEnergyCost * workDaysPerMonth;
    const yearlyEnergyCost = dailyEnergyCost * workDaysPerYear;
    
    // Net profit
    const monthlyProfit = monthlyRevenue - monthlyMaintenance - monthlyEnergyCost;
    const yearlyProfit = yearlyRevenue - yearlyMaintenance - yearlyEnergyCost;
    
    // Payback period in months
    const paybackMonths = monthlyProfit > 0 ? totalInitialCost / monthlyProfit : 999;
    
    // 5 year projection
    const fiveYearRevenue = yearlyRevenue * 5;
    const fiveYearCosts = totalInitialCost + (yearlyMaintenance * 5) + (yearlyEnergyCost * 5);
    const fiveYearProfit = fiveYearRevenue - fiveYearCosts;
    
    // Daily tasks estimate (based on task type)
    const avgTaskDuration = robotType === 'delivery' ? 0.25 : robotType === 'drone' ? 0.5 : 1; // hours
    const tasksPerDay = Math.floor(hoursPerDay / avgTaskDuration);
    
    return {
      dailyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      monthlyProfit,
      yearlyProfit,
      monthlyMaintenance,
      monthlyEnergyCost,
      paybackMonths: Math.ceil(paybackMonths),
      totalInvestment: totalInitialCost,
      roi: ((yearlyProfit / totalInitialCost) * 100).toFixed(1),
      fiveYearProfit,
      tasksPerDay,
      hourlyRevenue: hourlyRevenue.toFixed(0),
    };
  };

  const results = showResults ? calculateROI() : null;

  const formatUSD = (value) => `$${Math.round(value).toLocaleString()}`;
  const formatSOL = (usd) => `${(usd / SOL_PRICE_USD).toFixed(1)} SOL`;

  const tierLabels = {
    budget: { label: 'Budget', color: '#6b7280' },
    standard: { label: 'Standard', color: '#10b981' },
    premium: { label: 'Premium', color: '#f59e0b' },
  };

  return (
    <div className="roi-calculator">
      <div className="roi-form">
        {/* Robot Type Selection */}
        <div className="roi-field">
          <label>Robot Type</label>
          <div className="roi-robot-selector">
            {Object.entries(roiData).map(([key, data]) => (
              <button
                key={key}
                className={`roi-robot-btn ${robotType === key ? 'active' : ''}`}
                onClick={() => handleRobotChange(key)}
              >
                <RobotIcon type={data.icon} size={32} color={robotType === key ? '#10b981' : '#6b7280'} />
                <span>{data.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Model Selection */}
        <div className="roi-field">
          <label>Model Tier</label>
          <div className="roi-model-selector">
            {Object.entries(models).map(([tier, model]) => (
              <button
                key={tier}
                className={`roi-model-btn ${modelTier === tier ? 'active' : ''}`}
                onClick={() => {
                  setModelTier(tier);
                  setShowResults(false);
                }}
                style={{ '--tier-color': tierLabels[tier].color }}
              >
                <div className="model-tier-badge" style={{ background: tierLabels[tier].color }}>
                  {tierLabels[tier].label}
                </div>
                <div className="model-name">{model.name}</div>
                <div className="model-price">{formatUSD(model.price)}</div>
                <div className="model-specs">
                  {model.battery && <span>🔋 {model.battery}</span>}
                  {model.payload && <span>📦 {model.payload}</span>}
                  {model.reach && <span>📏 {model.reach}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Hours Per Day - Two Column Layout */}
        <div className="roi-two-columns">
          <div className="roi-field">
            <label>Hours of Operation Per Day</label>
            <div className="roi-slider-container">
              <div className="roi-slider-wrapper">
                <div className="roi-slider-track">
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={hoursPerDay}
                    onChange={(e) => {
                      setHoursPerDay(parseInt(e.target.value));
                      setShowResults(false);
                    }}
                    className="roi-slider"
                  />
                  <div 
                    className="roi-slider-fill"
                    style={{ width: `${((hoursPerDay - 1) / 23) * 100}%` }}
                  />
                </div>
                <div className="roi-slider-labels">
                  <span>1h</span>
                  <span>12h</span>
                  <span>24h</span>
                </div>
              </div>
              <div className="roi-slider-value">
                <span className="roi-hours">{hoursPerDay}</span>
                <span className="roi-hours-label">hrs/day</span>
              </div>
            </div>
          </div>

          {/* Task Type Selection */}
          <div className="roi-field">
            <label>Task Type</label>
            <div className="roi-task-grid">
              {Object.entries(taskTypes).map(([key, task]) => (
                <button
                  key={key}
                  className={`roi-task-btn ${taskType === key ? 'active' : ''}`}
                  onClick={() => {
                    setTaskType(key);
                    setShowResults(false);
                  }}
                >
                  <span className="task-name">{task.label}</span>
                  <span className="task-rate">${task.hourlyRevenue}/hr base</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button 
          className="roi-calculate-btn"
          onClick={() => setShowResults(true)}
        >
          <span>Calculate ROI</span>
          <span className="btn-icon">→</span>
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div 
            className="roi-results"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="roi-results-header">
              <h4>💰 Investment Analysis</h4>
              <div className="roi-model-info">
                <span className="model-badge" style={{ background: tierLabels[modelTier].color }}>
                  {tierLabels[modelTier].label}
                </span>
                <span className="roi-robot-name">{selectedModel.name}</span>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="roi-investment-box">
              <div className="roi-investment-label">Total Investment</div>
              <div className="roi-investment-value">
                <span className="usd">{formatUSD(results.totalInvestment)}</span>
                <span className="sol">{formatSOL(results.totalInvestment)}</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="roi-metrics-grid">
              <div className="roi-metric payback">
                <div className="metric-icon">⏱️</div>
                <div className="metric-value">{results.paybackMonths > 100 ? '100+' : results.paybackMonths}</div>
                <div className="metric-label">Months to Payback</div>
              </div>
              <div className="roi-metric roi-percent">
                <div className="metric-icon">📈</div>
                <div className="metric-value">{results.roi}%</div>
                <div className="metric-label">Annual ROI</div>
              </div>
              <div className="roi-metric">
                <div className="metric-icon">📋</div>
                <div className="metric-value">~{results.tasksPerDay}</div>
                <div className="metric-label">Tasks per Day</div>
              </div>
              <div className="roi-metric">
                <div className="metric-icon">💵</div>
                <div className="metric-value">${results.hourlyRevenue}</div>
                <div className="metric-label">Effective $/hr</div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="roi-breakdown">
              <h5>Monthly Breakdown</h5>
              <div className="roi-breakdown-row">
                <span className="breakdown-label">Gross Revenue</span>
                <span className="breakdown-value">
                  {formatUSD(results.monthlyRevenue)}
                  <small>{formatSOL(results.monthlyRevenue)}</small>
                </span>
              </div>
              <div className="roi-breakdown-row expense">
                <span className="breakdown-label">− Maintenance</span>
                <span className="breakdown-value">
                  {formatUSD(results.monthlyMaintenance)}
                </span>
              </div>
              <div className="roi-breakdown-row expense">
                <span className="breakdown-label">− Energy Costs</span>
                <span className="breakdown-value">
                  {formatUSD(results.monthlyEnergyCost)}
                </span>
              </div>
              <div className="roi-breakdown-row highlight">
                <span className="breakdown-label">Net Profit</span>
                <span className="breakdown-value profit">
                  {formatUSD(results.monthlyProfit)}
                  <small>{formatSOL(results.monthlyProfit)}</small>
                </span>
              </div>
            </div>

            {/* Yearly Summary */}
            <div className="roi-yearly-summary">
              <div className="yearly-item">
                <span className="yearly-label">Yearly Profit</span>
                <span className="yearly-value">{formatUSD(results.yearlyProfit)}</span>
                <span className="yearly-sol">{formatSOL(results.yearlyProfit)}</span>
              </div>
              <div className="yearly-item highlight">
                <span className="yearly-label">5-Year Projection</span>
                <span className="yearly-value">{formatUSD(results.fiveYearProfit)}</span>
                <span className="yearly-sol">{formatSOL(results.fiveYearProfit)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

      {/* ROI Calculator Section */}
      <Section className="roi-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge>Investment Analysis</Badge>
          <h2>ROI Calculator</h2>
          <p>Calculate your robot's return on investment based on real market data</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ROICalculator />
        </motion.div>
      </Section>

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
