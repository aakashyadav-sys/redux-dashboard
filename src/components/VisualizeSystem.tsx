import React from 'react';
import { Eye, Users, Briefcase, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setActiveView } from '../store/visualizeSlice';
import TeamsVisualization from './visualizations/TeamsVisualization';
import JobsVisualization from './visualizations/JobsVisualization';
import FormsVisualization from './visualizations/FormsVisualization';

const VisualizeSystem: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeView, teams, jobs, forms } = useAppSelector(state => state.visualize);

  const sidebarItems = [
    {
      id: 'teams',
      label: 'Teams',
      icon: Users,
      count: teams.length,
      description: 'Organization structure'
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Briefcase,
      count: jobs.length,
      description: 'Job hierarchy'
    },
    {
      id: 'forms',
      label: 'Forms',
      icon: FileText,
      count: forms.length,
      description: 'Form relationships'
    }
  ];

  const renderVisualization = () => {
    switch (activeView) {
      case 'teams':
        return <TeamsVisualization />;
      case 'jobs':
        return <JobsVisualization />;
      case 'forms':
        return <FormsVisualization />;
      default:
        return <TeamsVisualization />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Eye className="mr-3 h-6 w-6 text-blue-600" />
            Visualize
          </h2>
          <p className="text-gray-600 mt-1">Interactive data visualizations</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => dispatch(setActiveView(item.id as any))}
                  className={`w-full flex items-center justify-between p-4 rounded-lg text-left transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon size={20} className="mr-3" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    activeView === item.id
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {item.count}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Stats Summary */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Nodes</span>
              <span className="font-medium text-gray-900">
                {teams.length + jobs.length + forms.length}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Active View</span>
              <span className="font-medium text-blue-600 capitalize">{activeView}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 flex flex-col">
        {/* Visualization Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {activeView} Visualization
              </h3>
              <p className="text-gray-600 text-sm">
                {activeView === 'teams' && 'Interactive organizational chart showing team structure and relationships'}
                {activeView === 'jobs' && 'Hierarchical view of job positions and career progression paths'}
                {activeView === 'forms' && 'Form categorization and relationship mapping'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                {activeView === 'teams' && `${teams.length} team members`}
                {activeView === 'jobs' && `${jobs.length} job positions`}
                {activeView === 'forms' && `${forms.length} forms`}
              </div>
            </div>
          </div>
        </div>

        {/* Visualization Content */}
        <div className="flex-1 relative">
          {renderVisualization()}
        </div>
      </div>
    </div>
  );
};

export default VisualizeSystem;