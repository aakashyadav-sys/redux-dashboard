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
import { FormNode } from '../../store/visualizeSlice';
import FormNodeComponent from './nodes/FormNodeComponent';

const nodeTypes = {
  formNode: FormNodeComponent,
};

const FormsVisualization: React.FC = () => {
  const { forms } = useAppSelector(state => state.visualize);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create a hierarchy layout
    const levels: { [key: string]: FormNode[] } = {};
    const rootNodes: FormNode[] = [];

    // Group nodes by hierarchy level
    forms.forEach(form => {
      if (!form.parentFormId) {
        rootNodes.push(form);
        levels['0'] = levels['0'] || [];
        levels['0'].push(form);
      } else {
        // Find the level of this node based on its parent
        const findLevel = (nodeId: string, currentLevel = 1): number => {
          const parent = forms.find(f => f.id === nodeId);
          if (!parent || !parent.parentFormId) return currentLevel;
          return findLevel(parent.parentFormId, currentLevel + 1);
        };
        
        const level = findLevel(form.parentFormId).toString();
        levels[level] = levels[level] || [];
        levels[level].push(form);
      }
    });

    // Position nodes in a hierarchical layout
    Object.keys(levels).forEach((level, levelIndex) => {
      const levelNodes = levels[level];
      const levelY = levelIndex * 200 + 100;
      
      levelNodes.forEach((form, nodeIndex) => {
        const nodeX = (nodeIndex - (levelNodes.length - 1) / 2) * 320 + 400;
        
        nodes.push({
          id: form.id,
          type: 'formNode',
          position: { x: nodeX, y: levelY },
          data: form,
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });

        // Create edges to parent form
        if (form.parentFormId) {
          edges.push({
            id: `edge-${form.parentFormId}-${form.id}`,
            source: form.parentFormId,
            target: form.id,
            type: 'smoothstep',
            style: { stroke: '#8b5cf6', strokeWidth: 2 },
            markerEnd: {
              type: 'arrowclosed',
              color: '#8b5cf6',
            },
          });
        }
      });
    });

    return { nodes, edges };
  }, [forms]);

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
            const form = node.data as FormNode;
            switch (form.category) {
              case 'Category': return '#6b7280';
              case 'HR': return '#ef4444';
              case 'Customer': return '#3b82f6';
              case 'Project': return '#10b981';
              default: return '#8b5cf6';
            }
          }}
          className="!bg-white !border !border-gray-200"
        />
        <Background color="#f1f5f9" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FormsVisualization;