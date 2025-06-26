import React, { useState, useEffect } from 'react';
import { taskFormFields } from '../utils/ganttConfig';
import { Task } from '../types';

interface TaskFormProps {
  onSubmit: (data: Omit<Task, 'id'>) => void;
  onCancel: () => void;
  initialData?: Task;
  isEdit?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData, isEdit = false }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Initialize form with empty values
      const initialFormData: Record<string, any> = {
        progress: 0,
        dependencies: []
      };
      taskFormFields.forEach(field => {
        initialFormData[field.name] = '';
      });
      setFormData(initialFormData);
    }
  }, [initialData]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    taskFormFields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    // Validate date range
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = isEdit 
        ? { ...formData, id: initialData?.id } as Task
        : { ...formData, progress: formData.progress || 0, dependencies: [] };
      onSubmit(submitData);
    }
  };

  const renderField = (field: any) => {
    const { name, label, type, options, placeholder, required } = field;
    
    return (
      <div key={name} className="mb-6">
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {type === 'select' ? (
          <select
            id={name}
            value={formData[name] || ''}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors[name] ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select {label}</option>
            {options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={name}
            value={formData[name] || ''}
            onChange={(e) => handleInputChange(name, e.target.value)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors[name] ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
        )}
        
        {errors[name] && (
          <p className="mt-2 text-sm text-red-600">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {taskFormFields.map(renderField)}
      </div>
      
      {isEdit && (
        <div className="mb-6">
          <label htmlFor="progress" className="block text-sm font-semibold text-gray-700 mb-2">
            Progress (%)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              id="progress"
              min="0"
              max="100"
              value={formData.progress || 0}
              onChange={(e) => handleInputChange('progress', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0%</span>
              <span className="font-medium">{formData.progress || 0}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          {isEdit ? 'Update' : 'Add'} Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;