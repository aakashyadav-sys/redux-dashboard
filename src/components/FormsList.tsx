import React from 'react';
import { Edit3, Trash2, Eye, Users, Calendar, FileText } from 'lucide-react';
import { DynamicForm } from '../types';

interface FormsListProps {
  forms: DynamicForm[];
  onEdit: (form: DynamicForm) => void;
  onDelete: (formId: string) => void;
  onSelect: (form: DynamicForm) => void;
}

const FormsList: React.FC<FormsListProps> = ({ forms, onEdit, onDelete, onSelect }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No forms created yet</h3>
        <p className="text-gray-500">Create your first form to get started collecting responses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden md:block overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Form
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fields
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forms.map((form, index) => (
              <tr
                key={form.id}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition-colors cursor-pointer`}
                onClick={() => onSelect(form)}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{form.title}</div>
                    {form.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {form.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <FileText size={16} className="mr-2 text-gray-400" />
                    {form.fields.length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Users size={16} className="mr-2 text-gray-400" />
                    {form.submissions.length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(form.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(form);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all"
                      title="Preview form"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(form);
                      }}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all"
                      title="Edit form"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(form.id);
                      }}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all"
                      title="Delete form"
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

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelect(form)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{form.title}</h3>
                {form.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{form.description}</p>
                )}
              </div>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(form);
                  }}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(form);
                  }}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(form.id);
                  }}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FileText size={14} className="mr-1" />
                  {form.fields.length} fields
                </div>
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  {form.submissions.length} submissions
                </div>
              </div>
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(form.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormsList;