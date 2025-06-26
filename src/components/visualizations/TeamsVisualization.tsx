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
import { TeamNode } from '../../store/visualizeSlice';
import TeamNodeComponent from './nodes/TeamNodeComponent';

const nodeTypes = {
  teamNode: TeamNodeComponent,
};

const TeamsVisualization: React.FC = () => {
  const { teams } = useAppSelector(state => state.visualize);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create a hierarchy layout
    const levels: { [key: string]: TeamNode[] } = {};
    const rootNodes: TeamNode[] = [];

    // Group nodes by hierarchy level
    teams.forEach(team => {
      if (!team.managerId) {
        rootNodes.push(team);
        levels['0'] = levels['0'] || [];
        levels['0'].push(team);
      } else {
        // Find the level of this node based on its manager
        const findLevel = (nodeId: string, currentLevel = 1): number => {
          const manager = teams.find(t => t.id === nodeId);
          if (!manager || !manager.managerId) return currentLevel;
          return findLevel(manager.managerId, currentLevel + 1);
        };
        
        const level = findLevel(team.managerId).toString();
        levels[level] = levels[level] || [];
        levels[level].push(team);
      }
    });

    // Position nodes in a hierarchical layout
    Object.keys(levels).forEach((level, levelIndex) => {
      const levelNodes = levels[level];
      const levelY = levelIndex * 200 + 100;
      
      levelNodes.forEach((team, nodeIndex) => {
        const nodeX = (nodeIndex - (levelNodes.length - 1) / 2) * 300 + 400;
        
        nodes.push({
          id: team.id,
          type: 'teamNode',
          position: { x: nodeX, y: levelY },
          data: team,
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });

        // Create edges to manager
        if (team.managerId) {
          edges.push({
            id: `edge-${team.managerId}-${team.id}`,
            source: team.managerId,
            target: team.id,
            type: 'smoothstep',
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            markerEnd: {
              type: 'arrowclosed',
              color: '#3b82f6',
            },
          });
        }
      });
    });

    return { nodes, edges };
  }, [teams]);

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
            const team = node.data as TeamNode;
            switch (team.department) {
              case 'Executive': return '#ef4444';
              case 'Technology': return '#3b82f6';
              case 'Engineering': return '#10b981';
              case 'Marketing': return '#f59e0b';
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

export default TeamsVisualization;