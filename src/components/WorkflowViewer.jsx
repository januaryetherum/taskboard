import { useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import './WorkflowViewer.css';

// Convert saved workflow data to ReactFlow format
const convertToReactFlowFormat = (workflow) => {
  if (!workflow || !workflow.nodes) return { nodes: [], edges: [] };

  const nodes = workflow.nodes.map((node, index) => ({
    id: node.id || `node-${index}`,
    type: 'default',
    position: node.position || { x: 100 + index * 200, y: 100 },
    data: {
      label: (
        <div className="viewer-node">
          <span className="viewer-node-icon">{node.icon || '📦'}</span>
          <div className="viewer-node-content">
            <span className="viewer-node-label">{node.label || node.type}</span>
            {node.config && <span className="viewer-node-value">{node.config}</span>}
          </div>
        </div>
      ),
    },
    style: {
      background: 'rgba(15, 25, 35, 0.95)',
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      padding: '8px 12px',
      minWidth: '140px',
      color: '#ffffff',
    },
  }));

  const edges = (workflow.edges || []).map((edge, index) => ({
    id: `edge-${index}`,
    source: edge.source,
    target: edge.target,
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  }));

  return { nodes, edges };
};

const WorkflowViewer = ({ workflow, task, onClose }) => {
  const { nodes, edges } = useMemo(() => convertToReactFlowFormat(workflow), [workflow]);

  if (!workflow) return null;

  return (
    <motion.div 
      className="workflow-viewer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="workflow-viewer-modal"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="viewer-header">
          <div className="viewer-header-left">
            <h2>📊 Workflow Solution</h2>
            {task && <span className="viewer-task-title">{task.title}</span>}
          </div>
          <div className="viewer-header-right">
            <div className="viewer-stats">
              <span className="stat">{nodes.length} blocks</span>
              <span className="stat">{edges.length} connections</span>
            </div>
            <button className="viewer-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="viewer-canvas">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              panOnDrag
              zoomOnScroll
              preventScrolling
              proOptions={{ hideAttribution: true }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
            >
              <Background color="var(--border-color)" gap={20} />
              <Controls showInteractive={false} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Block List */}
        <div className="viewer-block-list">
          <h4>Workflow Steps:</h4>
          <div className="viewer-blocks">
            {workflow.nodes?.map((node, idx) => (
              <div key={node.id || idx} className="viewer-block-item">
                <span className="block-number">{idx + 1}</span>
                <span className="block-icon">{node.icon || '📦'}</span>
                <span className="block-name">{node.label || node.type}</span>
                {node.config && <span className="block-config">{node.config}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="viewer-footer">
          {task && (
            <div className="viewer-meta">
              <span>Completed by: <strong>{task.takenBy}</strong></span>
              {task.completedAt && (
                <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
              )}
            </div>
          )}
          <button className="viewer-close-btn-large" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkflowViewer;
