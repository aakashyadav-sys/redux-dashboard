import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DataItem } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HiringTrendChartProps {
  items: DataItem[];
}

const HiringTrendChart: React.FC<HiringTrendChartProps> = ({ items }) => {
  // Group data by month and count hires
  const hiringData = items.reduce((acc, item) => {
    if (item.startDate) {
      const date = new Date(item.startDate);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Sort months and create labels
  const sortedMonths = Object.keys(hiringData).sort();
  const labels = sortedMonths.map(month => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });
  
  const hiringCounts = sortedMonths.map(month => hiringData[month]);

  // Calculate cumulative hires
  const cumulativeHires = hiringCounts.reduce((acc, count, index) => {
    acc.push((acc[index - 1] || 0) + count);
    return acc;
  }, [] as number[]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Monthly Hires',
        data: hiringCounts,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Cumulative Hires',
        data: cumulativeHires,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
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
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: 'Hiring Trends Over Time',
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
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} ${context.parsed.y === 1 ? 'hire' : 'hires'}`;
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
          stepSize: 1,
        },
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
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
      <Line data={data} options={options} />
    </div>
  );
};

export default HiringTrendChart;