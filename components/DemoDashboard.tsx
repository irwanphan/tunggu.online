'use client';

import { useState } from 'react';

interface DemoData {
  pageviews: number;
  clicks: number;
  scrolls: number;
  conversionRate: number;
  topPages: { url: string; views: number }[];
  deviceStats: { device: string; percentage: number }[];
}

export function Demo() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'heatmap'>('analytics');
  
  const demoData: DemoData = {
    pageviews: 15420,
    clicks: 8920,
    scrolls: 12340,
    conversionRate: 12.5,
    topPages: [
      { url: '/home', views: 3420 },
      { url: '/products', views: 2890 },
      { url: '/about', views: 1560 },
      { url: '/contact', views: 890 },
      { url: '/blog', views: 670 }
    ],
    deviceStats: [
      { device: 'Desktop', percentage: 65 },
      { device: 'Mobile', percentage: 30 },
      { device: 'Tablet', percentage: 5 }
    ]
  };

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Demo Dashboard
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Lihat bagaimana Tunggu Monitoring membantu Anda memahami perilaku pengunjung
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'heatmap'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Heatmap
            </button>
          </div>
        </div>

        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Analytics Dashboard
            </h3>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {demoData.pageviews.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Pageviews</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {demoData.clicks.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Clicks</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {demoData.scrolls.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Scroll Events</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {demoData.conversionRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Conversion Rate</div>
              </div>
            </div>

            {/* Top Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top Pages
                </h4>
                <div className="space-y-3">
                  {demoData.topPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 truncate">
                        {page.url}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        {page.views.toLocaleString()} views
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Device Distribution
                </h4>
                <div className="space-y-3">
                  {demoData.deviceStats.map((device, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">
                        {device.device}
                      </span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          {device.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Heatmap Visualization
            </h3>
            
            <div className="text-center py-12">
              <div className="w-64 h-48 bg-gradient-to-br from-red-400 via-yellow-400 to-green-400 rounded-lg mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
                <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded-full opacity-80"></div>
                <div className="absolute top-8 right-8 w-6 h-6 bg-orange-500 rounded-full opacity-70"></div>
                <div className="absolute bottom-8 left-8 w-10 h-10 bg-yellow-500 rounded-full opacity-60"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-green-500 rounded-full opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full opacity-90"></div>
              </div>
              
              <div className="text-gray-600 dark:text-gray-300 mb-6">
                <p className="text-lg font-medium mb-2">Interactive Heatmap</p>
                <p className="text-sm">
                  Visualisasi klik, scroll, dan hover behavior pengunjung website
                </p>
              </div>
              
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">High Activity</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Medium Activity</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Low Activity</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Siap untuk mulai?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Dapatkan insight mendalam tentang perilaku pengunjung website Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Mulai Gratis
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#features"
              className="inline-flex items-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}