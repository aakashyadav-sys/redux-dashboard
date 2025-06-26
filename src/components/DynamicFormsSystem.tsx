import React, { useState } from 'react';
import { FileText, Plus, List, Eye, Edit3, Trash2, Users, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { createForm, deleteForm, selectForm, submitForm } from '../store/dynamicFormsSlice';
import FormBuilder from './FormBuilder';
import FormsList from './FormsList';
import FormPreview from './FormPreview';
import FormSubmissions from './FormSubmissions';
import { DynamicForm } from '../types';

const DynamicFormsSystem: React.FC = () => {
  const dispatch = useAppDispatch();
  const { forms, selectedForm } = useAppSelector(state => state.dynamicForms);
  const [activeTab, setActiveTab] = useState<'builder' | 'list' | 'preview' | 'submissions'>('builder');
  const [isBuilding, setIsBuilding] = useState(false);
  const [editingForm, setEditingForm] = useState<DynamicForm | null>(null);

  const tabs = [
    { id: 'builder', label: 'Form Builder', icon: FileText },
    { id: 'list', label: 'Forms List', icon: List },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'submissions', label: 'Submissions', icon: Users },
  ];

  const handleCreateForm = (formData: Omit<DynamicForm, 'id' | 'createdAt' | 'updatedAt' | 'submissions'>) => {
    dispatch(createForm(formData));
    setIsBuilding(false);
    setEditingForm(null);
    setActiveTab('list');
  };

  const handleEditForm = (form: DynamicForm) => {
    setEditingForm(form);
    setIsBuilding(true);
    setActiveTab('builder');
  };

  const handleDeleteForm = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      dispatch(deleteForm(formId));
    }
  };

  const handleFormSelect = (form: DynamicForm) => {
    dispatch(selectForm(form));
    setActiveTab('preview');
  };

  const handleFormSubmit = (formId: string, data: Record<string, any>) => {
    dispatch(submitForm({ formId, data }));
  };

  const totalSubmissions = forms.reduce((total, form) => total + form.submissions.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 h-7 w-7 text-blue-600" />
            Dynamic Forms
          </h2>
          <p className="text-gray-600 mt-1">Create, manage, and collect responses from custom forms</p>
        </div>
        
        <button
          onClick={() => {
            setIsBuilding(true);
            setEditingForm(null);
            setActiveTab('builder');
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus size={18} className="mr-2" />
          Create New Form
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Forms</p>
              <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-green-600">{totalSubmissions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Forms</p>
              <p className="text-2xl font-bold text-purple-600">{forms.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <List className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Response Rate</p>
              <p className="text-2xl font-bold text-orange-600">
                {forms.length > 0 ? Math.round((totalSubmissions / forms.length) * 100) / 100 : 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'builder' && (
            <FormBuilder
              onSave={handleCreateForm}
              onCancel={() => {
                setIsBuilding(false);
                setEditingForm(null);
                setActiveTab('list');
              }}
              initialData={editingForm}
              isEdit={!!editingForm}
            />
          )}

          {activeTab === 'list' && (
            <FormsList
              forms={forms}
              onEdit={handleEditForm}
              onDelete={handleDeleteForm}
              onSelect={handleFormSelect}
            />
          )}

          {activeTab === 'preview' && (
            <FormPreview
              form={selectedForm}
              onSubmit={handleFormSubmit}
            />
          )}

          {activeTab === 'submissions' && (
            <FormSubmissions
              forms={forms}
              selectedForm={selectedForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicFormsSystem;