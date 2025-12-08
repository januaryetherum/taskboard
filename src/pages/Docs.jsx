import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../components/UIComponents';
import Icon from '../components/Icons';
import './Docs.css';

const libraryDocs = {
  installation: {
    title: 'Installation',
    icon: 'overview',
    sections: [
      {
        title: 'NPM Installation',
        code: `# Install the TaskBoard Robot SDK
npm install @taskboard/robot-sdk

# Or using yarn
yarn add @taskboard/robot-sdk

# Or using pnpm
pnpm add @taskboard/robot-sdk`,
        language: 'bash'
      },
      {
        title: 'Rust Installation (for embedded systems)',
        code: `# Add to Cargo.toml
[dependencies]
taskboard-sdk = "2.1.0"
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }`,
        language: 'toml'
      },
      {
        title: 'Python Installation',
        code: `# Install via pip
pip install taskboard-robot-sdk

# Or with conda
conda install -c taskboard robot-sdk`,
        language: 'bash'
      }
    ]
  },
  initialization: {
    title: 'Initialization',
    icon: 'architecture',
    sections: [
      {
        title: 'Basic Setup',
        description: 'Initialize the TaskBoard client with your robot credentials',
        code: `import { TaskBoardClient } from '@taskboard/robot-sdk';

// Initialize the client
const client = new TaskBoardClient({
  cluster: 'mainnet-beta',      // or 'devnet' for testing
  wallet: operatorWallet,        // Solana wallet keypair
  robotId: 'robot_abc123',       // Your registered robot ID
  apiKey: process.env.TB_API_KEY // Optional: for enhanced features
});

// Verify connection
await client.connect();
console.log('Connected to TaskBoard network');`,
        language: 'javascript'
      },
      {
        title: 'Configuration Options',
        code: `const config = {
  cluster: 'mainnet-beta',
  wallet: operatorWallet,
  robotId: 'robot_abc123',
  
  // Optional settings
  options: {
    autoReconnect: true,         // Auto-reconnect on disconnect
    heartbeatInterval: 30000,    // Status ping interval (ms)
    maxRetries: 5,               // Max connection retries
    timeout: 10000,              // Request timeout (ms)
    logLevel: 'info'             // 'debug' | 'info' | 'warn' | 'error'
  }
};

const client = new TaskBoardClient(config);`,
        language: 'javascript'
      }
    ]
  },
  connection: {
    title: 'Robot Connection',
    icon: 'lifecycle',
    sections: [
      {
        title: 'connect(robotType)',
        description: 'Connect to a specific robot type in your fleet',
        code: `// Available robot types
// - drone      : Aerial Drone (TB-DRONE-xxxx)
// - humanoid   : Humanoid Worker (TB-HUMN-xxxx)
// - delivery   : Delivery Bot (TB-DLVR-xxxx)
// - industrial : Industrial Arm (TB-INDS-xxxx)

// Connect to a drone
await client.connect('drone');
// [CONNECTED] TB-DRONE-4821

// Switch to delivery bot
await client.connect('delivery');
// [CONNECTED] TB-DLVR-3156

// Connect with options
await client.connect('humanoid', {
  autoSync: true,
  priority: 'high'
});`,
        language: 'javascript'
      },
      {
        title: 'CLI Connection',
        description: 'Connect via command line interface',
        code: `# Connect to different robot types
$ connect drone
[CONNECTED] TB-DRONE-4821
Robot type: Aerial Drone

$ connect humanoid
[CONNECTED] TB-HUMN-7842
Robot type: Humanoid Worker

$ connect delivery
[CONNECTED] TB-DLVR-3156
Robot type: Delivery Bot

$ connect industrial
[CONNECTED] TB-INDS-9024
Robot type: Industrial Arm`,
        language: 'bash'
      },
      {
        title: 'Connection Events',
        code: `// Listen for connection events
client.on('connected', (robot) => {
  console.log(\`Connected to \${robot.id}\`);
  console.log(\`Type: \${robot.type}\`);
  console.log(\`Status: \${robot.status}\`);
});

client.on('disconnected', (reason) => {
  console.log(\`Disconnected: \${reason}\`);
});

client.on('reconnecting', (attempt) => {
  console.log(\`Reconnect attempt \${attempt}/5\`);
});`,
        language: 'javascript'
      }
    ]
  },
  commands: {
    title: 'Robot Commands',
    icon: 'sdk',
    sections: [
      {
        title: 'robot.status()',
        description: 'Get current robot status and telemetry',
        code: `// Get current robot status
const status = await client.robot.status();

console.log(status);
// Output:
// {
//   robotId: 'robot_abc123',
//   state: 'idle',           // 'idle' | 'working' | 'charging' | 'error'
//   battery: 87,             // percentage
//   location: { lat: 37.7749, lng: -122.4194 },
//   currentTask: null,
//   uptime: 86400,           // seconds
//   lastMaintenance: '2024-12-01T10:00:00Z'
// }`,
        language: 'javascript'
      },
      {
        title: 'robot.move(destination)',
        description: 'Command robot to move to specific coordinates',
        code: `// Move to specific location
await client.robot.move({
  lat: 37.7849,
  lng: -122.4094,
  speed: 'normal',           // 'slow' | 'normal' | 'fast'
  avoidObstacles: true,
  pathType: 'optimal'        // 'optimal' | 'shortest' | 'safest'
});

// Move with waypoints
await client.robot.move({
  waypoints: [
    { lat: 37.7800, lng: -122.4100 },
    { lat: 37.7825, lng: -122.4075 },
    { lat: 37.7849, lng: -122.4094 }
  ],
  speed: 'normal'
});`,
        language: 'javascript'
      },
      {
        title: 'robot.execute(action)',
        description: 'Execute specific robot actions',
        code: `// Pick up an item
await client.robot.execute({
  action: 'pickup',
  target: 'package_xyz',
  grip: 'gentle',            // 'gentle' | 'firm' | 'strong'
  verify: true               // Confirm pickup with sensors
});

// Deliver an item
await client.robot.execute({
  action: 'deliver',
  target: 'location_abc',
  method: 'place',           // 'place' | 'handoff' | 'drop'
  confirmation: 'photo'      // 'photo' | 'signature' | 'none'
});

// Scan area
await client.robot.execute({
  action: 'scan',
  type: 'inventory',         // 'inventory' | 'security' | 'mapping'
  radius: 10,                // meters
  resolution: 'high'
});`,
        language: 'javascript'
      },
      {
        title: 'robot.charge()',
        description: 'Command robot to return to charging station',
        code: `// Return to nearest charging station
await client.robot.charge();

// Return to specific station
await client.robot.charge({
  stationId: 'station_01',
  priority: 'normal'         // 'low' | 'normal' | 'high'
});

// Schedule charging
await client.robot.charge({
  scheduledTime: '2024-12-15T02:00:00Z',
  minBattery: 20             // Return if battery drops below 20%
});`,
        language: 'javascript'
      },
      {
        title: 'robot.stop()',
        description: 'Emergency stop and halt all operations',
        code: `// Immediate stop
await client.robot.stop();

// Stop with options
await client.robot.stop({
  reason: 'user_request',    // Logged for audit
  holdPosition: true,        // Maintain current position
  releasePayload: false      // Keep holding items
});

// Resume after stop
await client.robot.resume();`,
        language: 'javascript'
      }
    ]
  },
  tasks: {
    title: 'Task Management',
    icon: 'lifecycle',
    sections: [
      {
        title: 'tasks.discover()',
        description: 'Find available tasks matching robot capabilities',
        code: `// Discover available tasks
const tasks = await client.tasks.discover({
  types: ['delivery', 'patrol', 'inspection'],
  maxDistance: 50,           // km from current location
  minPayment: 10,            // minimum USDC
  maxDuration: 3600,         // max task duration in seconds
  capabilities: ['navigation', 'camera', 'gripper']
});

console.log(\`Found \${tasks.length} available tasks\`);

// Filter tasks
tasks.forEach(task => {
  console.log(\`Task: \${task.id}\`);
  console.log(\`  Type: \${task.type}\`);
  console.log(\`  Payment: \${task.payment} USDC\`);
  console.log(\`  Distance: \${task.distance} km\`);
  console.log(\`  Deadline: \${task.deadline}\`);
});`,
        language: 'javascript'
      },
      {
        title: 'tasks.bid(taskId, options)',
        description: 'Submit a bid for a specific task',
        code: `// Submit a bid
const bid = await client.tasks.bid('task_xyz789', {
  estimatedTime: 2400,       // seconds to complete
  price: 15.5,               // USDC (can be lower than asking)
  message: 'Available immediately, 5-star rated operator',
  startTime: 'immediate'     // or ISO timestamp
});

console.log(\`Bid submitted: \${bid.bidId}\`);
console.log(\`Status: \${bid.status}\`);  // 'pending' | 'accepted' | 'rejected'

// Listen for bid acceptance
client.on('bidAccepted', (task) => {
  console.log(\`Bid accepted for task \${task.id}!\`);
  startTask(task);
});`,
        language: 'javascript'
      },
      {
        title: 'tasks.start(taskId)',
        description: 'Begin execution of an assigned task',
        code: `// Start the task
await client.tasks.start('task_xyz789');

// Task execution with progress updates
client.tasks.on('progress', (update) => {
  console.log(\`Progress: \${update.percentage}%\`);
  console.log(\`Status: \${update.status}\`);
  console.log(\`ETA: \${update.eta}\`);
});

// Handle task stages
client.tasks.on('stageComplete', (stage) => {
  console.log(\`Completed stage: \${stage.name}\`);
  // Stages: 'pickup', 'transit', 'delivery', 'verification'
});`,
        language: 'javascript'
      },
      {
        title: 'tasks.complete(taskId, proof)',
        description: 'Mark task as complete with verification proof',
        code: `// Generate completion proof
const proof = await client.tasks.generateProof('task_xyz789', {
  photos: [deliveryPhoto],   // Base64 encoded images
  gpsTrail: locationHistory,
  sensorData: {
    delivered: true,
    condition: 'intact',
    signature: customerSignature
  }
});

// Submit completion
const result = await client.tasks.complete('task_xyz789', proof);

console.log(\`Task completed!\`);
console.log(\`Verification: \${result.verificationStatus}\`);
console.log(\`Payment: \${result.payment} USDC\`);
console.log(\`Transaction: \${result.txSignature}\`);`,
        language: 'javascript'
      }
    ]
  },
  telemetry: {
    title: 'Telemetry & Events',
    icon: 'verification',
    sections: [
      {
        title: 'telemetry.start()',
        description: 'Begin streaming telemetry data to TaskBoard network',
        code: `// Start telemetry streaming
await client.telemetry.start({
  taskId: 'task_xyz789',
  interval: 1000,            // ms between updates
  sensors: ['gps', 'camera', 'lidar', 'battery', 'imu'],
  encryption: true           // Encrypt sensitive data
});

// Custom telemetry data
client.telemetry.send({
  customMetric: 'payload_temp',
  value: 4.2,
  unit: 'celsius'
});

// Stop telemetry
await client.telemetry.stop();`,
        language: 'javascript'
      },
      {
        title: 'telemetry.export()',
        description: 'Export telemetry data for analysis',
        code: `// Export telemetry data
const data = await client.telemetry.export({
  format: 'json',           // 'json' | 'csv' | 'binary'
  timeRange: {
    start: '2024-01-01T00:00:00Z',
    end: '2024-01-31T23:59:59Z'
  },
  sensors: ['gps', 'battery', 'imu']
});

// Save to file
await client.telemetry.saveToFile('/logs/telemetry.json', data);

console.log(\`Exported \${data.records} records\`);`,
        language: 'javascript'
      },
      {
        title: 'sensors.read()',
        description: 'Read current sensor values',
        code: `// Read all sensors
const sensors = await client.sensors.read();

console.log('Temperature:', sensors.temperature);
console.log('Humidity:', sensors.humidity);
console.log('Pressure:', sensors.pressure);
console.log('Accelerometer:', sensors.accelerometer);
console.log('Gyroscope:', sensors.gyroscope);

// Read specific sensor
const gps = await client.sensors.read('gps');
console.log(\`Location: \${gps.lat}, \${gps.lon}\`);
console.log(\`Altitude: \${gps.altitude}m\`);
console.log(\`Accuracy: \${gps.accuracy}m\`);`,
        language: 'javascript'
      },
      {
        title: 'camera.snapshot()',
        description: 'Capture camera images',
        code: `// Take a snapshot
const image = await client.camera.snapshot({
  resolution: '1920x1080',
  format: 'jpeg',
  quality: 85
});

// Save image
await image.save('/captures/snapshot_001.jpg');

// Stream video
const stream = await client.camera.startStream({
  fps: 30,
  bitrate: 5000000
});

stream.on('frame', (frame) => {
  // Process frame
});

await client.camera.stopStream();`,
        language: 'javascript'
      },
      {
        title: 'gps.location()',
        description: 'Get current GPS coordinates',
        code: `// Get current location
const location = await client.gps.location();

console.log(\`Latitude: \${location.lat}\`);
console.log(\`Longitude: \${location.lon}\`);
console.log(\`Altitude: \${location.altitude}m\`);
console.log(\`Speed: \${location.speed} m/s\`);
console.log(\`Heading: \${location.heading}°\`);
console.log(\`Accuracy: \${location.accuracy}m\`);

// Track location changes
client.gps.watch((position) => {
  console.log('Position updated:', position);
});`,
        language: 'javascript'
      },
      {
        title: 'Event Listeners',
        description: 'Subscribe to robot and system events',
        code: `// Battery events
client.on('batteryLow', (level) => {
  console.log(\`Battery low: \${level}%\`);
  if (level < 15) {
    client.robot.charge();
  }
});

// Obstacle detection
client.on('obstacleDetected', (obstacle) => {
  console.log(\`Obstacle: \${obstacle.type} at \${obstacle.distance}m\`);
});

// Network events
client.on('disconnect', () => {
  console.log('Lost connection to TaskBoard');
});

client.on('reconnect', () => {
  console.log('Reconnected to TaskBoard');
});

// Task events
client.on('taskCancelled', (task) => {
  console.log(\`Task \${task.id} was cancelled\`);
  client.robot.stop();
});

// Error handling
client.on('error', (error) => {
  console.error(\`Error: \${error.code} - \${error.message}\`);
});`,
        language: 'javascript'
      }
    ]
  },
  wallet: {
    title: 'Wallet & Payments',
    icon: 'economics',
    sections: [
      {
        title: 'wallet.balance()',
        description: 'Check wallet balances and transaction history',
        code: `// Get wallet balances
const balance = await client.wallet.balance();

console.log(\`SOL: \${balance.sol}\`);
console.log(\`USDC: \${balance.usdc}\`);
console.log(\`Staked: \${balance.staked} USDC\`);
console.log(\`Pending: \${balance.pending} USDC\`);

// Get transaction history
const history = await client.wallet.transactions({
  limit: 20,
  type: 'all'                // 'all' | 'earnings' | 'fees' | 'stakes'
});

history.forEach(tx => {
  console.log(\`\${tx.type}: \${tx.amount} \${tx.currency} - \${tx.date}\`);
});`,
        language: 'javascript'
      },
      {
        title: 'wallet.withdraw()',
        description: 'Withdraw earnings to external wallet',
        code: `// Withdraw to external wallet
const withdrawal = await client.wallet.withdraw({
  amount: 100,
  currency: 'USDC',
  destination: 'ExternalWalletAddress123...',
  memo: 'Monthly withdrawal'
});

console.log(\`Withdrawal initiated\`);
console.log(\`Transaction: \${withdrawal.txSignature}\`);
console.log(\`Status: \${withdrawal.status}\`);
console.log(\`Estimated arrival: \${withdrawal.eta}\`);`,
        language: 'javascript'
      },
      {
        title: 'wallet.stake()',
        description: 'Stake tokens for priority matching and higher-value tasks',
        code: `// Stake for priority
await client.wallet.stake({
  amount: 500,
  currency: 'USDC',
  duration: 30               // days
});

// Check stake status
const stakeInfo = await client.wallet.stakeInfo();

console.log(\`Staked: \${stakeInfo.amount} USDC\`);
console.log(\`APY: \${stakeInfo.apy}%\`);
console.log(\`Priority Level: \${stakeInfo.priorityLevel}\`);
console.log(\`Unlock Date: \${stakeInfo.unlockDate}\`);

// Unstake (after lock period)
await client.wallet.unstake();`,
        language: 'javascript'
      }
    ]
  },
  system: {
    title: 'System Commands',
    icon: 'cog',
    sections: [
      {
        title: 'System Diagnostics',
        description: 'Run diagnostic checks on robot systems',
        code: `// Run full diagnostics
const diagnostics = await client.system.diagnostics();

console.log('Motors:', diagnostics.motors.status);
console.log('Sensors:', diagnostics.sensors.status);
console.log('Network:', diagnostics.network.status);
console.log('Battery:', diagnostics.battery.health);
console.log('Storage:', diagnostics.storage.free);

// Check specific subsystem
const motorTest = await client.system.test('motors');
console.log(\`Motor test: \${motorTest.passed ? 'PASS' : 'FAIL'}\`);`,
        language: 'javascript'
      },
      {
        title: 'Ping & Network',
        description: 'Test connection and network status',
        code: `// Ping robot
const ping = await client.system.ping();
console.log(\`Latency: \${ping.latency}ms\`);
console.log(\`Status: \${ping.status}\`);

// Network info
const network = await client.system.network();
console.log(\`Connected: \${network.connected}\`);
console.log(\`Signal: \${network.signalStrength}%\`);
console.log(\`Type: \${network.type}\`);  // 'wifi' | '4g' | '5g'
console.log(\`IP: \${network.ip}\`);`,
        language: 'javascript'
      },
      {
        title: 'Version & Firmware',
        description: 'Get version information and update firmware',
        code: `// Get version info
const version = await client.system.version();

console.log(\`Firmware: \${version.firmware}\`);
console.log(\`SDK: \${version.sdk}\`);
console.log(\`Protocol: \${version.protocol}\`);
console.log(\`Hardware: \${version.hardware}\`);

// Check for updates
const updates = await client.system.checkUpdates();
if (updates.available) {
  console.log(\`Update available: \${updates.version}\`);
  await client.system.update();
}`,
        language: 'javascript'
      },
      {
        title: 'Logs & Uptime',
        description: 'Access system logs and uptime information',
        code: `// Get uptime
const uptime = await client.system.uptime();
console.log(\`Uptime: \${uptime.hours}h \${uptime.minutes}m\`);
console.log(\`Last reboot: \${uptime.lastReboot}\`);

// Get recent logs
const logs = await client.system.logs({
  limit: 100,
  level: 'info'    // 'debug' | 'info' | 'warn' | 'error'
});

logs.forEach(log => {
  console.log(\`[\${log.level}] \${log.message}\`);
});

// Export logs
await client.system.exportLogs('/logs/system.log');`,
        language: 'javascript'
      },
      {
        title: 'Reboot & Shutdown',
        description: 'Control robot power state',
        code: `// Soft reboot
await client.system.reboot();

// Schedule reboot
await client.system.reboot({
  delay: 60,           // seconds
  reason: 'Scheduled maintenance'
});

// Emergency shutdown
await client.system.shutdown({
  emergency: true
});

// Sleep mode
await client.system.sleep({
  wakeOn: ['motion', 'network', 'schedule'],
  wakeTime: '06:00'
});`,
        language: 'javascript'
      }
    ]
  },
  howToUse: {
    title: 'How to Use',
    icon: 'hexagon',
    sections: [
      {
        title: 'Quick Start Guide',
        description: 'Get your robot operational in 5 simple steps',
        code: `// STEP 1: Install and initialize
import { TaskBoardClient } from '@taskboard/robot-sdk';
const client = new TaskBoardClient({ wallet, robotId });

// STEP 2: Connect to your robot
await client.connect();
const status = await client.robot.status();
console.log('Robot ready:', status.state === 'idle');

// STEP 3: Discover available tasks
const tasks = await client.tasks.discover({ maxDistance: 10 });

// STEP 4: Accept and execute a task
await client.tasks.bid(tasks[0].id, { price: 15 });
// Wait for acceptance, then:
await client.tasks.start(tasks[0].id);

// STEP 5: Complete and get paid
const proof = await client.tasks.generateProof(tasks[0].id);
await client.tasks.complete(tasks[0].id, proof);
// Payment automatically sent to your wallet!`,
        language: 'javascript'
      },
      {
        title: 'Basic Robot Control',
        description: 'Essential commands every operator should know',
        code: `// Check robot status before operations
const status = await client.robot.status();
if (status.battery < 20) {
  console.log('Low battery! Returning to charge...');
  await client.robot.charge();
}

// Move robot to location
await client.robot.move({ lat: 37.78, lng: -122.41 });

// Execute common actions
await client.robot.execute({ action: 'scan' });
await client.robot.execute({ action: 'pickup', target: 'item_123' });
await client.robot.execute({ action: 'deliver', target: 'location_456' });

// Emergency stop (use anytime!)
await client.robot.stop();

// Return home when done
await client.robot.charge();`,
        language: 'javascript'
      },
      {
        title: 'Monitoring Your Robot',
        description: 'Keep track of your robot\'s status and performance',
        code: `// Set up real-time monitoring
client.on('statusChange', (status) => {
  console.log('State:', status.state);
  console.log('Battery:', status.battery + '%');
  console.log('Location:', status.location);
});

// Battery alerts
client.on('batteryLow', (level) => {
  if (level < 15) {
    client.robot.charge(); // Auto-return to charge
  }
});

// Task progress tracking
client.tasks.on('progress', (update) => {
  console.log(\`Task \${update.percentage}% complete\`);
  console.log(\`ETA: \${update.eta} minutes\`);
});

// Error handling
client.on('error', (err) => {
  console.error('Robot error:', err.message);
  client.robot.stop(); // Safety first!
});`,
        language: 'javascript'
      },
      {
        title: 'Best Practices',
        description: 'Tips for efficient and safe robot operation',
        code: `// 1. Always check status before starting tasks
const ready = await client.robot.status();
if (ready.state !== 'idle' || ready.battery < 30) {
  throw new Error('Robot not ready for new tasks');
}

// 2. Use try-catch for all robot commands
try {
  await client.robot.execute({ action: 'pickup' });
} catch (error) {
  await client.robot.stop();
  console.error('Action failed:', error);
}

// 3. Set up automatic charging
client.on('batteryLow', () => client.robot.charge());

// 4. Log everything for debugging
client.on('*', (event, data) => {
  console.log(\`[\${new Date().toISOString()}] \${event}\`, data);
});

// 5. Graceful shutdown
process.on('SIGINT', async () => {
  await client.robot.stop();
  await client.disconnect();
  process.exit(0);
});`,
        language: 'javascript'
      }
    ]
  },
  priceTiers: {
    title: 'Price Tiers',
    icon: 'economics',
    sections: [
      {
        title: 'Tier Comparison Overview',
        description: 'Choose the right tier based on your operational needs',
        code: `// Price Tier Features Comparison
// ═══════════════════════════════════════════════════════════════

// BUDGET TIER
// └── Best for: Testing, small operations, startups
// └── Hardware: Standard components, basic sensors
// └── Warranty: 1 year limited
// └── Support: Email only (48h response)
// └── Updates: Security patches only
// └── Uptime SLA: 95%

// STANDARD TIER  
// └── Best for: Growing businesses, regular operations
// └── Hardware: Enhanced components, quality sensors
// └── Warranty: 2 years comprehensive
// └── Support: Email + Chat (24h response)
// └── Updates: All software updates included
// └── Uptime SLA: 99%

// PREMIUM TIER
// └── Best for: Enterprise, mission-critical operations
// └── Hardware: Top-grade components, advanced sensors
// └── Warranty: 3 years full coverage + extension options
// └── Support: 24/7 Priority (1h response) + Dedicated manager
// └── Updates: Priority access to new features
// └── Uptime SLA: 99.9%`,
        language: 'text'
      },
      {
        title: 'Hardware Differences',
        description: 'What you get with each tier',
        code: `// DRONE HARDWARE BY TIER
// ───────────────────────────────────────────────────────
// Feature          Budget        Standard       Premium
// ───────────────────────────────────────────────────────
// Flight Time      25 min        35 min         45+ min
// Camera           1080p         4K             4K + Thermal
// Range            5 km          10 km          15+ km
// Obstacle Avoid   Basic         Advanced       AI-Powered
// Weather Rating   IP43          IP54           IP67
// GPS Accuracy     3m            1m             0.3m RTK

// HUMANOID HARDWARE BY TIER
// ───────────────────────────────────────────────────────
// Feature          Budget        Standard       Premium
// ───────────────────────────────────────────────────────
// Battery Life     6 hours       10 hours       14+ hours
// Payload          15 kg         35 kg          50+ kg
// Arm Precision    ±2mm          ±0.5mm         ±0.1mm
// Processors       Single        Dual           Quad + NPU
// Voice/NLP        Basic         Advanced       Full AI

// DELIVERY BOT HARDWARE BY TIER
// ───────────────────────────────────────────────────────
// Feature          Budget        Standard       Premium
// ───────────────────────────────────────────────────────
// Range            15 km         25 km          40+ km
// Cargo Capacity   10 kg         20 kg          30+ kg
// Compartments     1             2              4 (climate)
// Navigation       GPS           GPS+LIDAR      Full sensor

// INDUSTRIAL ARM HARDWARE BY TIER
// ───────────────────────────────────────────────────────
// Feature          Budget        Standard       Premium
// ───────────────────────────────────────────────────────
// Payload          30 kg         100 kg         500+ kg
// Reach            1.2m          2m             3+ m
// Precision        ±0.5mm        ±0.1mm         ±0.02mm
// Cycle Life       5M cycles     10M cycles     15M+ cycles`,
        language: 'text'
      },
      {
        title: 'Support & Service Levels',
        description: 'What support you receive with each tier',
        code: `// SUPPORT COMPARISON
const supportLevels = {
  budget: {
    channels: ['email'],
    responseTime: '48 hours',
    availability: 'Business hours (Mon-Fri)',
    dedicatedManager: false,
    onSiteSupport: false,
    trainingHours: 2,
    documentation: 'Standard',
  },
  
  standard: {
    channels: ['email', 'chat', 'phone'],
    responseTime: '24 hours',
    availability: 'Extended (Mon-Sat)',
    dedicatedManager: false,
    onSiteSupport: 'Paid option',
    trainingHours: 8,
    documentation: 'Standard + Video tutorials',
  },
  
  premium: {
    channels: ['email', 'chat', 'phone', 'video call'],
    responseTime: '1 hour',
    availability: '24/7/365',
    dedicatedManager: true,
    onSiteSupport: 'Included (2 visits/year)',
    trainingHours: 'Unlimited',
    documentation: 'Full + Custom integration guides',
  }
};

// WARRANTY COVERAGE
// Budget:   Manufacturing defects only
// Standard: Manufacturing + wear parts + software issues  
// Premium:  Full coverage + accidental damage protection`,
        language: 'javascript'
      },
      {
        title: 'Choosing Your Tier',
        description: 'Recommendations based on your use case',
        code: `// RECOMMENDATION ENGINE
function recommendTier(requirements) {
  // CHOOSE BUDGET IF:
  // ✓ Testing/prototyping phase
  // ✓ Low-volume operations (<10 tasks/day)
  // ✓ Non-critical applications
  // ✓ Technical team can handle basic maintenance
  // ✓ Budget constraints are primary concern
  
  // CHOOSE STANDARD IF:
  // ✓ Regular daily operations (10-100 tasks/day)
  // ✓ Need reliable performance
  // ✓ Want software updates and improvements
  // ✓ Some downtime is acceptable
  // ✓ Balance of cost and features needed
  
  // CHOOSE PREMIUM IF:
  // ✓ Mission-critical operations
  // ✓ High volume (100+ tasks/day)
  // ✓ Zero tolerance for downtime
  // ✓ Need priority support
  // ✓ Enterprise compliance requirements
  // ✓ Want latest features first
  
  // ROI CONSIDERATION:
  // Premium costs ~2x Budget but offers:
  // - 3x longer warranty
  // - 5x faster support response
  // - 50% better hardware specs
  // - Dedicated success manager
  // → Often pays for itself in reduced downtime
}`,
        language: 'javascript'
      }
    ]
  }
};

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-language">{language}</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="code-content">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('installation');

  const sections = Object.keys(libraryDocs);
  const currentDoc = libraryDocs[activeSection];

  return (
    <div className="docs-page">
      <section className="page-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge>SDK Reference</Badge>
          <h1 className="page-title">TaskBoard Library</h1>
          <p className="page-description">Complete API reference for the TaskBoard Robot SDK</p>
        </motion.div>
      </section>

      <div className="docs-layout">
        {/* Fixed Sidebar */}
        <motion.aside 
          className="docs-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <nav className="docs-nav">
            {sections.map((key) => (
              <button
                key={key}
                className={`docs-nav-item ${activeSection === key ? 'active' : ''}`}
                onClick={() => setActiveSection(key)}
              >
                <Icon name={libraryDocs[key].icon} size={18} />
                <span className="docs-nav-text">{libraryDocs[key].title}</span>
              </button>
            ))}
          </nav>

          <div className="docs-info-card">
            <h4>Quick Start</h4>
            <p>Install the SDK and connect your robot to the TaskBoard network in minutes.</p>
            <code>npm i @taskboard/robot-sdk</code>
          </div>
        </motion.aside>

        {/* Scrollable Content */}
        <motion.main 
          className="docs-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="docs-terminal">
            <div className="docs-terminal-header">
              <div className="terminal-buttons">
                <span className="terminal-btn close"></span>
                <span className="terminal-btn minimize"></span>
                <span className="terminal-btn maximize"></span>
              </div>
              <span className="docs-terminal-title">
                {currentDoc.title.toLowerCase().replace(' ', '-')}.ts
              </span>
              <div className="terminal-spacer"></div>
            </div>
            
            <div className="docs-terminal-body">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="docs-terminal-content"
              >
                <h2 className="docs-section-title">
                  # {currentDoc.title}
                </h2>
                
                {currentDoc.sections.map((section, idx) => (
                  <div key={idx} className="docs-code-section">
                    <h3 className="code-section-title">{section.title}</h3>
                    {section.description && (
                      <p className="code-section-desc">{section.description}</p>
                    )}
                    <CodeBlock code={section.code} language={section.language} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default DocsPage;
