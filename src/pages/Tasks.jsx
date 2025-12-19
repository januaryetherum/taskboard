import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../components/UIComponents';
import './Tasks.css';

// ============ MOCK TASKS DATA ============
const mockTasks = [
  {
    id: 'TASK-001',
    title: 'Warehouse Inventory Scan',
    description: 'Complete aerial scan of warehouse zone A to update inventory records. High accuracy required.',
    robotType: 'drone',
    payment: 2.5,
    distance: 0.8,
    duration: '45 min',
    location: 'Warehouse District, Zone A',
    poster: 'LogiCorp Inc.',
    postedAt: '2 hours ago',
    status: 'open',
    priority: 'high',
    requirements: ['Camera 4K', 'GPS precision'],
  },
  {
    id: 'TASK-002',
    title: 'Package Delivery - Express',
    description: 'Deliver package from distribution center to customer address. Fragile contents, handle with care.',
    robotType: 'delivery',
    payment: 1.8,
    distance: 3.2,
    duration: '25 min',
    location: 'Downtown → Residential Area',
    poster: 'QuickShip Co.',
    postedAt: '30 min ago',
    status: 'open',
    priority: 'medium',
    requirements: ['Weight capacity 5kg', 'Temperature control'],
  },
  {
    id: 'TASK-003',
    title: 'Assembly Line Support',
    description: 'Assist in component assembly for electronics manufacturing. Precision handling required.',
    robotType: 'humanoid',
    payment: 4.2,
    distance: 1.5,
    duration: '2 hours',
    location: 'TechFactory Plant B',
    poster: 'ElectroniX Ltd.',
    postedAt: '1 hour ago',
    status: 'open',
    priority: 'high',
    requirements: ['Fine motor skills', 'ESD protection'],
  },
  {
    id: 'TASK-004',
    title: 'Welding Operation - Batch #47',
    description: 'Complete welding of steel frame components. 24 units total, quality inspection after each.',
    robotType: 'industrial',
    payment: 8.5,
    distance: 2.1,
    duration: '4 hours',
    location: 'MetalWorks Facility',
    poster: 'SteelFrame Industries',
    postedAt: '3 hours ago',
    status: 'in_progress',
    priority: 'medium',
    requirements: ['MIG welding', 'Quality sensors'],
  },
  {
    id: 'TASK-005',
    title: 'Security Patrol - Night Shift',
    description: 'Automated security patrol of commercial complex. Report any anomalies detected.',
    robotType: 'drone',
    payment: 3.0,
    distance: 0.5,
    duration: '8 hours',
    location: 'Commerce Plaza',
    poster: 'SecureGuard LLC',
    postedAt: '5 hours ago',
    status: 'in_progress',
    priority: 'low',
    requirements: ['Night vision', 'Motion detection'],
  },
  {
    id: 'TASK-006',
    title: 'Multi-Stop Delivery Route',
    description: 'Complete delivery route with 8 stops. Packages pre-loaded, route optimized.',
    robotType: 'delivery',
    payment: 5.5,
    distance: 12.4,
    duration: '3 hours',
    location: 'City-wide Route #12',
    poster: 'MegaDeliver',
    postedAt: '45 min ago',
    status: 'open',
    priority: 'medium',
    requirements: ['Multi-compartment', 'Route navigation'],
  },
  {
    id: 'TASK-007',
    title: 'Customer Service Assistant',
    description: 'Provide customer assistance at retail location. Help with product locations and basic queries.',
    robotType: 'humanoid',
    payment: 2.8,
    distance: 0.3,
    duration: '6 hours',
    location: 'MegaMart Store #42',
    poster: 'MegaMart Retail',
    postedAt: '4 hours ago',
    status: 'completed',
    priority: 'low',
    requirements: ['Voice interaction', 'Navigation'],
  },
  {
    id: 'TASK-008',
    title: 'Precision Cutting Job',
    description: 'CNC cutting of aluminum sheets according to specifications. Zero tolerance for errors.',
    robotType: 'industrial',
    payment: 6.2,
    distance: 1.8,
    duration: '2.5 hours',
    location: 'PrecisionCut Workshop',
    poster: 'AeroSpace Parts Co.',
    postedAt: '6 hours ago',
    status: 'completed',
    priority: 'high',
    requirements: ['CNC capability', 'Precision sensors'],
  },
  {
    id: 'TASK-009',
    title: 'Agricultural Survey',
    description: 'Aerial survey of farmland for crop health analysis. Generate detailed heatmap report.',
    robotType: 'drone',
    payment: 4.8,
    distance: 5.0,
    duration: '1.5 hours',
    location: 'GreenFields Farm',
    poster: 'AgriTech Solutions',
    postedAt: '1 day ago',
    status: 'open',
    priority: 'medium',
    requirements: ['Multispectral camera', 'Long range'],
  },
  {
    id: 'TASK-010',
    title: 'Warehouse Sorting Shift',
    description: 'Sort incoming packages by destination zone. High volume expected during peak hours.',
    robotType: 'humanoid',
    payment: 3.5,
    distance: 0.2,
    duration: '4 hours',
    location: 'Central Distribution Hub',
    poster: 'FastSort Logistics',
    postedAt: '2 hours ago',
    status: 'open',
    priority: 'high',
    requirements: ['Barcode scanning', 'Heavy lifting'],
  },
];

// ============ ROBOT TYPE CONFIG ============
const robotTypes = [
  { value: 'all', label: 'All Robots', icon: '🤖' },
  { value: 'drone', label: 'Drone', icon: '🚁' },
  { value: 'humanoid', label: 'Humanoid', icon: '🧑‍🤖' },
  { value: 'delivery', label: 'Delivery Bot', icon: '📦' },
  { value: 'industrial', label: 'Industrial Arm', icon: '🦾' },
];

// ============ STATUS CONFIG ============
const statusConfig = {
  open: { label: 'Open', color: '#10b981', icon: '🟢' },
  in_progress: { label: 'In Progress', color: '#f59e0b', icon: '🟡' },
  completed: { label: 'Completed', color: '#6b7280', icon: '✅' },
};

// ============ MAIN COMPONENT ============
const Tasks = () => {
  // Filter states
  const [robotFilter, setRobotFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentRange, setPaymentRange] = useState([0, 10]);
  const [distanceRange, setDistanceRange] = useState([0, 15]);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [selectedTask, setSelectedTask] = useState(null);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let result = [...mockTasks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.poster.toLowerCase().includes(query)
      );
    }

    // Robot type filter
    if (robotFilter !== 'all') {
      result = result.filter(task => task.robotType === robotFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }

    // Payment filter
    result = result.filter(task => 
      task.payment >= paymentRange[0] && task.payment <= paymentRange[1]
    );

    // Distance filter
    result = result.filter(task => 
      task.distance >= distanceRange[0] && task.distance <= distanceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'payment_high':
        result.sort((a, b) => b.payment - a.payment);
        break;
      case 'payment_low':
        result.sort((a, b) => a.payment - b.payment);
        break;
      case 'distance':
        result.sort((a, b) => a.distance - b.distance);
        break;
      case 'newest':
      default:
        // Already in order by posted time
        break;
    }

    return result;
  }, [robotFilter, statusFilter, paymentRange, distanceRange, sortBy, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: mockTasks.length,
    open: mockTasks.filter(t => t.status === 'open').length,
    inProgress: mockTasks.filter(t => t.status === 'in_progress').length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
    totalValue: mockTasks.filter(t => t.status === 'open').reduce((sum, t) => sum + t.payment, 0).toFixed(1),
  }), []);

  // Handle take task
  const handleTakeTask = (task) => {
    alert(`🚀 Task "${task.title}" accepted!\n\nTask ID: ${task.id}\nPayment: ${task.payment} SOL\n\nThis is a demo - in production, this would create a blockchain transaction.`);
    setSelectedTask(null);
  };

  // Reset filters
  const resetFilters = () => {
    setRobotFilter('all');
    setStatusFilter('all');
    setPaymentRange([0, 10]);
    setDistanceRange([0, 15]);
    setSortBy('newest');
    setSearchQuery('');
  };

  return (
    <div className="tasks-page">
      {/* Header */}
      <section className="tasks-header">
        <Badge>Task Marketplace</Badge>
        <h1>Task Board</h1>
        <p>Browse available tasks for robots and start earning SOL</p>
      </section>

      {/* Stats Bar */}
      <section className="tasks-stats">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🟢</span>
          <div className="stat-info">
            <span className="stat-value">{stats.open}</span>
            <span className="stat-label">Open</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🟡</span>
          <div className="stat-info">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card highlight">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-value">{stats.totalValue} SOL</span>
            <span className="stat-label">Available Value</span>
          </div>
        </div>
      </section>

      <div className="tasks-container">
        {/* Filters Sidebar */}
        <aside className="filters-panel">
          <div className="filters-header">
            <h3>🔍 Filters</h3>
            <button className="reset-btn" onClick={resetFilters}>Reset</button>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Robot Type Filter */}
          <div className="filter-group">
            <label>Robot Type</label>
            <div className="filter-buttons">
              {robotTypes.map(type => (
                <button
                  key={type.value}
                  className={`filter-btn ${robotFilter === type.value ? 'active' : ''}`}
                  onClick={() => setRobotFilter(type.value)}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label>Status</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              {Object.entries(statusConfig).map(([key, config]) => (
                <button
                  key={key}
                  className={`filter-btn ${statusFilter === key ? 'active' : ''}`}
                  onClick={() => setStatusFilter(key)}
                >
                  <span>{config.icon}</span>
                  <span>{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Range */}
          <div className="filter-group">
            <label>Payment Range: {paymentRange[0]} - {paymentRange[1]} SOL</label>
            <div className="range-inputs">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={paymentRange[0]}
                onChange={(e) => setPaymentRange([parseFloat(e.target.value), paymentRange[1]])}
              />
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={paymentRange[1]}
                onChange={(e) => setPaymentRange([paymentRange[0], parseFloat(e.target.value)])}
              />
            </div>
          </div>

          {/* Distance Range */}
          <div className="filter-group">
            <label>Distance: {distanceRange[0]} - {distanceRange[1]} km</label>
            <div className="range-inputs">
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={distanceRange[0]}
                onChange={(e) => setDistanceRange([parseFloat(e.target.value), distanceRange[1]])}
              />
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={distanceRange[1]}
                onChange={(e) => setDistanceRange([distanceRange[0], parseFloat(e.target.value)])}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="payment_high">Highest Payment</option>
              <option value="payment_low">Lowest Payment</option>
              <option value="distance">Nearest First</option>
            </select>
          </div>
        </aside>

        {/* Tasks Grid */}
        <main className="tasks-grid-container">
          <div className="tasks-grid-header">
            <span className="results-count">
              Showing {filteredTasks.length} of {mockTasks.length} tasks
            </span>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="tasks-grid">
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    className={`task-card ${task.status}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedTask(task)}
                  >
                    {/* Card Header */}
                    <div className="task-card-header">
                      <span className={`task-status ${task.status}`}>
                        {statusConfig[task.status].icon} {statusConfig[task.status].label}
                      </span>
                      <span className={`task-priority ${task.priority}`}>
                        {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟠' : '🟢'} {task.priority}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="task-card-body">
                      <div className="task-robot-type">
                        <span className="robot-icon">
                          {robotTypes.find(r => r.value === task.robotType)?.icon}
                        </span>
                        <span>{robotTypes.find(r => r.value === task.robotType)?.label}</span>
                      </div>
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                    </div>

                    {/* Card Meta */}
                    <div className="task-card-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{task.location}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        <span>{task.duration}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📏</span>
                        <span>{task.distance} km</span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="task-card-footer">
                      <div className="task-payment">
                        <span className="payment-value">{task.payment} SOL</span>
                        <span className="payment-label">Payment</span>
                      </div>
                      <div className="task-poster">
                        <span className="poster-name">{task.poster}</span>
                        <span className="posted-time">{task.postedAt}</span>
                      </div>
                    </div>

                    {/* Take Task Button (only for open tasks) */}
                    {task.status === 'open' && (
                      <button 
                        className="take-task-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTakeTask(task);
                        }}
                      >
                        Take Task →
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="no-tasks">
              <span className="no-tasks-icon">🔍</span>
              <h3>No tasks found</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
            </div>
          )}
        </main>
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            className="task-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              className="task-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedTask(null)}>✕</button>
              
              <div className="modal-header">
                <div className="modal-badges">
                  <span className={`task-status ${selectedTask.status}`}>
                    {statusConfig[selectedTask.status].icon} {statusConfig[selectedTask.status].label}
                  </span>
                  <span className={`task-priority ${selectedTask.priority}`}>
                    {selectedTask.priority} priority
                  </span>
                </div>
                <div className="modal-robot-type">
                  <span className="robot-icon">
                    {robotTypes.find(r => r.value === selectedTask.robotType)?.icon}
                  </span>
                  <span>{robotTypes.find(r => r.value === selectedTask.robotType)?.label} Required</span>
                </div>
                <h2>{selectedTask.title}</h2>
                <p className="modal-id">Task ID: {selectedTask.id}</p>
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <h4>Description</h4>
                  <p>{selectedTask.description}</p>
                </div>

                <div className="modal-section">
                  <h4>Requirements</h4>
                  <div className="requirements-list">
                    {selectedTask.requirements.map((req, i) => (
                      <span key={i} className="requirement-tag">{req}</span>
                    ))}
                  </div>
                </div>

                <div className="modal-details">
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <div>
                      <span className="detail-label">Location</span>
                      <span className="detail-value">{selectedTask.location}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📏</span>
                    <div>
                      <span className="detail-label">Distance</span>
                      <span className="detail-value">{selectedTask.distance} km</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏱️</span>
                    <div>
                      <span className="detail-label">Duration</span>
                      <span className="detail-value">{selectedTask.duration}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <div>
                      <span className="detail-label">Payment</span>
                      <span className="detail-value highlight">{selectedTask.payment} SOL</span>
                    </div>
                  </div>
                </div>

                <div className="modal-poster">
                  <span>Posted by <strong>{selectedTask.poster}</strong></span>
                  <span>{selectedTask.postedAt}</span>
                </div>
              </div>

              <div className="modal-footer">
                {selectedTask.status === 'open' ? (
                  <button className="take-task-btn large" onClick={() => handleTakeTask(selectedTask)}>
                    🚀 Take This Task
                  </button>
                ) : selectedTask.status === 'in_progress' ? (
                  <button className="take-task-btn large disabled" disabled>
                    🟡 Task In Progress
                  </button>
                ) : (
                  <button className="take-task-btn large disabled" disabled>
                    ✅ Task Completed
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
