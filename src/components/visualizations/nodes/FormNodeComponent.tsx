import React from 'react';
import { Handle, Position } from 'reactflow';
import { FileText, Users, Calendar, Circle } from 'lucide-react';
import { FormNode } from '../../../store/visualizeSlice';

interface FormNodeComponentProps {
  data: FormNode;
}

const FormNodeComponent: React.FC<FormNodeComponentProps> = ({ data }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Category': return 'border-gray-500 bg-gray-50';
      case 'HR': return 'border-red-500 bg-red-50';
      case 'Customer': return 'border-blue-500 bg-blue-50';
      case 'Project': return 'border-green-500 bg-green-50';
      default: return 'border-purple-500 bg-purple-50';
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case 'Category': return 'text-gray-700';
      case 'HR': return 'text-red-700';
      case 'Customer': return 'text-blue-700';
      case 'Project': return 'text-green-700';
      default: return 'text-purple-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'draft': return 'text-yellow-600';
      case 'archived': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const isCategory = data.category === 'Category';

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white min-w-[260px] ${getCategoryColor(data.category)}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{data.title}</h3>
          <FileText size={16} className={getCategoryTextColor(data.category)} />
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(data.category)} ${getCategoryTextColor(data.category)}`}>
            {data.category}
          </span>
          <div className="flex items-center">
            <Circle size={8} className={`mr-1 ${getStatusColor(data.status)}`} fill="currentColor" />
            <span className={`text-xs capitalize ${getStatusColor(data.status)}`}>
              {data.status}
            </span>
          </div>
        </div>
      </div>

      {!isCategory && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-gray-600">
              <FileText size={12} className="mr-1" />
              <span>{data.fields} fields</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users size={12} className="mr-1" />
              <span>{data.submissions} submissions</span>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-600">
            <Calendar size={12} className="mr-1" />
            <span>Created {new Date(data.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default FormNodeComponent;