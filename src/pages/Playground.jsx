import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../components/UIComponents';
import { RobotIcon } from '../components/RobotIcons';
import './Playground.css';

// Common commands available for ALL robots
const commonCommands = {
  'charge': { duration: 1800000, label: 'Charge', desc: 'return to charging station' },
  'stop': { duration: 0, label: 'Stop', desc: 'emergency stop all operations' },
  'home': { duration: 300000, label: 'Home', desc: 'return to home position' },
  'sleep': { duration: 5000, label: 'Sleep', desc: 'enter low power mode' },
  'wake': { duration: 3000, label: 'Wake', desc: 'exit low power mode' },
};

// Robot configurations with specific commands
const robotConfigs = {
  drone: {
    id: 'TB-DRONE-4821',
    name: 'Aerial Drone',
    type: 'drone',
    // Specific robot.X() commands for this robot type
    commands: {
      'scan': { duration: 45000, label: 'Area Scan', desc: 'scanning 500m radius area' },
      'patrol': { duration: 7200000, label: 'Patrol Route', desc: 'execute patrol pattern' },
      'photo': { duration: 15000, label: 'Capture', desc: 'take aerial photograph' },
      'map': { duration: 3600000, label: 'Map Area', desc: 'generate 3D terrain map' },
      'inspect': { duration: 120000, label: 'Inspect', desc: 'infrastructure inspection' },
      'track': { duration: 300000, label: 'Track', desc: 'track moving target' },
      'survey': { duration: 1800000, label: 'Survey', desc: 'land survey operation' },
      'stream': { duration: 600000, label: 'Stream', desc: 'live video stream' },
    },
    // Drone-specific API commands
    uniqueCommands: {
      'fly.altitude': { desc: 'set flight altitude in meters' },
      'fly.hover': { desc: 'hover at current position' },
      'fly.circle': { desc: 'circle around target point' },
      'fly.land': { desc: 'initiate landing sequence' },
      'fly.takeoff': { desc: 'initiate takeoff sequence' },
      'radar.scan': { desc: 'activate radar scanning' },
      'thermal.scan': { desc: 'thermal imaging scan' },
      'wind.check': { desc: 'check wind conditions' },
    }
  },
  humanoid: {
    id: 'TB-HUMN-7842',
    name: 'Humanoid Worker',
    type: 'humanoid',
    commands: {
      'pickup': { duration: 30000, label: 'Pick Item', desc: 'acquire target object' },
      'deliver': { duration: 180000, label: 'Deliver', desc: 'transport payload' },
      'assemble': { duration: 3600000, label: 'Assembly', desc: 'perform assembly op' },
      'sort': { duration: 1800000, label: 'Sort', desc: 'sort inventory items' },
      'assist': { duration: 7200000, label: 'Assist', desc: 'customer assistance' },
      'pack': { duration: 120000, label: 'Pack', desc: 'package items' },
      'inspect': { duration: 90000, label: 'Inspect', desc: 'quality inspection' },
      'clean': { duration: 600000, label: 'Clean', desc: 'cleaning operation' },
    },
    uniqueCommands: {
      'arm.grab': { desc: 'grab object with arm' },
      'arm.release': { desc: 'release held object' },
      'arm.extend': { desc: 'extend arm forward' },
      'walk.to': { desc: 'walk to coordinates' },
      'walk.speed': { desc: 'set walking speed' },
      'gesture.wave': { desc: 'wave gesture' },
      'gesture.point': { desc: 'pointing gesture' },
      'voice.speak': { desc: 'text-to-speech output' },
    }
  },
  delivery: {
    id: 'TB-DLVR-3156',
    name: 'Delivery Bot',
    type: 'delivery',
    commands: {
      'load': { duration: 60000, label: 'Load', desc: 'secure package' },
      'deliver': { duration: 1800000, label: 'Deliver', desc: 'navigate to address' },
      'return': { duration: 1200000, label: 'Return', desc: 'return to dispatch' },
      'scan': { duration: 20000, label: 'Scan', desc: 'read barcode' },
      'notify': { duration: 5000, label: 'Notify', desc: 'alert recipient' },
      'wait': { duration: 300000, label: 'Wait', desc: 'wait for recipient' },
      'photo': { duration: 10000, label: 'Photo', desc: 'proof of delivery' },
      'unlock': { duration: 5000, label: 'Unlock', desc: 'open compartment' },
    },
    uniqueCommands: {
      'cargo.lock': { desc: 'lock cargo compartment' },
      'cargo.unlock': { desc: 'unlock cargo compartment' },
      'cargo.weight': { desc: 'check cargo weight' },
      'route.optimize': { desc: 'optimize delivery route' },
      'route.avoid': { desc: 'add route avoidance' },
      'horn.beep': { desc: 'sound horn' },
      'lights.flash': { desc: 'flash indicator lights' },
      'door.open': { desc: 'open delivery door' },
    }
  },
  industrial: {
    id: 'TB-INDS-9024',
    name: 'Industrial Arm',
    type: 'industrial',
    commands: {
      'weld': { duration: 300000, label: 'Weld', desc: 'precision welding' },
      'paint': { duration: 600000, label: 'Paint', desc: 'apply coating' },
      'lift': { duration: 45000, label: 'Lift', desc: 'heavy payload lift' },
      'calibrate': { duration: 180000, label: 'Calibrate', desc: 'precision calibration' },
      'cycle': { duration: 7200000, label: 'Cycle', desc: 'production cycle' },
      'cut': { duration: 240000, label: 'Cut', desc: 'precision cutting' },
      'drill': { duration: 180000, label: 'Drill', desc: 'drilling operation' },
      'grind': { duration: 300000, label: 'Grind', desc: 'surface grinding' },
      'maintain': { duration: 1800000, label: 'Maintain', desc: 'self-maintenance' },
    },
    uniqueCommands: {
      'joint.rotate': { desc: 'rotate specific joint' },
      'joint.lock': { desc: 'lock joint position' },
      'gripper.open': { desc: 'open gripper' },
      'gripper.close': { desc: 'close gripper' },
      'gripper.pressure': { desc: 'set grip pressure' },
      'laser.align': { desc: 'laser alignment' },
      'laser.measure': { desc: 'laser distance measure' },
      'tool.change': { desc: 'change tool head' },
    }
  }
};

const Playground = () => {
  const [selectedRobot, setSelectedRobot] = useState('humanoid');
  const [consoleLines, setConsoleLines] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const [robotState, setRobotState] = useState({
    state: 'idle',
    battery: 87,
    uptime: 3847,
    hasPayload: false,
    altitude: 0,
    speed: 0,
  });
  
  const [taskProgress, setTaskProgress] = useState({
    active: false,
    command: null,
    label: '',
    progress: 0,
    duration: 0,
    startTime: null,
  });
  
  const consoleOutputRef = useRef(null);
  const inputRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const config = robotConfigs[selectedRobot];

  // Initialize console
  useEffect(() => {
    setConsoleLines([
      { type: 'system', text: 'TaskBoard Control System v2.1.0' },
      { type: 'success', text: `[CONNECTED] ${config.id}` },
      { type: 'info', text: 'Type "help" for commands' },
    ]);
  }, []);

  // Battery simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRobotState(prev => {
        if (prev.state === 'charging') {
          return { ...prev, battery: Math.min(100, prev.battery + 0.5), uptime: prev.uptime + 1 };
        }
        return { 
          ...prev, 
          battery: Math.max(0, prev.battery - 0.03),
          uptime: prev.uptime + 1
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Progress animation
  useEffect(() => {
    if (taskProgress.active && taskProgress.startTime) {
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - taskProgress.startTime;
        const progress = Math.min((elapsed / taskProgress.duration) * 100, 100);
        
        if (progress >= 100) {
          clearInterval(progressIntervalRef.current);
          setTaskProgress(prev => ({ ...prev, active: false, progress: 100 }));
          setRobotState(prev => ({ 
            ...prev, 
            state: 'idle',
            battery: taskProgress.command === 'charge' ? 100 : Math.max(0, prev.battery - 3)
          }));
          addLine('success', '[COMPLETE] Task finished');
        } else {
          setTaskProgress(prev => ({ ...prev, progress }));
        }
      }, 100);
      
      return () => clearInterval(progressIntervalRef.current);
    }
  }, [taskProgress.active, taskProgress.startTime]);

  const addLine = (type, text) => {
    setConsoleLines(prev => [...prev, { type, text }]);
    setTimeout(() => {
      if (consoleOutputRef.current) {
        consoleOutputRef.current.scrollTop = consoleOutputRef.current.scrollHeight;
      }
    }, 10);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const printHelp = () => {
    addLine('info', '');
    addLine('success', '═══════════════════════════════════════════════════');
    addLine('success', '                 COMMAND REFERENCE                  ');
    addLine('success', '═══════════════════════════════════════════════════');
    addLine('info', '');
    addLine('success', 'SYSTEM COMMANDS:');
    addLine('info', '  help              (show this help message)');
    addLine('info', '  status            (display robot status report)');
    addLine('info', '  clear             (clear console output)');
    addLine('info', '  tasks             (list available tasks nearby)');
    addLine('info', '  ping              (test connection latency)');
    addLine('info', '  uptime            (show robot operational time)');
    addLine('info', '  version           (show firmware and SDK version)');
    addLine('info', '  reboot            (reboot robot systems)');
    addLine('info', '  shutdown          (shutdown robot)');
    addLine('info', '  diagnostics       (run full system diagnostics)');
    addLine('info', '  logs              (show recent activity logs)');
    addLine('info', '  battery           (detailed battery info)');
    addLine('info', '  network           (network connection info)');
    addLine('info', '');
    addLine('success', 'UNIVERSAL ROBOT COMMANDS (ALL TYPES):');
    Object.entries(commonCommands).forEach(([cmd, info]) => {
      addLine('info', `  robot.${cmd}()`.padEnd(24) + `(${info.desc})`);
    });
    addLine('info', '');
    addLine('success', '───────────────────────────────────────────────────');
    addLine('success', '                  DRONE COMMANDS                    ');
    addLine('success', '───────────────────────────────────────────────────');
    Object.entries(robotConfigs.drone.commands).forEach(([cmd, info]) => {
      addLine('info', `  robot.${cmd}()`.padEnd(24) + `(${info.desc})`);
    });
    addLine('info', '  API:');
    Object.entries(robotConfigs.drone.uniqueCommands).forEach(([cmd, info]) => {
      addLine('info', `    ${cmd}()`.padEnd(24) + `(${info.desc})`);
    });
    addLine('info', '');
    addLine('success', '───────────────────────────────────────────────────');
    addLine('success', '                HUMANOID COMMANDS                   ');
    addLine('success', '───────────────────────────────────────────────────');
    Object.entries(robotConfigs.humanoid.commands).forEach(([cmd, info]) => {
      addLine('info', `  robot.${cmd}()`.padEnd(24) + `(${info.desc})`);
    });
    addLine('info', '  API:');
    Object.entries(robotConfigs.humanoid.uniqueCommands).forEach(([cmd, info]) => {
      addLine('info', `    ${cmd}()`.padEnd(24) + `(${info.desc})`);
    });
    addLine('info', '');
    addLine('success', '───────────────────────────────────────────────────');
    addLine('success', '                DELIVERY COMMANDS                   ');
    addLine('success', '───────────────────────────────────────────────────');
    Object.entries(robotConfigs.delivery.commands).forEach(([cmd, info]) => {
      addLine('info', `  robot.${cmd}()`.padEnd(24) + `(${info.desc})`);
    });
    addLine('info', '  API:');
    Object.entries(robotConfigs.delivery.uniqueCommands).forEach(([cmd, info]) => {
      addLine('info', `    ${cmd}()`.padEnd(24) + `(${info.desc})`);
    });
    addLine('info', '');
    addLine('success', '───────────────────────────────────────────────────');
    addLine('success', '               INDUSTRIAL COMMANDS                  ');
    addLine('success', '───────────────────────────────────────────────────');
    Object.entries(robotConfigs.industrial.commands).forEach(([cmd, info]) => {
      addLine('info', `  robot.${cmd}()`.padEnd(24) + `(${info.desc})`);
    });
    addLine('info', '  API:');
    Object.entries(robotConfigs.industrial.uniqueCommands).forEach(([cmd, info]) => {
      addLine('info', `    ${cmd}()`.padEnd(24) + `(${info.desc})`);
    });
    addLine('info', '');
    addLine('success', '───────────────────────────────────────────────────');
    addLine('success', 'TELEMETRY (ALL ROBOTS):');
    addLine('info', '  telemetry.start()       (begin telemetry stream)');
    addLine('info', '  telemetry.stop()        (stop telemetry stream)');
    addLine('info', '  telemetry.export()      (export data to file)');
    addLine('info', '  sensors.read()          (read all sensor values)');
    addLine('info', '  sensors.calibrate()     (calibrate all sensors)');
    addLine('info', '  gps.location()          (get current GPS coords)');
    addLine('info', '  camera.snapshot()       (capture camera image)');
    addLine('info', '  camera.record()         (start video recording)');
    addLine('info', '');
    addLine('success', 'ROBOT SELECTION:');
    addLine('info', '  connect drone           (aerial surveillance unit)');
    addLine('info', '  connect humanoid        (bipedal worker robot)');
    addLine('info', '  connect delivery        (autonomous delivery bot)');
    addLine('info', '  connect industrial      (industrial robot arm)');
    addLine('info', '');
    addLine('warning', `  Current: ${config.name} (${config.id})`);
    addLine('info', '');
    addLine('success', '═══════════════════════════════════════════════════');
  };

  const startTask = (cmd, taskConfig) => {
    if (taskProgress.active) {
      addLine('error', '[ERROR] Task in progress. Use "stop" to cancel.');
      return;
    }
    
    if (robotState.battery < 5 && cmd !== 'charge') {
      addLine('error', '[ERROR] Battery critical. Charge required.');
      return;
    }

    setTaskProgress({
      active: true,
      command: cmd,
      label: taskConfig.label,
      progress: 0,
      duration: taskConfig.duration,
      startTime: Date.now(),
    });
    
    setRobotState(prev => ({
      ...prev,
      state: cmd === 'charge' ? 'charging' : 'working',
    }));
    
    addLine('success', `[EXECUTING] ${taskConfig.label}`);
    addLine('info', `> ${taskConfig.desc}`);
  };

  const stopTask = () => {
    if (!taskProgress.active) {
      addLine('warning', '[WARN] No active task to stop');
      return;
    }
    
    clearInterval(progressIntervalRef.current);
    setTaskProgress({ active: false, command: null, label: '', progress: 0, duration: 0, startTime: null });
    setRobotState(prev => ({ ...prev, state: 'idle' }));
    addLine('warning', '[STOPPED] Task cancelled by operator');
  };

  const connectRobot = (type) => {
    if (taskProgress.active) {
      addLine('error', '[ERROR] Stop current task before switching robot');
      return;
    }
    
    if (!robotConfigs[type]) {
      addLine('error', `[ERROR] Unknown robot type: ${type}`);
      addLine('info', 'Available: drone, humanoid, delivery, industrial');
      return;
    }
    
    setSelectedRobot(type);
    const newConfig = robotConfigs[type];
    addLine('info', 'Disconnecting from current robot...');
    addLine('success', `[CONNECTED] ${newConfig.id}`);
    addLine('info', `Robot type: ${newConfig.name}`);
  };

  // Handle unique commands based on robot type
  const handleUniqueCommand = (cmd) => {
    const cmdName = cmd.replace('()', '');
    
    // Check if command exists for current robot
    if (!config.uniqueCommands[cmdName]) {
      return false;
    }

    // Drone specific
    if (selectedRobot === 'drone') {
      if (cmdName === 'fly.altitude') {
        addLine('info', `Current altitude: ${robotState.altitude}m`);
        addLine('success', '[FLY] Altitude set to 50m');
        setRobotState(prev => ({ ...prev, altitude: 50 }));
        return true;
      }
      if (cmdName === 'fly.hover') {
        addLine('success', '[FLY] Hovering at current position');
        addLine('info', 'GPS lock maintained');
        return true;
      }
      if (cmdName === 'fly.circle') {
        addLine('success', '[FLY] Circling around target point');
        addLine('info', 'Radius: 25m, Speed: 5m/s');
        return true;
      }
      if (cmdName === 'fly.land') {
        addLine('warning', '[FLY] Initiating landing sequence...');
        addLine('info', 'Descending at 2m/s');
        setRobotState(prev => ({ ...prev, altitude: 0 }));
        return true;
      }
      if (cmdName === 'fly.takeoff') {
        addLine('success', '[FLY] Takeoff initiated');
        addLine('info', 'Ascending to 10m');
        setRobotState(prev => ({ ...prev, altitude: 10 }));
        return true;
      }
      if (cmdName === 'radar.scan') {
        addLine('info', '[RADAR] Scanning surroundings...');
        addLine('success', '[RADAR] 3 objects detected');
        addLine('info', '  - Building at 120m NE');
        addLine('info', '  - Vehicle at 45m S');
        addLine('info', '  - Tree at 80m W');
        return true;
      }
      if (cmdName === 'thermal.scan') {
        addLine('info', '[THERMAL] Scanning for heat signatures...');
        addLine('success', '[THERMAL] 2 heat sources detected');
        addLine('info', '  - Human signature at 30m');
        addLine('info', '  - Engine heat at 50m');
        return true;
      }
      if (cmdName === 'wind.check') {
        addLine('info', 'Wind conditions:');
        addLine('info', '  Speed: 12 km/h');
        addLine('info', '  Direction: NW');
        addLine('success', '[OK] Safe for flight');
        return true;
      }
    }

    // Humanoid specific
    if (selectedRobot === 'humanoid') {
      if (cmdName === 'arm.grab') {
        addLine('success', '[ARM] Grabbing object...');
        addLine('info', 'Grip pressure: 45%');
        setRobotState(prev => ({ ...prev, hasPayload: true }));
        return true;
      }
      if (cmdName === 'arm.release') {
        addLine('success', '[ARM] Releasing object');
        setRobotState(prev => ({ ...prev, hasPayload: false }));
        return true;
      }
      if (cmdName === 'arm.extend') {
        addLine('success', '[ARM] Extending arm forward');
        addLine('info', 'Extension: 80cm');
        return true;
      }
      if (cmdName === 'walk.to') {
        addLine('info', '[WALK] Enter coordinates or use "walk.to(x,y)"');
        addLine('success', '[WALK] Moving to waypoint');
        return true;
      }
      if (cmdName === 'walk.speed') {
        addLine('info', 'Current walking speed: 1.2 m/s');
        addLine('success', '[WALK] Speed set to normal');
        return true;
      }
      if (cmdName === 'gesture.wave') {
        addLine('success', '[GESTURE] Waving...');
        addLine('info', 'Friendly wave gesture executed');
        return true;
      }
      if (cmdName === 'gesture.point') {
        addLine('success', '[GESTURE] Pointing forward');
        return true;
      }
      if (cmdName === 'voice.speak') {
        addLine('success', '[VOICE] "Hello, how can I help you?"');
        addLine('info', 'TTS output complete');
        return true;
      }
    }

    // Delivery specific
    if (selectedRobot === 'delivery') {
      if (cmdName === 'cargo.lock') {
        addLine('success', '[CARGO] Compartment locked');
        addLine('info', 'Security seal activated');
        return true;
      }
      if (cmdName === 'cargo.unlock') {
        addLine('success', '[CARGO] Compartment unlocked');
        addLine('info', 'Ready for loading/unloading');
        return true;
      }
      if (cmdName === 'cargo.weight') {
        addLine('info', 'Cargo weight: 2.3 kg');
        addLine('info', 'Max capacity: 15 kg');
        addLine('success', '[OK] Within limits');
        return true;
      }
      if (cmdName === 'route.optimize') {
        addLine('info', '[ROUTE] Optimizing delivery path...');
        addLine('success', '[ROUTE] New route calculated');
        addLine('info', 'Saved 1.2km and 8 minutes');
        return true;
      }
      if (cmdName === 'route.avoid') {
        addLine('info', '[ROUTE] Enter area to avoid');
        addLine('success', '[ROUTE] Avoidance zone added');
        return true;
      }
      if (cmdName === 'horn.beep') {
        addLine('success', '[HORN] Beep!');
        return true;
      }
      if (cmdName === 'lights.flash') {
        addLine('success', '[LIGHTS] Flashing indicators');
        return true;
      }
      if (cmdName === 'door.open') {
        addLine('success', '[DOOR] Delivery door opened');
        return true;
      }
    }

    // Industrial specific
    if (selectedRobot === 'industrial') {
      if (cmdName === 'joint.rotate') {
        addLine('info', '[JOINT] Rotating joint 3...');
        addLine('success', '[JOINT] Rotation complete: +45 degrees');
        return true;
      }
      if (cmdName === 'joint.lock') {
        addLine('success', '[JOINT] All joints locked');
        addLine('info', 'Safety brake engaged');
        return true;
      }
      if (cmdName === 'gripper.open') {
        addLine('success', '[GRIPPER] Opening...');
        addLine('info', 'Gripper fully open');
        setRobotState(prev => ({ ...prev, hasPayload: false }));
        return true;
      }
      if (cmdName === 'gripper.close') {
        addLine('success', '[GRIPPER] Closing...');
        addLine('info', 'Object secured');
        setRobotState(prev => ({ ...prev, hasPayload: true }));
        return true;
      }
      if (cmdName === 'gripper.pressure') {
        addLine('info', 'Current grip pressure: 120N');
        addLine('success', '[GRIPPER] Pressure optimal');
        return true;
      }
      if (cmdName === 'laser.align') {
        addLine('info', '[LASER] Aligning...');
        addLine('success', '[LASER] Alignment complete');
        addLine('info', 'Accuracy: 0.01mm');
        return true;
      }
      if (cmdName === 'laser.measure') {
        addLine('info', '[LASER] Measuring distance...');
        addLine('success', '[LASER] Distance: 234.56mm');
        return true;
      }
      if (cmdName === 'tool.change') {
        addLine('warning', '[TOOL] Changing tool head...');
        addLine('info', 'Detaching current tool...');
        addLine('success', '[TOOL] New tool attached');
        return true;
      }
    }

    return false;
  };

  const handleCommand = (input) => {
    const cmd = input.trim().toLowerCase();
    addLine('command', `$ ${input}`);

    if (!cmd) return;

    // System commands
    if (cmd === 'help') { printHelp(); return; }
    if (cmd === 'clear') { setConsoleLines([]); return; }
    if (cmd === 'stop') { stopTask(); return; }
    
    if (cmd === 'status') {
      addLine('info', '');
      addLine('info', '┌─────────────────────────────────────┐');
      addLine('info', '│         ROBOT STATUS REPORT         │');
      addLine('info', '├─────────────────────────────────────┤');
      addLine('info', `│ ID:       ${config.id.padEnd(25)}│`);
      addLine('info', `│ Type:     ${config.name.padEnd(25)}│`);
      addLine('info', `│ State:    ${robotState.state.toUpperCase().padEnd(25)}│`);
      addLine('info', `│ Battery:  ${(Math.round(robotState.battery) + '%').padEnd(25)}│`);
      addLine('info', `│ Uptime:   ${(Math.floor(robotState.uptime / 3600) + 'h ' + Math.floor((robotState.uptime % 3600) / 60) + 'm').padEnd(25)}│`);
      addLine('info', `│ Payload:  ${(robotState.hasPayload ? 'LOADED' : 'EMPTY').padEnd(25)}│`);
      if (selectedRobot === 'drone') {
        addLine('info', `│ Altitude: ${(robotState.altitude + 'm').padEnd(25)}│`);
      }
      addLine('info', '└─────────────────────────────────────┘');
      return;
    }

    if (cmd === 'tasks') {
      addLine('info', '');
      addLine('info', '┌──────────────────────────────────────────┐');
      addLine('info', '│           AVAILABLE TASKS                │');
      addLine('info', '├────────────┬─────────────┬───────────────┤');
      addLine('info', '│ ID         │ TYPE        │ DISTANCE      │');
      addLine('info', '├────────────┼─────────────┼───────────────┤');
      addLine('info', '│ TSK-8821   │ Delivery    │ 2.3 km        │');
      addLine('info', '│ TSK-8822   │ Patrol      │ 0.5 km        │');
      addLine('info', '│ TSK-8823   │ Inspection  │ 4.1 km        │');
      addLine('info', '│ TSK-8824   │ Transport   │ 1.8 km        │');
      addLine('info', '│ TSK-8825   │ Survey      │ 3.2 km        │');
      addLine('info', '└────────────┴─────────────┴───────────────┘');
      return;
    }

    if (cmd === 'ping') {
      const latency = Math.floor(Math.random() * 30) + 10;
      addLine('info', 'Pinging robot...');
      addLine('success', `[PING] Response: ${latency}ms`);
      return;
    }

    if (cmd === 'uptime') {
      const hours = Math.floor(robotState.uptime / 3600);
      const minutes = Math.floor((robotState.uptime % 3600) / 60);
      const seconds = robotState.uptime % 60;
      addLine('info', `Uptime: ${hours}h ${minutes}m ${seconds}s`);
      return;
    }

    if (cmd === 'version') {
      addLine('info', 'Firmware: v2.1.0-stable');
      addLine('info', 'SDK: @taskboard/robot-sdk@2.1.0');
      addLine('info', 'Protocol: TaskBoard Protocol v3');
      addLine('info', `Hardware: ${config.name} Rev.B`);
      return;
    }

    if (cmd === 'reboot') {
      addLine('warning', '[REBOOT] Initiating system reboot...');
      addLine('info', 'Saving state...');
      addLine('info', 'Restarting services...');
      addLine('success', '[REBOOT] System restarted');
      return;
    }

    if (cmd === 'shutdown') {
      addLine('warning', '[SHUTDOWN] Initiating shutdown sequence...');
      addLine('info', 'Saving telemetry data...');
      addLine('info', 'Disconnecting from network...');
      addLine('success', '[SHUTDOWN] Robot is now offline');
      addLine('info', '(Simulated environment - robot still active)');
      return;
    }

    if (cmd === 'diagnostics') {
      addLine('info', 'Running system diagnostics...');
      addLine('success', '[OK] Motors: Operational');
      addLine('success', '[OK] Sensors: Calibrated');
      addLine('success', '[OK] Network: Connected (5G)');
      addLine('success', '[OK] Battery: Healthy (450 cycles)');
      addLine('success', '[OK] Storage: 2.4GB free');
      addLine('success', '[OK] GPS: Lock acquired');
      addLine('success', '[OK] Camera: Functional');
      addLine('info', 'All systems nominal.');
      return;
    }

    if (cmd === 'logs') {
      addLine('info', 'Recent activity:');
      addLine('info', '  [14:23:01] System initialized');
      addLine('info', '  [14:23:05] Connected to TaskBoard network');
      addLine('info', '  [14:23:08] Sensors calibrated');
      addLine('info', '  [14:23:12] GPS lock acquired');
      addLine('info', '  [14:23:15] Ready for commands');
      return;
    }

    if (cmd === 'battery') {
      addLine('info', 'Battery Status:');
      addLine('info', `  Level: ${Math.round(robotState.battery)}%`);
      addLine('info', `  State: ${robotState.state === 'charging' ? 'Charging' : 'Discharging'}`);
      addLine('info', '  Health: 98%');
      addLine('info', '  Cycles: 450');
      addLine('info', '  Voltage: 48.2V');
      addLine('info', '  Temperature: 32C');
      if (robotState.battery > 50) {
        addLine('success', '[OK] Battery healthy');
      } else if (robotState.battery > 20) {
        addLine('warning', '[WARN] Consider charging soon');
      } else {
        addLine('error', '[CRITICAL] Low battery!');
      }
      return;
    }

    if (cmd === 'network') {
      addLine('info', 'Network Status:');
      addLine('info', '  Connected: Yes');
      addLine('info', '  Type: 5G');
      addLine('info', '  Signal: 85%');
      addLine('info', '  IP: 192.168.1.42');
      addLine('info', '  TaskBoard: Connected');
      addLine('info', '  Latency: 23ms');
      addLine('success', '[OK] Network stable');
      return;
    }

    // Telemetry commands
    if (cmd === 'telemetry.start()') {
      addLine('success', '[TELEMETRY] Stream started');
      addLine('info', 'Data rate: 10Hz');
      addLine('info', 'Streaming to TaskBoard network...');
      return;
    }

    if (cmd === 'telemetry.stop()') {
      addLine('warning', '[TELEMETRY] Stream stopped');
      addLine('info', 'Data saved locally');
      return;
    }

    if (cmd === 'telemetry.export()') {
      addLine('info', '[EXPORT] Preparing telemetry data...');
      addLine('info', 'Compressing 2.3MB of data...');
      addLine('success', '[EXPORT] Data exported to /logs/telemetry.json');
      return;
    }

    if (cmd === 'sensors.read()') {
      addLine('info', 'Sensor readings:');
      addLine('info', `  Temperature: ${(40 + Math.random() * 5).toFixed(1)}C`);
      addLine('info', `  Humidity: ${Math.floor(30 + Math.random() * 20)}%`);
      addLine('info', '  Pressure: 1013 hPa');
      addLine('info', `  Accelerometer: [${(Math.random() * 0.1).toFixed(3)}, ${(Math.random() * 0.1).toFixed(3)}, 9.81]`);
      addLine('info', `  Gyroscope: [${(Math.random() * 0.01).toFixed(4)}, ${(Math.random() * 0.01).toFixed(4)}, ${(Math.random() * 0.01).toFixed(4)}]`);
      if (selectedRobot === 'drone') {
        addLine('info', `  Barometer: ${robotState.altitude}m`);
      }
      return;
    }

    if (cmd === 'sensors.calibrate()') {
      addLine('info', '[SENSORS] Calibrating...');
      addLine('info', '  Accelerometer: OK');
      addLine('info', '  Gyroscope: OK');
      addLine('info', '  Magnetometer: OK');
      addLine('success', '[SENSORS] Calibration complete');
      return;
    }

    if (cmd === 'gps.location()') {
      addLine('info', 'GPS Location:');
      addLine('info', `  Lat: 37.${Math.floor(7000 + Math.random() * 999)} N`);
      addLine('info', `  Lon: 122.${Math.floor(4000 + Math.random() * 999)} W`);
      addLine('info', `  Alt: ${(10 + Math.random() * 10).toFixed(1)}m`);
      addLine('info', '  Accuracy: 2.5m');
      addLine('info', '  Satellites: 12');
      return;
    }

    if (cmd === 'camera.snapshot()') {
      addLine('info', '[CAMERA] Capturing image...');
      addLine('success', '[CAMERA] Image saved to /captures/snapshot_001.jpg');
      addLine('info', 'Resolution: 4K (3840x2160)');
      return;
    }

    if (cmd === 'camera.record()') {
      addLine('info', '[CAMERA] Starting video recording...');
      addLine('success', '[CAMERA] Recording to /captures/video_001.mp4');
      addLine('info', 'Resolution: 1080p @ 30fps');
      return;
    }

    // Connect command
    if (cmd.startsWith('connect ')) {
      connectRobot(cmd.replace('connect ', '').trim());
      return;
    }

    // Robot commands
    const robotCmdMatch = cmd.match(/^robot\.(\w+)\(\)$/);
    if (robotCmdMatch) {
      const action = robotCmdMatch[1];
      
      // Check common commands first (available for all robots)
      if (commonCommands[action]) {
        if (action === 'stop') {
          stopTask();
          return;
        }
        if (action === 'sleep') {
          addLine('info', '[POWER] Entering sleep mode...');
          addLine('success', '[POWER] Robot in low power mode');
          setRobotState(prev => ({ ...prev, state: 'idle' }));
          return;
        }
        if (action === 'wake') {
          addLine('info', '[POWER] Waking up...');
          addLine('success', '[POWER] Robot active');
          return;
        }
        if (action === 'home') {
          addLine('info', '[NAV] Returning to home position...');
          startTask(action, commonCommands[action]);
          return;
        }
        // For charge and other common commands
        startTask(action, commonCommands[action]);
        return;
      }
      
      // Check robot-specific commands
      if (config.commands[action]) {
        startTask(action, config.commands[action]);
        return;
      }
      
      // Check if command exists for another robot type
      for (const [robotType, robotConfig] of Object.entries(robotConfigs)) {
        if (robotType !== selectedRobot && robotConfig.commands[action]) {
          addLine('error', `[ERROR] "robot.${action}()" is only available for ${robotConfig.name}`);
          addLine('info', `Current robot: ${config.name}`);
          addLine('info', `Use "connect ${robotType}" to switch`);
          return;
        }
      }
    }

    // Unique commands for current robot type
    const uniqueCmdMatch = cmd.match(/^(\w+\.\w+)\(\)$/);
    if (uniqueCmdMatch) {
      if (handleUniqueCommand(cmd)) {
        return;
      }
      // Check if command exists for another robot type
      const cmdName = uniqueCmdMatch[1];
      for (const [robotType, robotConfig] of Object.entries(robotConfigs)) {
        if (robotType !== selectedRobot && robotConfig.uniqueCommands[cmdName]) {
          addLine('error', `[ERROR] "${cmdName}()" is only available for ${robotConfig.name}`);
          addLine('info', `Current robot: ${config.name}`);
          return;
        }
      }
    }

    addLine('error', `[ERROR] Unknown command: ${input}`);
    addLine('info', 'Type "help" for available commands.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleCommand(inputValue);
    setInputValue('');
  };

  const getStateColor = () => {
    switch (robotState.state) {
      case 'idle': return 'var(--terminal-green)';
      case 'working': return 'var(--terminal-yellow)';
      case 'charging': return 'var(--terminal-blue)';
      default: return 'var(--text-secondary)';
    }
  };

  const getBatteryColor = () => {
    if (robotState.battery > 50) return 'var(--terminal-green)';
    if (robotState.battery > 20) return 'var(--terminal-yellow)';
    return '#ff4d4d';
  };

  return (
    <div className="playground-page">
      <section className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge>Control Interface</Badge>
          <h1 className="page-title">Robot Playground</h1>
          <p className="page-description">
            Robot operator control interface. Manage and monitor your robot fleet.
          </p>
        </motion.div>
      </section>

      <div className="playground-container">
        {/* Left Panel - Status UI */}
        <motion.div 
          className="status-panel"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          {/* Robot Identity */}
          <motion.div 
            className="robot-identity"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="robot-avatar"
              animate={{ 
                boxShadow: robotState.state === 'working' 
                  ? ['0 0 20px var(--accent-primary)', '0 0 40px var(--accent-primary)', '0 0 20px var(--accent-primary)']
                  : '0 0 20px transparent'
              }}
              transition={{ duration: 1.5, repeat: robotState.state === 'working' ? Infinity : 0 }}
            >
              <RobotIcon type={selectedRobot} size={80} />
            </motion.div>
            <div className="robot-info">
              <h3>{config.name}</h3>
              <span className="robot-id">{config.id}</span>
            </div>
          </motion.div>

          {/* Status Indicator */}
          <motion.div 
            className="status-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="status-label">Status</div>
            <div className="status-indicator">
              <motion.span 
                className="status-dot"
                animate={{ 
                  scale: [1, 1.2, 1],
                  backgroundColor: getStateColor()
                }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ backgroundColor: getStateColor() }}
              />
              <span className="status-text" style={{ color: getStateColor() }}>
                {robotState.state.toUpperCase()}
              </span>
            </div>
          </motion.div>

          {/* Battery */}
          <motion.div 
            className="battery-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="battery-header">
              <span className="battery-label">Power</span>
              <span className="battery-percent" style={{ color: getBatteryColor() }}>
                {Math.round(robotState.battery)}%
              </span>
            </div>
            <div className="battery-track">
              <motion.div 
                className="battery-fill"
                animate={{ width: `${robotState.battery}%` }}
                style={{ backgroundColor: getBatteryColor() }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Task Progress */}
          <AnimatePresence>
            {taskProgress.active && (
              <motion.div 
                className="task-block"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="task-header">
                  <span className="task-label">Current Task</span>
                  <span className="task-name">{taskProgress.label}</span>
                </div>
                <div className="task-progress-track">
                  <motion.div 
                    className="task-progress-fill"
                    animate={{ width: `${taskProgress.progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="task-stats">
                  <span>{Math.round(taskProgress.progress)}%</span>
                  <span>ETA: {formatTime(taskProgress.duration - (taskProgress.duration * taskProgress.progress / 100))}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions */}
          <motion.div 
            className="quick-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="actions-label">Quick Actions</div>
            <div className="actions-grid">
              {Object.entries(config.commands).slice(0, 4).map(([cmd, info], idx) => (
                <motion.button
                  key={cmd}
                  className={`action-btn ${taskProgress.active ? 'disabled' : ''}`}
                  onClick={() => !taskProgress.active && handleCommand(`robot.${cmd}()`)}
                  disabled={taskProgress.active}
                  whileHover={{ scale: taskProgress.active ? 1 : 1.05 }}
                  whileTap={{ scale: taskProgress.active ? 1 : 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                >
                  {info.label}
                </motion.button>
              ))}
              <motion.button
                className={`action-btn stop ${!taskProgress.active ? 'disabled' : ''}`}
                onClick={() => taskProgress.active && stopTask()}
                disabled={!taskProgress.active}
                whileHover={{ scale: !taskProgress.active ? 1 : 1.05 }}
                whileTap={{ scale: !taskProgress.active ? 1 : 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                STOP
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Panel - Console */}
        <motion.div 
          className="console-panel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        >
          <div className="console-header">
            <div className="console-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="console-title">taskboard-cli</span>
          </div>
          
          <div className="console-body" onClick={() => inputRef.current?.focus()}>
            <div className="console-output" ref={consoleOutputRef}>
              {consoleLines.map((line, idx) => (
                <motion.div 
                  key={idx} 
                  className={`console-line ${line.type}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {line.text}
                </motion.div>
              ))}
            </div>
            
            <form onSubmit={handleSubmit} className="console-input-row">
              <span className="prompt">$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="console-input"
                spellCheck={false}
                autoComplete="off"
              />
              <motion.span 
                className="cursor-blink"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Playground;
