import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Settings, Eye } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DynamicForm, DynamicFormField } from '../types';

interface FormBuilderProps {
  onSave: (form: Omit<DynamicForm, 'id' | 'createdAt' | 'updatedAt' | 'submissions'>) => void;
  onCancel: () => void;
  initialData?: DynamicForm | null;
  isEdit?: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ onSave, onCancel, initialData, isEdit = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<DynamicFormField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
  ];

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setFields(initialData.fields);
    }
  }, [initialData]);

  const addField = (type: string) => {
    const newField: DynamicFormField = {
      id: `field_${Date.now()}`,
      type: type as any,
      label: `New ${type} Field`,
      required: false,
      placeholder: type === 'textarea' ? 'Enter your text here...' : `Enter ${type}...`,
      options: ['select', 'radio'].includes(type) ? ['Option 1', 'Option 2'] : undefined
    };
    setFields([...fields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<DynamicFormField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const removeField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFields(items);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Form title is required';
    }
    
    if (fields.length === 0) {
      newErrors.fields = 'At least one field is required';
    }

    fields.forEach((field, index) => {
      if (!field.label.trim()) {
        newErrors[`field_${index}_label`] = 'Field label is required';
      }
      if (['select', 'radio'].includes(field.type) && (!field.options || field.options.length === 0)) {
        newErrors[`field_${index}_options`] = 'Options are required for this field type';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        fields
      });
    }
  };

  const renderFieldEditor = (field: DynamicFormField, index: number) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Field {index + 1}</h4>
        <button
          onClick={() => removeField(field.id)}
          className="text-red-600 hover:text-red-800 p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Type
          </label>
          <select
            value={field.type}
            onChange={(e) => updateField(field.id, { type: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {fieldTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Label *
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[`field_${index}_label`] ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors[`field_${index}_label`] && (
            <p className="mt-1 text-sm text-red-600">{errors[`field_${index}_label`]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(field.id, { required: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Required field</span>
          </label>
        </div>
      </div>

      {['select', 'radio'].includes(field.type) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options *
          </label>
          <div className="space-y-2">
            {field.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(field.options || [])];
                    newOptions[optionIndex] = e.target.value;
                    updateField(field.id, { options: newOptions });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    const newOptions = field.options?.filter((_, i) => i !== optionIndex);
                    updateField(field.id, { options: newOptions });
                  }}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                updateField(field.id, { options: newOptions });
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Option
            </button>
          </div>
          {errors[`field_${index}_options`] && (
            <p className="mt-1 text-sm text-red-600">{errors[`field_${index}_options`]}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Form Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="mr-2" size={20} />
          Form Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter form title"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter form description (optional)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Field Types */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Fields</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fieldTypes.map(type => (
            <button
              key={type.value}
              onClick={() => addField(type.value)}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-sm font-medium"
            >
              <Plus size={16} className="mr-2" />
              {type.label}
            </button>
          ))}
        </div>
        {errors.fields && (
          <p className="mt-2 text-sm text-red-600">{errors.fields}</p>
        )}
      </div>

      {/* Form Fields */}
      {fields.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Fields</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-start space-x-3"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="mt-4 text-gray-400 hover:text-gray-600 cursor-move"
                          >
                            <GripVertical size={20} />
                          </div>
                          <div className="flex-1">
                            {renderFieldEditor(field, index)}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          {isEdit ? 'Update' : 'Create'} Form
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;