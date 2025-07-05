import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { Plus, Database, CheckCircle, AlertCircle, BarChart3, Table, Calendar, Mail, FileText, MessageCircle, Eye, Code } from 'lucide-react';
import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import { addItem, updateItem, deleteItem } from './store/dataSlice';
import { addTask, updateTask, deleteTask, updateTaskProgress } from './store/ganttSlice';
import Modal from './components/Modal';
import DataForm from './components/DataForm';
import TaskForm from './components/TaskForm';
import DataTable from './components/DataTable';
import Dashboard from './components/Dashboard';
import GanttChart from './components/GanttChart';
import EmailSystem from './components/EmailSystem';
import DynamicFormsSystem from './components/DynamicFormsSystem';
import ChatSystem from './components/ChatSystem';
import VisualizeSystem from './components/VisualizeSystem';
import ComponentsLibrary from './components/ComponentsLibrary';
import { DataItem, Task } from './types';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.data);
  const { tasks } = useAppSelector(state => state.gantt);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table' | 'gantt' | 'email' | 'forms' | 'chat' | 'visualize' | 'components'>('dashboard');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Data handlers
  const handleAddItem = (data: Omit<DataItem, 'id'>) => {
    dispatch(addItem(data));
    setIsModalOpen(false);
    showNotification('Record added successfully!', 'success');
  };

  const handleUpdateItem = (data: DataItem) => {
    dispatch(updateItem(data));
    setEditingItem(null);
    setIsModalOpen(false);
    showNotification('Record updated successfully!', 'success');
  };

  const handleEditItem = (item: DataItem) => {
    setEditingItem(item);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      dispatch(deleteItem(id));
      showNotification('Record deleted successfully!', 'success');
    }
  };

  const handleCopyItem = (item: DataItem) => {
    const copyData = { ...item };
    delete copyData.id;
    copyData.firstName = `${copyData.firstName} (Copy)`;
    dispatch(addItem(copyData));
    showNotification('Record copied successfully!', 'success');
  };

  // Task handlers
  const handleAddTask = (data: Omit<Task, 'id'>) => {
    dispatch(addTask(data));
    setIsModalOpen(false);
    showNotification('Task added successfully!', 'success');
  };

  const handleUpdateTask = (data: Task) => {
    dispatch(updateTask(data));
    setEditingTask(null);
    setIsModalOpen(false);
    showNotification('Task updated successfully!', 'success');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
      showNotification('Task deleted successfully!', 'success');
    }
  };

  const handleCopyTask = (task: Task) => {
    const copyData = { ...task };
    delete copyData.id;
    copyData.name = `${copyData.name} (Copy)`;
    dispatch(addTask(copyData));
    showNotification('Task copied successfully!', 'success');
  };

  const handleUpdateTaskProgress = (id: string, progress: number) => {
    dispatch(updateTaskProgress({ id, progress }));
    showNotification('Task progress updated!', 'success');
  };

  const handleOpenAddModal = () => {
    if (activeTab === 'gantt') {
      setEditingTask(null);
      setEditingItem(null);
    } else {
      setEditingItem(null);
      setEditingTask(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setEditingTask(null);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'table', label: 'Data Table', icon: Table },
    { id: 'gantt', label: 'Planning', icon: Calendar },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'visualize', label: 'Visualize', icon: Eye },
    { id: 'components', label: 'Components', icon: Code },
  ];

  const getModalTitle = () => {
    if (activeTab === 'gantt') {
      return editingTask ? 'Edit Task' : 'Add New Task';
    }
    return editingItem ? 'Edit Record' : 'Add New Record';
  };

  const getAddButtonText = () => {
    if (activeTab === 'gantt') {
      return 'Add New Task';
    }
    return 'Add New Record';
  };

  const shouldShowAddButton = () => {
    return activeTab !== 'email' && activeTab !== 'forms' && activeTab !== 'chat' && activeTab !== 'visualize' && activeTab !== 'components';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Manager</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage your records, projects, communications, forms, and visualizations</p>
              </div>
            </div>
            
            {shouldShowAddButton() && (
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <Plus size={18} className="mr-2" />
                {getAddButtonText()}
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
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
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' ? (
          <Dashboard items={items} />
        ) : activeTab === 'email' ? (
          <EmailSystem />
        ) : activeTab === 'forms' ? (
          <DynamicFormsSystem />
        ) : activeTab === 'chat' ? (
          <ChatSystem />
        ) : activeTab === 'visualize' ? (
          <VisualizeSystem />
        ) : activeTab === 'components' ? (
          <ComponentsLibrary />
        ) : activeTab === 'gantt' ? (
          <GanttChart
            tasks={tasks}
            onAddTask={handleOpenAddModal}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCopyTask={handleCopyTask}
            onUpdateProgress={handleUpdateTaskProgress}
          />
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Records</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{items.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Database className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {new Set(items.map(item => item.department)).size}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Salary</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                      }).format(
                        items.reduce((sum, item) => sum + (item.salary || 0), 0) / items.length || 0
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <DataTable
              items={items}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onCopy={handleCopyItem}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={getModalTitle()}
      >
        {activeTab === 'gantt' ? (
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            onCancel={handleCloseModal}
            initialData={editingTask || undefined}
            isEdit={!!editingTask}
          />
        ) : (
          <DataForm
            onSubmit={editingItem ? handleUpdateItem : handleAddItem}
            onCancel={handleCloseModal}
            initialData={editingItem || undefined}
            isEdit={!!editingItem}
          />
        )}
      </Modal>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`flex items-center p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-3 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-3 text-red-600 flex-shrink-0" />
            )}
            <span className="font-medium text-sm">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;