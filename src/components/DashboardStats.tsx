'use client';

import { UsersIcon, VideoCameraIcon, SignalIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { pollingService } from '@/utils/polling-service';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    rooms: 0,
    participants: 0,
    ingress: 0,
    egress: 0,
  });

  useEffect(() => {
    return pollingService.subscribe('stats', setStats);
  }, []);

  const stats_items = [
    {
      name: 'Active Rooms',
      value: stats.rooms,
      icon: VideoCameraIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      name: 'Connected Users',
      value: stats.participants,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      name: 'Ingress Streams',
      value: stats.ingress,
      icon: SignalIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
    },
    {
      name: 'Egress Streams',
      value: stats.egress,
      icon: ArrowTrendingUpIcon,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats_items.map((item) => (
        <div
          key={item.name}
          className={`bg-white rounded-xl shadow-sm border ${item.borderColor} p-6 hover:shadow-md hover:shadow-glow transition-all duration-200`}
        >
          <div className="flex items-center">
            <div className={`${item.bgColor} ${item.color} p-3 rounded-lg`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-surface-500">{item.name}</p>
              <p className="text-2xl font-semibold text-surface-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 