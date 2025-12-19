import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { Badge } from '../components/UIComponents';
import './Playground.css';

// ============ BLOCK CATEGORIES ============
const blockCategories = [
  {
    name: 'Start',
    color: '#10b981',
    blocks: [
      { type: 'robotSelect', label: 'Robot Select', icon: '🤖', description: 'Choose robot type' },
      { type: 'trigger', label: 'Trigger', icon: '⚡', description: 'When to start' },
    ]
  },
  {
    name: 'Actions',
    color: '#3b82f6',
    blocks: [
      { type: 'task', label: 'Task', icon: '📋', description: 'Robot action' },
      { type: 'location', label: 'Location', icon: '📍', description: 'Set coordinates' },
    ]
  },
  {
    name: 'Logic',
    color: '#f59e0b',
    blocks: [
      { type: 'condition', label: 'Condition', icon: '🔀', description: 'If/else logic' },
      { type: 'loop', label: 'Loop', icon: '🔄', description: 'Repeat tasks' },
    ]
  },
  {
    name: 'End',
    color: '#ef4444',
    blocks: [
      { type: 'output', label: 'Output', icon: '✅', description: 'Complete workflow' },
    ]
  }
];

// Block configurations
const blockConfigs = {
  robotSelect: {
    options: ['Drone', 'Humanoid', 'Delivery Bot', 'Industrial Arm'],
    defaultValue: 'Drone'
  },
  trigger: {
    options: ['Manual', 'Scheduled', 'Event-based'],
    defaultValue: 'Manual'
  },
  task: {
    drone: ['scan', 'patrol', 'photo', 'map', 'inspect', 'track', 'survey', 'stream'],
    humanoid: ['pickup', 'deliver', 'assemble', 'sort', 'assist', 'pack', 'inspect', 'clean'],
    delivery: ['load', 'deliver', 'return', 'scan', 'notify', 'wait', 'photo', 'unlock'],
    industrial: ['weld', 'paint', 'lift', 'calibrate', 'cycle', 'cut', 'drill', 'grind'],
  },
  location: {
    presets: ['Warehouse', 'Station-A', 'Station-B', 'Home Base', 'Custom...'],
    defaultValue: 'Warehouse'
  },
  condition: {
    options: ['Battery > 20%', 'Task Complete', 'Sensor Triggered', 'Time Elapsed', 'Custom...'],
    defaultValue: 'Task Complete'
  },
  loop: {
    options: ['2 times', '5 times', '10 times', 'Until condition', 'Infinite'],
    defaultValue: '5 times'
  },
  output: {
    options: ['Complete', 'Send Report', 'Return Home', 'Standby'],
    defaultValue: 'Complete'
  }
};

