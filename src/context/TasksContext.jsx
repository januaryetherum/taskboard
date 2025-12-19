import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useWalletContext } from './WalletContext';

const TasksContext = createContext();

// Constants
const TASK_TIMEOUT_HOURS = 24; // Task auto-releases after 24 hours
const DAILY_TASK_LIMIT = 5;    // Max tasks per user per day
const MIN_WORKFLOW_BLOCKS = 2; // Minimum blocks to complete task

export const TasksProvider = ({ children }) => {
  const { walletAddress, shortAddress, isAuthenticated } = useWalletContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState(null);

  // Subscribe to Firestore tasks collection (real-time updates)
  useEffect(() => {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to milliseconds
        createdAt: doc.data().createdAt?.toMillis() || Date.now(),
        takenAt: doc.data().takenAt?.toMillis() || null,
        completedAt: doc.data().completedAt?.toMillis() || null,
      }));
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check and release timed out tasks
  useEffect(() => {
    const checkTimeouts = async () => {
      const now = Date.now();
      const timeoutMs = TASK_TIMEOUT_HOURS * 60 * 60 * 1000;

      for (const task of tasks) {
        if (task.status === 'in_progress' && task.takenAt) {
          const elapsed = now - task.takenAt;
          if (elapsed > timeoutMs) {
            // Auto-release task
            try {
              const taskRef = doc(db, 'tasks', task.id);
              await updateDoc(taskRef, {
                status: 'open',
                takenBy: null,
                takenByWallet: null,
                takenAt: null,
                workflow: null,
                timeoutReleased: true,
              });
              console.log(`Task ${task.id} auto-released due to timeout`);
            } catch (error) {
              console.error('Error releasing timed out task:', error);
            }
          }
        }
      }
    };

    // Check timeouts every 5 minutes
    const interval = setInterval(checkTimeouts, 5 * 60 * 1000);
    // Also check on initial load
    if (tasks.length > 0) {
      checkTimeouts();
    }

    return () => clearInterval(interval);
  }, [tasks]);

  // Check daily task limit for user
  const checkDailyLimit = async () => {
    if (!walletAddress) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    const tasksRef = collection(db, 'tasks');
    const q = query(
      tasksRef,
      where('createdByWallet', '==', walletAddress),
      where('createdAt', '>=', todayTimestamp)
    );

    const snapshot = await getDocs(q);
    return snapshot.size < DAILY_TASK_LIMIT;
  };

  // Get remaining tasks for today
  const getRemainingTasksToday = () => {
    if (!walletAddress) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const todayTasks = tasks.filter(
      t => t.createdByWallet === walletAddress && t.createdAt >= todayMs
    );

    return Math.max(0, DAILY_TASK_LIMIT - todayTasks.length);
  };

  // Create new task
  const createTask = async (taskData) => {
    if (!isAuthenticated || !walletAddress) {
      throw new Error('Must connect wallet to create tasks');
    }

    // Check daily limit
    const canCreate = await checkDailyLimit();
    if (!canCreate) {
      throw new Error(`Daily limit reached. You can create max ${DAILY_TASK_LIMIT} tasks per day.`);
    }

    try {
      const tasksRef = collection(db, 'tasks');
      await addDoc(tasksRef, {
        ...taskData,
        status: 'open',
        createdBy: shortAddress,
        createdByWallet: walletAddress,
        createdAt: serverTimestamp(),
        takenBy: null,
        takenByWallet: null,
        takenAt: null,
        completedAt: null,
        workflow: null,
      });
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  // Take a task
  const takeTask = async (taskId) => {
    if (!isAuthenticated || !walletAddress) {
      throw new Error('Must connect wallet to take tasks');
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'in_progress',
        takenBy: shortAddress,
        takenByWallet: walletAddress,
        takenAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error taking task:', error);
      throw error;
    }
  };

  // Start working on task in Playground
  const startWorkingOnTask = (taskId) => {
    setActiveTaskId(taskId);
  };

  // Save workflow solution to task
  const saveWorkflowToTask = async (taskId, workflow) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        workflow: workflow,
      });
    } catch (error) {
      console.error('Error saving workflow:', error);
      throw error;
    }
  };

  // Validate workflow before completion
  const validateWorkflow = (workflow) => {
    if (!workflow) return false;
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) return false;
    return workflow.nodes.length >= MIN_WORKFLOW_BLOCKS;
  };

  // Complete task with workflow
  const completeTask = async (taskId, workflow) => {
    if (!isAuthenticated || !walletAddress) {
      throw new Error('Must connect wallet to complete tasks');
    }

    // Validate workflow
    if (!validateWorkflow(workflow)) {
      throw new Error(`Workflow must have at least ${MIN_WORKFLOW_BLOCKS} blocks to complete the task`);
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.takenByWallet !== walletAddress) {
      throw new Error('You can only complete tasks you have taken');
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        workflow: workflow,
      });
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  // Cancel task (return to open)
  const cancelTask = async (taskId) => {
    if (!isAuthenticated || !walletAddress) {
      throw new Error('Must connect wallet to cancel tasks');
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.takenByWallet !== walletAddress) {
      throw new Error('You can only cancel tasks you have taken');
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'open',
        takenBy: null,
        takenByWallet: null,
        takenAt: null,
        workflow: null,
      });
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
    } catch (error) {
      console.error('Error canceling task:', error);
      throw error;
    }
  };

  // Delete task (only creator can delete open tasks)
  const deleteTask = async (taskId) => {
    if (!isAuthenticated || !walletAddress) {
      throw new Error('Must connect wallet to delete tasks');
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.createdByWallet !== walletAddress) {
      throw new Error('You can only delete tasks you created');
    }

    if (task.status !== 'open') {
      throw new Error('Can only delete open tasks');
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  // Get task by ID
  const getTask = (taskId) => {
    return tasks.find(t => t.id === taskId);
  };

  // Get active task
  const getActiveTask = () => {
    return activeTaskId ? tasks.find(t => t.id === activeTaskId) : null;
  };

  // Check if current user is task creator
  const isTaskCreator = (task) => {
    return walletAddress && task.createdByWallet === walletAddress;
  };

  // Check if current user is task taker
  const isTaskTaker = (task) => {
    return walletAddress && task.takenByWallet === walletAddress;
  };

  // Get time remaining before task timeout
  const getTimeRemaining = (task) => {
    if (task.status !== 'in_progress' || !task.takenAt) return null;
    
    const timeoutMs = TASK_TIMEOUT_HOURS * 60 * 60 * 1000;
    const elapsed = Date.now() - task.takenAt;
    const remaining = timeoutMs - elapsed;
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      loading,
      activeTaskId,
      createTask,
      takeTask,
      startWorkingOnTask,
      saveWorkflowToTask,
      completeTask,
      cancelTask,
      deleteTask,
      getTask,
      getActiveTask,
      isTaskCreator,
      isTaskTaker,
      getTimeRemaining,
      getRemainingTasksToday,
      validateWorkflow,
      TASK_TIMEOUT_HOURS,
      DAILY_TASK_LIMIT,
      MIN_WORKFLOW_BLOCKS,
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within TasksProvider');
  }
  return context;
};

export default TasksContext;
