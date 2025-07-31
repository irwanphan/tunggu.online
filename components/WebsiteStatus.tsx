'use client';

import { useState, useEffect } from 'react';

interface Website {
  id: string;
  name: string;
  url: string;
  category: string;
  status: 'online' | 'offline' | 'checking';
  lastChecked: Date;
  responseTime?: number;
}

export function WebsiteStatus() {
  const [websites, setWebsites] = useState<Website[]>([
    {
      id: '1',
      name: 'Satu Data Indonesia',
      url: 'https://data.go.id',
      category: 'Data & Statistik',
      status: 'checking',
      lastChecked: new Date()
    },
    {
      id: '2',
      name: 'DPR RI',
      url: 'https://dpr.go.id',
      category: 'Legislatif',
      status: 'checking',
      lastChecked: new Date()
    },
    {
      id: '3',
      name: 'POLRI',
      url: 'https://polri.go.id',
      category: 'Keamanan',
      status: 'checking',
      lastChecked: new Date()
    },
    {
      id: '4',
      name: 'Kementerian Keuangan',
      url: 'https://kemenkeu.go.id',
      category: 'Ekonomi',
      status: 'checking',
      lastChecked: new Date()
    },
    {
      id: '5',
      name: 'Kementerian Kesehatan',
      url: 'https://kemkes.go.id',
      category: 'Kesehatan',
      status: 'checking',
      lastChecked: new Date()
    },
    {
      id: '6',
      name: 'Kementerian Pendidikan',
      url: 'https://kemdikbud.go.id',
      category: 'Pendidikan',
      status: 'checking',
      lastChecked: new Date()
    },
    {
      id: '7',
      name: 'BPS',
      url: 'https://bps.go.id',
      category: 'Data & Statistik',
      status: 'checking',
      lastChecked: new Date()
    },
    {
      id: '8',
      name: 'Bank Indonesia',
      url: 'https://bi.go.id',
      category: 'Ekonomi',
      status: 'checking',
      lastChecked: new Date()
    },
    {
      id: '9',
      name: 'Kementerian Dalam Negeri',
      url: 'https://kemendagri.go.id',
      category: 'Pemerintahan',
      status: 'checking',
      lastChecked: new Date()
    },
    {
      id: '10',
      name: 'Kementerian Luar Negeri',
      url: 'https://kemlu.go.id',
      category: 'Pemerintahan',
      status: 'checking',
      lastChecked: new Date()
    }
  ]);

  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Check website status using API
  const checkWebsiteStatus = async (): Promise<void> => {
    try {
      const response = await fetch('/api/monitoring');
      const result = await response.json();
      
      if (result.success) {
        setWebsites(result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          url: item.url,
          category: item.category,
          status: item.status,
          responseTime: item.responseTime,
          lastChecked: new Date(item.lastChecked)
        })));
      }
    } catch (error) {
      console.error('Failed to check website status:', error);
    }
  };

  useEffect(() => {
    const checkAllWebsites = async () => {
      setIsLoading(true);
      await checkWebsiteStatus();
      setIsLoading(false);
    };

    checkAllWebsites();

    // Set up interval to check every 5 minutes
    const interval = setInterval(checkAllWebsites, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredWebsites = filter === 'all' 
    ? websites 
    : websites.filter(website => website.category === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  const categories = ['all', 'Data & Statistik', 'Legislatif', 'Keamanan', 'Ekonomi', 'Kesehatan', 'Pendidikan', 'Pemerintahan'];

  return (
    <section id="monitoring" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Status Website Pemerintah
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Monitoring real-time ketersediaan website penting Indonesia
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {category === 'all' ? 'Semua' : category}
            </button>
          ))}
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {websites.filter(w => w.status === 'online').length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Online</div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {websites.filter(w => w.status === 'offline').length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Offline</div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {websites.filter(w => w.status === 'checking').length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Checking</div>
          </div>
        </div>

        {/* Website List */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Response Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Terakhir Dicek
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                {filteredWebsites.map((website) => (
                  <tr key={website.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {website.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {website.url}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {website.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(website.status)}`}>
                        {getStatusText(website.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {website.responseTime ? `${website.responseTime}ms` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {website.lastChecked.toLocaleTimeString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Terakhir diperbarui: {new Date().toLocaleString('id-ID')}
          {isLoading && (
            <span className="ml-2 inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memperbarui...
            </span>
          )}
        </div>
      </div>
    </section>
  );
} 