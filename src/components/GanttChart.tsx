import React, { useState, useMemo } from 'react';
import { Plus, Calendar, Clock, User, Flag, BarChart3, Edit3, Trash2, Copy } from 'lucide-react';
import { Task } from '../types';

interface GanttChartProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCopyTask: (task: Task) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCopyTask,
  onUpdateProgress
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Calculate date range for the chart
  const dateRange = useMemo(() => {
    if (tasks.length === 0) return { start: new Date(), end: new Date() };
    
    const dates = tasks.flatMap(task => [new Date(task.startDate), new Date(task.endDate)]);
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Add padding
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);
    
    return { start: minDate, end: maxDate };
  }, [tasks]);

  // Generate time periods based on view mode
  const timePeriods = useMemo(() => {
    const periods = [];
    const current = new Date(dateRange.start);
    
    while (current <= dateRange.end) {
      if (viewMode === 'month') {
        periods.push({
          label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          date: new Date(current),
          key: `${current.getFullYear()}-${current.getMonth()}`
        });
        current.setMonth(current.getMonth() + 1);
      } else {
        periods.push({
          label: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          date: new Date(current),
          key: current.toISOString().split('T')[0]
        });
        current.setDate(current.getDate() + 7);
      }
    }
    
    return periods;
  }, [dateRange, viewMode]);

  const calculateTaskPosition = (task: Task) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const totalDays = (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24);
    const startOffset = (taskStart.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24);
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Not Started': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="mr-3 h-7 w-7 text-blue-600" />
            Project Planning
          </h2>
          <p className="text-gray-600 mt-1">Manage tasks and track project progress</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
          </div>
          
          <button
            onClick={onAddTask}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus size={18} className="mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'Completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.status === 'In Progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length || 0)}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Flag className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            {/* Timeline Header */}
            <div className="flex border-b border-gray-200">
              <div className="w-80 flex-shrink-0 p-4 bg-gray-50 border-r border-gray-200">
                <h3 className="font-semibold text-gray-900">Tasks</h3>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex h-12 items-center bg-gray-50">
                  {timePeriods.map((period) => (
                    <div
                      key={period.key}
                      className="flex-1 px-2 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0"
                    >
                      {period.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Rows */}
            <div className="divide-y divide-gray-200">
              {tasks.map((task, index) => {
                const position = calculateTaskPosition(task);
                return (
                  <div key={task.id} className="flex hover:bg-gray-50 transition-colors">
                    {/* Task Info */}
                    <div className="w-80 flex-shrink-0 p-4 border-r border-gray-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">{task.name}</h4>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => onEditTask(task)}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-all"
                              title="Edit task"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => onCopyTask(task)}
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-all"
                              title="Copy task"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-all"
                              title="Delete task"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <User size={12} />
                          <span>{task.assignee}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} title={`${task.priority} Priority`} />
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {formatDuration(task.startDate, task.endDate)}
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex-1 min-w-0 relative p-4">
                      <div className="relative h-8">
                        <div
                          className="absolute top-1 h-6 bg-blue-500 rounded-lg shadow-sm cursor-pointer hover:bg-blue-600 transition-colors"
                          style={position}
                          onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                        >
                          <div className="h-full bg-blue-600 rounded-lg" style={{ width: `${task.progress}%` }} />
                          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                            {task.progress}%
                          </div>
                        </div>
                      </div>
                      
                      {selectedTask === task.id && (
                        <div className="absolute top-10 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm text-gray-600">{task.progress}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={task.progress}
                              onChange={(e) => onUpdateProgress(task.id, parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            {task.description && (
                              <p className="text-xs text-gray-600 mt-2">{task.description}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet View */}
        <div className="block lg:hidden">
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.assignee}</p>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => onCopyTask(task)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                      <span className="text-xs text-gray-600">{task.priority}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Start: {new Date(task.startDate).toLocaleDateString()}</div>
                    <div>End: {new Date(task.endDate).toLocaleDateString()}</div>
                    <div>Duration: {formatDuration(task.startDate, task.endDate)}</div>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{task.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;