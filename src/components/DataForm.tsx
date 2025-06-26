import React, { useState, useEffect } from 'react';
import { formFields } from '../utils/formConfig';
import { DataItem } from '../types';

interface DataFormProps {
  onSubmit: (data: Omit<DataItem, 'id'>) => void;
  onCancel: () => void;
  initialData?: DataItem;
  isEdit?: boolean;
}

const DataForm: React.FC<DataFormProps> = ({ onSubmit, onCancel, initialData, isEdit = false }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Initialize form with empty values
      const initialFormData: Record<string, any> = {};
      formFields.forEach(field => {
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
    
    formFields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = isEdit 
        ? { ...formData, id: initialData?.id } as DataItem
        : formData;
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
        {formFields.map(renderField)}
      </div>
      
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
          {isEdit ? 'Update' : 'Add'} Record
        </button>
      </div>
    </form>
  );
};

export default DataForm;