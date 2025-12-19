import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useTasks } from '../context/TasksContext';
import { useWalletContext } from '../context/WalletContext';
import { Badge } from '../components/UIComponents';
import WorkflowViewer from '../components/WorkflowViewer';
import './Marketplace.css';

// Robot type config with images
const robotConfig = {
  drone: { image: '/robot-drone.png', color: '#3b82f6', label: 'Drone' },
  humanoid: { image: '/robot-humanoid.png', color: '#8b5cf6', label: 'Humanoid' },
  delivery: { image: '/robot-delivery.png', color: '#f59e0b', label: 'Delivery Bot' },
  industrial: { image: '/robot-industrial.png', color: '#ef4444', label: 'Industrial Arm' },
};

// Status config
const statusConfig = {
  open: { label: 'Open', color: '#10b981', icon: '🟢' },
  in_progress: { label: 'In Progress', color: '#f59e0b', icon: '🟡' },
  completed: { label: 'Completed', color: '#3b82f6', icon: '✅' },
};

// Format time ago
const timeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const Marketplace = () => {
  const navigate = useNavigate();
  const { setVisible } = useWalletModal();
  const { isAuthenticated, walletAddress, shortAddress, walletName, walletIcon, disconnect } = useWalletContext();
  const { 
    tasks, 
    loading,
    createTask, 
    takeTask, 
    startWorkingOnTask,
    completeTask,
    cancelTask,
    deleteTask,
    isTaskCreator,
    isTaskTaker,
    getTimeRemaining,
    getRemainingTasksToday,
    DAILY_TASK_LIMIT,
  } = useTasks();

  // UI State
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed' | 'my'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(null);
  const [error, setError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    robotType: '',
    search: '',
  });

  // Open wallet modal
  const connectWallet = () => {
    setVisible(true);
  };

  // Get filtered tasks based on tab and filters
  const getDisplayTasks = () => {
    let filtered = [...tasks];

    // Tab filter
    if (activeTab === 'active') {
      filtered = filtered.filter(t => t.status === 'open' || t.status === 'in_progress');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(t => t.status === 'completed');
    } else if (activeTab === 'my') {
      filtered = filtered.filter(t => isTaskCreator(t) || isTaskTaker(t));
    }

    // Robot type filter
    if (filters.robotType) {
      filtered = filtered.filter(t => t.robotType === filters.robotType);
    }

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.location.toLowerCase().includes(search)
      );
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  };

  const displayTasks = getDisplayTasks();

  // Stats
  const stats = {
    open: tasks.filter(t => t.status === 'open').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    myActive: tasks.filter(t => isTaskTaker(t) && t.status === 'in_progress').length,
  };

  // Handle take task
  const handleTakeTask = async (task) => {
    try {
      await takeTask(task.id);
      setShowTaskModal(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle start working (go to Playground)
  const handleStartWorking = (task) => {
    startWorkingOnTask(task.id);
    navigate('/playground');
  };

  // Handle view workflow
  const handleViewWorkflow = (task) => {
    setShowWorkflowModal(task);
    setShowTaskModal(null);
  };

  return (
    <div className="marketplace-page">
      {/* Header */}
      <section className="marketplace-header">
        <Badge>Task Marketplace</Badge>
        <h1>Marketplace</h1>
        <p>Browse available tasks, take jobs, and complete them</p>
        
        {/* Wallet Section */}
        <div className="auth-section">
          {isAuthenticated ? (
            <div className="wallet-profile">
              <span className="wallet-address">{shortAddress}</span>
              
              <div className="wallet-name-block">
                {walletIcon && (
                  <img 
                    src={walletIcon} 
                    alt={walletName} 
                    className="wallet-icon"
                  />
                )}
                <span className="wallet-name">{walletName}</span>
                <span className="tasks-remaining">
                  {getRemainingTasksToday()} tasks left today
                </span>
              </div>
              
              <button className="disconnect-btn" onClick={disconnect}>
                Disconnect
              </button>
            </div>
          ) : (
            <button className="connect-wallet-btn" onClick={connectWallet}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M22 10H18C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14H22"/>
                <circle cx="18" cy="12" r="1" fill="currentColor"/>
              </svg>
              Connect Wallet
            </button>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-box">
          <span className="stat-number">{stats.open}</span>
          <span className="stat-label">Open Tasks</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{stats.inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-box highlight">
          <span className="stat-number">{stats.myActive}</span>
          <span className="stat-label">My Active</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="marketplace-content">
        {/* Sidebar - Filters */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>🔍 Filters</h3>
            <button 
              className="clear-filters"
              onClick={() => setFilters({ robotType: '', search: '' })}
            >
              Clear
            </button>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>

          <div className="filter-group">
            <label>Robot Type</label>
            <select
              value={filters.robotType}
              onChange={(e) => setFilters(f => ({ ...f, robotType: e.target.value }))}
            >
              <option value="">All Types</option>
              <option value="drone">🚁 Drone</option>
              <option value="humanoid">🤖 Humanoid</option>
              <option value="delivery">📦 Delivery Bot</option>
              <option value="industrial">🦾 Industrial Arm</option>
            </select>
          </div>

          <button 
            className="create-task-btn"
            onClick={() => {
              if (!isAuthenticated) {
                setError('Please connect wallet to create tasks');
                return;
              }
              if (getRemainingTasksToday() <= 0) {
                setError(`Daily limit reached. Max ${DAILY_TASK_LIMIT} tasks per day.`);
                return;
              }
              setShowCreateModal(true);
            }}
            disabled={!isAuthenticated}
          >
            ➕ Create New Task
          </button>
          {isAuthenticated && (
            <div className="daily-limit-info">
              📊 {getRemainingTasksToday()}/{DAILY_TASK_LIMIT} tasks remaining today
            </div>
          )}
        </aside>

        {/* Main - Tasks List */}
        <main className="tasks-main">
          {/* Tabs */}
          <div className="tasks-tabs">
            <button 
              className={`tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              🟢 Active ({stats.open + stats.inProgress})
            </button>
            <button 
              className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              ✅ Completed ({stats.completed})
            </button>
            <button 
              className={`tab ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => setActiveTab('my')}
            >
              👤 My Tasks
            </button>
          </div>

          {/* Tasks Grid */}
          <div className="tasks-grid">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading tasks...</p>
              </div>
            ) : (
            <AnimatePresence mode="popLayout">
              {displayTasks.length > 0 ? (
                displayTasks.map(task => (
                  <motion.div
                    key={task.id}
                    className="task-card"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setShowTaskModal(task)}
                  >
                    {/* Header */}
                    <div className="task-card-header">
                      <img 
                        src={robotConfig[task.robotType]?.image || '/robot-drone.png'}
                        alt={robotConfig[task.robotType]?.label || 'Robot'}
                        className="robot-image"
                      />
                      <span 
                        className="status-badge"
                        style={{ color: statusConfig[task.status]?.color || '#10b981' }}
                      >
                        {statusConfig[task.status]?.icon} {statusConfig[task.status]?.label}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description}</p>

                    {/* Meta */}
                    <div className="task-meta">
                      <span>📍 {task.location}</span>
                      {task.distance && <span>📏 {task.distance}</span>}
                    </div>

                    {/* Footer */}
                    <div className="task-card-footer">
                      <div className="task-people">
                        <span className="creator">by {task.createdBy}</span>
                        {task.takenBy && (
                          <span className="taker">→ {task.takenBy}</span>
                        )}
                      </div>
                      <span className="time-ago">{timeAgo(task.createdAt)}</span>
                    </div>

                    {/* Time remaining for in_progress tasks */}
                    {task.status === 'in_progress' && (
                      <div className="time-remaining">
                        ⏱️ {getTimeRemaining(task)} remaining
                      </div>
                    )}

                    {/* Workflow indicator */}
                    {task.workflow && (
                      <div className="workflow-indicator">
                        📊 Workflow attached
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="no-tasks">
                  <span>📭</span>
                  <p>No tasks found</p>
                  <button onClick={() => setShowCreateModal(true)}>
                    Create First Task
                  </button>
                </div>
              )}
            </AnimatePresence>
            )}
          </div>
        </main>
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateTaskModal
            onClose={() => setShowCreateModal(false)}
            onCreate={async (data) => {
              try {
                await createTask(data);
                setShowCreateModal(false);
                setError(null);
              } catch (err) {
                setError(err.message);
              }
            }}
            remainingTasks={getRemainingTasksToday()}
            dailyLimit={DAILY_TASK_LIMIT}
          />
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <TaskDetailModal
            task={showTaskModal}
            isAuthenticated={isAuthenticated}
            isCreator={isTaskCreator(showTaskModal)}
            isTaker={isTaskTaker(showTaskModal)}
            timeRemaining={getTimeRemaining(showTaskModal)}
            onClose={() => setShowTaskModal(null)}
            onTake={async () => {
              try {
                await handleTakeTask(showTaskModal);
              } catch (err) {
                setError(err.message);
              }
            }}
            onStartWorking={() => handleStartWorking(showTaskModal)}
            onComplete={async () => {
              try {
                await completeTask(showTaskModal.id, showTaskModal.workflow);
                setShowTaskModal(null);
                setError(null);
              } catch (err) {
                setError(err.message);
              }
            }}
            onCancel={async () => {
              try {
                await cancelTask(showTaskModal.id);
                setShowTaskModal(null);
                setError(null);
              } catch (err) {
                setError(err.message);
              }
            }}
            onDelete={async () => {
              try {
                await deleteTask(showTaskModal.id);
                setShowTaskModal(null);
                setError(null);
              } catch (err) {
                setError(err.message);
              }
            }}
            onViewWorkflow={() => handleViewWorkflow(showTaskModal)}
          />
        )}
      </AnimatePresence>

      {/* Workflow View Modal */}
      <AnimatePresence>
        {showWorkflowModal && (
          <WorkflowViewer
            workflow={showWorkflowModal.workflow}
            task={showWorkflowModal}
            onClose={() => setShowWorkflowModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============ CREATE TASK MODAL ============
const CreateTaskModal = ({ onClose, onCreate, remainingTasks, dailyLimit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    robotType: 'drone',
    distance: '',
    location: '',
  });
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }
    if (!confirmed) {
      alert('Please confirm that you understand this task cannot be deleted once taken');
      return;
    }
    onCreate(formData);
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content create-modal"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>➕ Create New Task</h2>
          <span className="daily-limit-badge">
            {remainingTasks}/{dailyLimit} left today
          </span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Warehouse Security Patrol"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe what needs to be done..."
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Robot Type *</label>
              <select
                value={formData.robotType}
                onChange={e => setFormData(f => ({ ...f, robotType: e.target.value }))}
              >
                <option value="drone">🚁 Drone</option>
                <option value="humanoid">🤖 Humanoid</option>
                <option value="delivery">📦 Delivery Bot</option>
                <option value="industrial">🦾 Industrial Arm</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g., Warehouse Zone A"
                required
              />
            </div>

            <div className="form-group">
              <label>Distance</label>
              <input
                type="text"
                value={formData.distance}
                onChange={e => setFormData(f => ({ ...f, distance: e.target.value }))}
                placeholder="e.g., 2.5 km"
              />
            </div>
          </div>

          <div className="form-confirmation">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="confirmation-text">
                I understand that once someone takes this task, it cannot be deleted and will remain in the system permanently
              </span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ============ TASK DETAIL MODAL ============
const TaskDetailModal = ({ 
  task, 
  isAuthenticated,
  isCreator,
  isTaker,
  timeRemaining,
  onClose, 
  onTake, 
  onStartWorking, 
  onComplete,
  onCancel,
  onDelete,
  onViewWorkflow 
}) => {
  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content detail-modal"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="header-left">
            <img 
              src={robotConfig[task.robotType]?.image || '/robot-drone.png'}
              alt={robotConfig[task.robotType]?.label || 'Robot'}
              className="robot-image large"
            />
            <div>
              <h2>{task.title}</h2>
              <span 
                className="status-badge"
                style={{ color: statusConfig[task.status]?.color }}
              >
                {statusConfig[task.status]?.icon} {statusConfig[task.status]?.label}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h4>📝 Description</h4>
            <p>{task.description}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">📍 Location</span>
              <span className="value">{task.location}</span>
            </div>
            <div className="detail-item">
              <span className="label">📏 Distance</span>
              <span className="value">{task.distance || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <span className="label">🤖 Robot Type</span>
              <span className="value">{robotConfig[task.robotType]?.label}</span>
            </div>
            {timeRemaining && task.status === 'in_progress' && (
              <div className="detail-item">
                <span className="label">⏱️ Time Remaining</span>
                <span className="value timeout-warning">{timeRemaining}</span>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h4>👥 People</h4>
            <div className="people-info">
              <div className="person">
                <span className="role">Created by</span>
                <span className="name">{task.createdBy}</span>
                <span className="time">{timeAgo(task.createdAt)}</span>
              </div>
              {task.takenBy && (
                <div className="person">
                  <span className="role">Taken by</span>
                  <span className="name">{task.takenBy}</span>
                  <span className="time">{task.takenAt ? timeAgo(task.takenAt) : ''}</span>
                </div>
              )}
              {task.completedAt && (
                <div className="person">
                  <span className="role">Completed</span>
                  <span className="time">{timeAgo(task.completedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {task.workflow && (
            <div className="detail-section">
              <h4>📊 Workflow Solution</h4>
              <div className="workflow-preview">
                <p>{task.workflow.nodes?.length || 0} blocks, {task.workflow.edges?.length || 0} connections</p>
                <button className="btn-secondary" onClick={onViewWorkflow}>
                  View Workflow
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          {/* Not logged in message */}
          {!isAuthenticated && task.status === 'open' && (
            <div className="login-required">
              🔐 Connect wallet to take this task
            </div>
          )}

          {/* Open task - can be taken (if logged in and not creator) */}
          {task.status === 'open' && isAuthenticated && !isCreator && (
            <button className="btn-primary" onClick={onTake}>
              🎯 Take This Task
            </button>
          )}

          {/* Creator can delete open task */}
          {task.status === 'open' && isCreator && (
            <button className="btn-danger" onClick={onDelete}>
              🗑️ Delete Task
            </button>
          )}

          {/* In progress - taker can work or cancel */}
          {task.status === 'in_progress' && isTaker && (
            <>
              <button className="btn-primary" onClick={onStartWorking}>
                🔧 Open in Playground
              </button>
              <button className="btn-success" onClick={onComplete}>
                ✅ Mark Complete
              </button>
              <button className="btn-secondary" onClick={onCancel}>
                ❌ Cancel
              </button>
            </>
          )}

          {/* Completed - view workflow */}
          {task.status === 'completed' && task.workflow && (
            <button className="btn-primary" onClick={onViewWorkflow}>
              📊 View Solution
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Marketplace;
