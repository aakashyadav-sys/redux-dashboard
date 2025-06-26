import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useAppSelector } from '../../hooks/useRedux';
import { JobNode } from '../../store/visualizeSlice';
import JobNodeComponent from './nodes/JobNodeComponent';

const nodeTypes = {
  jobNode: JobNodeComponent,
};

const JobsVisualization: React.FC = () => {
  const { jobs } = useAppSelector(state => state.visualize);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create a hierarchy layout
    const levels: { [key: string]: JobNode[] } = {};
    const rootNodes: JobNode[] = [];

    // Group nodes by hierarchy level
    jobs.forEach(job => {
      if (!job.parentJobId) {
        rootNodes.push(job);
        levels['0'] = levels['0'] || [];
        levels['0'].push(job);
      } else {
        // Find the level of this node based on its parent
        const findLevel = (nodeId: string, currentLevel = 1): number => {
          const parent = jobs.find(j => j.id === nodeId);
          if (!parent || !parent.parentJobId) return currentLevel;
          return findLevel(parent.parentJobId, currentLevel + 1);
        };
        
        const level = findLevel(job.parentJobId).toString();
        levels[level] = levels[level] || [];
        levels[level].push(job);
      }
    });

    // Position nodes in a hierarchical layout
    Object.keys(levels).forEach((level, levelIndex) => {
      const levelNodes = levels[level];
      const levelY = levelIndex * 220 + 100;
      
      levelNodes.forEach((job, nodeIndex) => {
        const nodeX = (nodeIndex - (levelNodes.length - 1) / 2) * 350 + 400;
        
        nodes.push({
          id: job.id,
          type: 'jobNode',
          position: { x: nodeX, y: levelY },
          data: job,
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });

        // Create edges to parent job
        if (job.parentJobId) {
          edges.push({
            id: `edge-${job.parentJobId}-${job.id}`,
            source: job.parentJobId,
            target: job.id,
            type: 'smoothstep',
            style: { stroke: '#10b981', strokeWidth: 2 },
            markerEnd: {
              type: 'arrowclosed',
              color: '#10b981',
            },
          });
        }
      });
    });

    return { nodes, edges };
  }, [jobs]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const job = node.data as JobNode;
            switch (job.level) {
              case 'C-Level': return '#ef4444';
              case 'Manager': return '#f59e0b';
              case 'Senior': return '#3b82f6';
              case 'Mid-Level': return '#10b981';
              case 'Entry-Level': return '#6b7280';
              default: return '#6b7280';
            }
          }}
          className="!bg-white !border !border-gray-200"
        />
        <Background color="#f1f5f9" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default JobsVisualization;