import React from 'react';
import { Handle, Position } from 'reactflow';
import { User, Mail, Calendar } from 'lucide-react';
import { TeamNode } from '../../../store/visualizeSlice';

interface TeamNodeComponentProps {
  data: TeamNode;
}

const TeamNodeComponent: React.FC<TeamNodeComponentProps> = ({ data }) => {
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Executive': return 'border-red-500 bg-red-50';
      case 'Technology': return 'border-blue-500 bg-blue-50';
      case 'Engineering': return 'border-green-500 bg-green-50';
      case 'Marketing': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getDepartmentTextColor = (department: string) => {
    switch (department) {
      case 'Executive': return 'text-red-700';
      case 'Technology': return 'text-blue-700';
      case 'Engineering': return 'text-green-700';
      case 'Marketing': return 'text-yellow-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white min-w-[250px] ${getDepartmentColor(data.department)}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={data.avatar}
          alt={data.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{data.name}</h3>
          <p className={`text-xs font-medium ${getDepartmentTextColor(data.department)}`}>
            {data.role}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-xs text-gray-600">
          <User size={12} className="mr-2" />
          <span>{data.department}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <Mail size={12} className="mr-2" />
          <span className="truncate">{data.email}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <Calendar size={12} className="mr-2" />
          <span>Joined {new Date(data.joinDate).toLocaleDateString()}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default TeamNodeComponent;