// ============ MAIN COMPONENT ============
const Playground = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedRobotType, setSelectedRobotType] = useState('drone');

  // Handle node connection
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: '#3b82f6', strokeWidth: 2 } 
    }, eds)),
    [setEdges]
  );

  // Handle drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const blockData = JSON.parse(event.dataTransfer.getData('blockData') || '{}');

      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type: 'default',
        position,
        data: { 
          label: (
            <div className="custom-node">
              <span className="node-icon">{blockData.icon}</span>
              <span className="node-label">{blockData.label}</span>
            </div>
          ),
          blockType: type,
          icon: blockData.icon,
          blockLabel: blockData.label,
          config: blockConfigs[type] || {},
          value: blockConfigs[type]?.defaultValue || '',
        },
        style: {
          background: 'rgba(15, 25, 35, 0.95)',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '12px 16px',
          minWidth: '140px',
          fontSize: '14px',
          color: '#ffffff',
        }
      };

      setNodes((nds) => nds.concat(newNode));
      
      // Update selected robot type if robot select block
      if (type === 'robotSelect' && blockData.label) {
        const robotType = blockConfigs.robotSelect.defaultValue.toLowerCase().replace(' ', '');
        setSelectedRobotType(robotType);
      }
    },
    [reactFlowInstance, setNodes]
  );

  // Handle block drag start
  const onDragStart = (event, blockType, blockData) => {
    event.dataTransfer.setData('application/reactflow', blockType);
    event.dataTransfer.setData('blockData', JSON.stringify(blockData));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Update node config
  const updateNodeConfig = (nodeId, newValue) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // If updating robot select, also update the selected robot type
          if (node.data.blockType === 'robotSelect') {
            const typeMap = {
              'Drone': 'drone',
              'Humanoid': 'humanoid', 
              'Delivery Bot': 'delivery',
              'Industrial Arm': 'industrial'
            };
            setSelectedRobotType(typeMap[newValue] || 'drone');
          }
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              value: newValue,
            },
          };
          // Also update selectedNode
          setSelectedNode(updatedNode);
          return updatedNode;
        }
        return node;
      })
    );
  };

  // Delete selected node
  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      setSelectedNode(null);
    }
  };

  // Clear all nodes
  const clearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  };

  // Export workflow
  const exportWorkflow = () => {
    const workflow = {
      nodes: nodes.map(n => ({ 
        id: n.id, 
        type: n.data.blockType, 
        label: n.data.blockLabel,
        config: n.data.value, 
        position: n.position 
      })),
      edges: edges.map(e => ({ source: e.source, target: e.target })),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskboard-workflow.json';
    a.click();
  };

  // Run workflow (simulation)
  const runWorkflow = () => {
    if (nodes.length === 0) {
      alert('Add some blocks first!');
      return;
    }
    alert(`🚀 Workflow started!\n\n${nodes.length} blocks will be executed.\n\nThis is a simulation - connect to real robots via API.`);
  };

  return (
    <div className="playground-page">
      {/* Header */}
      <section className="playground-header">
        <Badge>Visual Workflow Builder</Badge>
        <h1>Playground</h1>
        <p>Drag blocks to canvas, connect them, and build your robot workflow</p>
      </section>

      <div className="playground-container">
        {/* Left Panel - Block Library */}
        <aside className="blocks-panel">
          <div className="panel-header">
            <h3>📦 Blocks</h3>
          </div>
          <div className="blocks-list">
            {blockCategories.map((category) => (
              <div key={category.name} className="block-category">
                <h4 style={{ borderLeftColor: category.color }}>{category.name}</h4>
                <div className="category-blocks">
                  {category.blocks.map((block) => (
                    <div
                      key={block.type}
                      className="block-item"
                      draggable
                      onDragStart={(e) => onDragStart(e, block.type, block)}
                    >
                      <span className="block-icon">{block.icon}</span>
                      <div className="block-info">
                        <span className="block-label">{block.label}</span>
                        <span className="block-desc">{block.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Workflow Actions */}
          <div className="workflow-actions">
            <button className="action-btn run" onClick={runWorkflow}>
              ▶️ Run
            </button>
            <button className="action-btn export" onClick={exportWorkflow}>
              📤 Export
            </button>
            <button className="action-btn clear" onClick={clearWorkflow}>
              🗑️ Clear
            </button>
          </div>
        </aside>

        {/* Center - Canvas */}
        <main className="canvas-area" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              fitView
              snapToGrid
              snapGrid={[15, 15]}
              className="workflow-canvas"
              proOptions={{ hideAttribution: true }}
            >
              <Controls />
              <MiniMap 
                nodeColor={() => 'var(--accent-primary)'}
                maskColor="rgba(0,0,0,0.8)"
                style={{ background: 'var(--bg-secondary)' }}
              />
              <Background color="var(--border-color)" gap={20} />
            </ReactFlow>
          </ReactFlowProvider>
          
          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="canvas-empty">
              <span className="empty-icon">🎯</span>
              <h3>Start Building</h3>
              <p>Drag blocks from the left panel to create your workflow</p>
            </div>
          )}
        </main>

        {/* Right Panel - Node Configuration */}
        <aside className="config-panel">
          <div className="panel-header">
            <h3>⚙️ Configuration</h3>
          </div>
          
          {selectedNode ? (
            <motion.div 
              className="node-config"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="config-block-header">
                <span className="config-block-icon">{selectedNode.data.icon}</span>
                <span className="config-block-name">{selectedNode.data.blockLabel}</span>
                <button className="delete-node" onClick={deleteSelectedNode}>🗑️</button>
              </div>
              
              <div className="config-body">
                <label>Select Value</label>
                {selectedNode.data.blockType === 'task' ? (
                  <select
                    value={selectedNode.data.value}
                    onChange={(e) => updateNodeConfig(selectedNode.id, e.target.value)}
                  >
                    <option value="">Select task...</option>
                    {blockConfigs.task[selectedRobotType]?.map(task => (
                      <option key={task} value={task}>{task}</option>
                    ))}
                  </select>
                ) : selectedNode.data.config.options ? (
                  <select
                    value={selectedNode.data.value}
                    onChange={(e) => updateNodeConfig(selectedNode.id, e.target.value)}
                  >
                    {selectedNode.data.config.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : selectedNode.data.config.presets ? (
                  <select
                    value={selectedNode.data.value}
                    onChange={(e) => updateNodeConfig(selectedNode.id, e.target.value)}
                  >
                    {selectedNode.data.config.presets.map(preset => (
                      <option key={preset} value={preset}>{preset}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter value..."
                    value={selectedNode.data.value || ''}
                    onChange={(e) => updateNodeConfig(selectedNode.id, e.target.value)}
                  />
                )}
                
                <div className="config-info">
                  <span className="config-info-label">Current:</span>
                  <span className="config-info-value">{selectedNode.data.value || 'Not set'}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="config-empty">
              <span className="config-empty-icon">👆</span>
              <p>Click a block on the canvas to configure it</p>
            </div>
          )}
          
          {/* Workflow Stats */}
          <div className="workflow-stats">
            <h4>Workflow Stats</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{nodes.length}</span>
                <span className="stat-label">Blocks</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{edges.length}</span>
                <span className="stat-label">Connections</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* How It Works Section */}
      <section className="playground-guide">
        <h2>📖 How It Works</h2>
        <div className="guide-grid">
          <div className="guide-card">
            <span className="guide-step">1</span>
            <h3>Choose a Robot</h3>
            <p>Drag the <strong>Robot Select</strong> block to the canvas. This determines which type of robot will execute your workflow.</p>
          </div>
          <div className="guide-card">
            <span className="guide-step">2</span>
            <h3>Set a Trigger</h3>
            <p>Add a <strong>Trigger</strong> block to define when your workflow starts: manually, on a schedule, or when an event occurs.</p>
          </div>
          <div className="guide-card">
            <span className="guide-step">3</span>
            <h3>Add Tasks</h3>
            <p>Use <strong>Task</strong> and <strong>Location</strong> blocks to define what the robot should do and where.</p>
          </div>
          <div className="guide-card">
            <span className="guide-step">4</span>
            <h3>Add Logic</h3>
            <p>Use <strong>Condition</strong> blocks for if/else decisions and <strong>Loop</strong> blocks to repeat actions.</p>
          </div>
          <div className="guide-card">
            <span className="guide-step">5</span>
            <h3>Connect Blocks</h3>
            <p>Click and drag from one block's handle to another to connect them. The flow goes left to right.</p>
          </div>
          <div className="guide-card">
            <span className="guide-step">6</span>
            <h3>Export & Run</h3>
            <p>End with an <strong>Output</strong> block, then click <strong>Export</strong> to save or <strong>Run</strong> to simulate.</p>
          </div>
        </div>

        <div className="guide-tips">
          <h3>💡 Pro Tips</h3>
          <ul>
            <li><strong>Need help?</strong> — Click the Chat button in the bottom-left corner to ask AI assistant</li>
            <li><strong>Configure blocks</strong> — Click on any block to see its settings in the right panel</li>
            <li><strong>Use the minimap</strong> — Bottom-right corner helps navigate large workflows</li>
            <li><strong>Delete blocks</strong> — Select a block and press Delete key or click 🗑️</li>
          </ul>
        </div>

        <div className="block-reference">
          <h3>📦 Block Reference</h3>
          <div className="reference-grid">
            <div className="reference-item">
              <span>🤖</span>
              <div>
                <strong>Robot Select</strong>
                <p>Choose: Drone, Humanoid, Delivery Bot, Industrial Arm</p>
              </div>
            </div>
            <div className="reference-item">
              <span>⚡</span>
              <div>
                <strong>Trigger</strong>
                <p>Manual, Scheduled (time-based), Event-based (sensors)</p>
              </div>
            </div>
            <div className="reference-item">
              <span>📋</span>
              <div>
                <strong>Task</strong>
                <p>Robot-specific actions (scan, deliver, weld, etc.)</p>
              </div>
            </div>
            <div className="reference-item">
              <span>📍</span>
              <div>
                <strong>Location</strong>
                <p>Set destination: Warehouse, Station-A/B, Home, Custom</p>
              </div>
            </div>
            <div className="reference-item">
              <span>🔀</span>
              <div>
                <strong>Condition</strong>
                <p>If/else logic: battery level, task status, sensors</p>
              </div>
            </div>
            <div className="reference-item">
              <span>🔄</span>
              <div>
                <strong>Loop</strong>
                <p>Repeat: 2x, 5x, 10x, until condition, infinite</p>
              </div>
            </div>
            <div className="reference-item">
              <span>✅</span>
              <div>
                <strong>Output</strong>
                <p>End workflow: Complete, Send Report, Return Home</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Playground;
