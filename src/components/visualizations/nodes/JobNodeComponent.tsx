import React from 'react';
import { Handle, Position } from 'reactflow';
import { Briefcase, DollarSign, Users, Star } from 'lucide-react';
import { JobNode } from '../../../store/visualizeSlice';

interface JobNodeComponentProps {
  data: JobNode;
}

const JobNodeComponent: React.FC<JobNodeComponentProps> = ({ data }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'C-Level': return 'border-red-500 bg-red-50';
      case 'Manager': return 'border-yellow-500 bg-yellow-50';
      case 'Senior': return 'border-blue-500 bg-blue-50';
      case 'Mid-Level': return 'border-green-500 bg-green-50';
      case 'Entry-Level': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getLevelTextColor = (level: string) => {
    switch (level) {
      case 'C-Level': return 'text-red-700';
      case 'Manager': return 'text-yellow-700';
      case 'Senior': return 'text-blue-700';
      case 'Mid-Level': return 'text-green-700';
      case 'Entry-Level': return 'text-gray-700';
      default: return 'text-gray-700';
    }
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(salary);
  };

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white min-w-[280px] ${getLevelColor(data.level)}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{data.title}</h3>
          <Briefcase size={16} className={getLevelTextColor(data.level)} />
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelColor(data.level)} ${getLevelTextColor(data.level)}`}>
            {data.level}
          </span>
          <span className="text-xs text-gray-600">{data.department}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-gray-600">
            <DollarSign size={12} className="mr-1" />
            <span>{formatSalary(data.salary)}</span>
          </div>
          {data.openPositions > 0 && (
            <div className="flex items-center text-green-600">
              <Users size={12} className="mr-1" />
              <span>{data.openPositions} open</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-600">
          <div className="font-medium mb-1">Key Requirements:</div>
          <div className="space-y-1">
            {data.requirements.slice(0, 2).map((req, index) => (
              <div key={index} className="flex items-center">
                <Star size={10} className="mr-1 text-yellow-500" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default JobNodeComponent;