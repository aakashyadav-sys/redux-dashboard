import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DataItem } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalaryBarChartProps {
  items: DataItem[];
}

const SalaryBarChart: React.FC<SalaryBarChartProps> = ({ items }) => {
  // Group data by department and calculate average salary
  const departmentData = items.reduce((acc, item) => {
    if (!acc[item.department]) {
      acc[item.department] = { total: 0, count: 0 };
    }
    acc[item.department].total += item.salary || 0;
    acc[item.department].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const departments = Object.keys(departmentData);
  const averageSalaries = departments.map(dept => 
    Math.round(departmentData[dept].total / departmentData[dept].count)
  );

  const data = {
    labels: departments,
    datasets: [
      {
        label: 'Average Salary by Department',
        data: averageSalaries,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: '600',
          },
          color: '#374151',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Average Salary by Department',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#111827',
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Average: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(context.parsed.y)}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6B7280',
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(value);
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '500',
          },
          color: '#374151',
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border h-96">
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalaryBarChart;