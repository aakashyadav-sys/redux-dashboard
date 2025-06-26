import React from 'react';
import { BarChart3, TrendingUp, PieChart, Users } from 'lucide-react';
import { DataItem } from '../types';
import SalaryBarChart from './charts/SalaryBarChart';
import HiringTrendChart from './charts/HiringTrendChart';
import DepartmentDistributionChart from './charts/DepartmentDistributionChart';

interface DashboardProps {
  items: DataItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const totalEmployees = items.length;
  const totalDepartments = new Set(items.map(item => item.department)).size;
  const avgSalary = items.reduce((sum, item) => sum + (item.salary || 0), 0) / items.length || 0;
  const latestHire = items.reduce((latest, item) => {
    if (!item.startDate) return latest;
    const itemDate = new Date(item.startDate);
    const latestDate = latest ? new Date(latest.startDate) : new Date(0);
    return itemDate > latestDate ? item : latest;
  }, null as DataItem | null);

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees.toString(),
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Departments',
      value: totalDepartments.toString(),
      icon: PieChart,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Average Salary',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(avgSalary),
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Latest Hire',
      value: latestHire ? `${latestHire.firstName} ${latestHire.lastName}` : 'N/A',
      icon: BarChart3,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Salary Bar Chart */}
        <div className="lg:col-span-1">
          <SalaryBarChart items={items} />
        </div>

        {/* Department Distribution */}
        <div className="lg:col-span-1">
          <DepartmentDistributionChart items={items} />
        </div>

        {/* Hiring Trend Chart - Full Width */}
        <div className="lg:col-span-2">
          <HiringTrendChart items={items} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;