import React from 'react';
import { Edit3, Trash2, Copy, Users } from 'lucide-react';
import { DataItem } from '../types';

interface DataTableProps {
  items: DataItem[];
  onEdit: (item: DataItem) => void;
  onDelete: (id: string) => void;
  onCopy: (item: DataItem) => void;
}

const DataTable: React.FC<DataTableProps> = ({ items, onEdit, onDelete, onCopy }) => {
  const formatValue = (key: string, value: any) => {
    if (key === 'salary' && typeof value === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(value);
    }
    
    if (key === 'startDate' && value) {
      return new Date(value).toLocaleDateString();
    }
    
    return value;
  };

  const getColumnLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      department: 'Department',
      salary: 'Salary',
      startDate: 'Start Date'
    };
    return labelMap[key] || key;
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
          <p className="text-gray-500">Get started by adding your first record.</p>
        </div>
      </div>
    );
  }

  // Get columns from first item (excluding id)
  const columns = Object.keys(items[0]).filter(key => key !== 'id');

  return (
    <div className="overflow-hidden shadow-lg rounded-xl bg-white">
      {/* Mobile Card View */}
      <div className="block sm:hidden">
        <div className="divide-y divide-gray-200">
          {items.map((item, index) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.firstName} {item.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{item.department}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                      title="Edit record"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onCopy(item)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200"
                      title="Copy record"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Email: </span>
                    <a
                      href={`mailto:${item.email}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {item.email}
                    </a>
                  </div>
                  {item.phone && (
                    <div>
                      <span className="font-medium text-gray-600">Phone: </span>
                      <span className="text-gray-900">{item.phone}</span>
                    </div>
                  )}
                  {item.salary && (
                    <div>
                      <span className="font-medium text-gray-600">Salary: </span>
                      <span className="text-gray-900">{formatValue('salary', item.salary)}</span>
                    </div>
                  )}
                  {item.startDate && (
                    <div>
                      <span className="font-medium text-gray-600">Start Date: </span>
                      <span className="text-gray-900">{formatValue('startDate', item.startDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {getColumnLabel(column)}
                </th>
              ))}
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr
                key={item.id}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition-colors`}
              >
                {columns.map((column) => (
                  <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column === 'email' ? (
                      <a
                        href={`mailto:${item[column]}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item[column]}
                      </a>
                    ) : (
                      formatValue(column, item[column])
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200 tooltip"
                      title="Edit record"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onCopy(item)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200"
                      title="Copy record"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;