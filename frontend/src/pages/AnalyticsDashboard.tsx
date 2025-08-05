import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface AnalyticsData {
  overview: {
    total_projects: number;
    total_users: number;
    total_revenue: number;
    active_trials: number;
  };
  projects: {
    total_created: number;
    by_type: Array<{ business_type: string; count: number }>;
    by_status: Array<{ status: string; count: number }>;
    completion_rate: number;
  };
  users: {
    new_registrations: number;
    active_users: number;
    conversion_rate: number;
  };
  revenue: {
    total: number;
    average_order_value: number;
    by_plan: Record<string, { count: number; total: number }>;
  };
  trials: {
    total: number;
    active: number;
    expired: number;
    converted: number;
    conversion_rate: number;
  };
  charts: {
    projects_over_time: Array<{ date: string; count: number }>;
    revenue_over_time: Array<{ date: string; total: number }>;
    user_registrations: Array<{ date: string; count: number }>;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState('30');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/admin/analytics?period=${period}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.role || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h1>
          <p className="text-gray-600">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التحليلات...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">خطأ في تحميل البيانات</h1>
          <p className="text-gray-600">حدث خطأ أثناء تحميل بيانات التحليلات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحليلات</h1>
            <p className="text-gray-600">تحليل شامل لأداء النظام</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">آخر 7 أيام</option>
              <option value="30">آخر 30 يوم</option>
              <option value="90">آخر 90 يوم</option>
              <option value="365">آخر سنة</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المشاريع</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.total_projects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.total_users}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.total_revenue.toLocaleString()} جنيه</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">التجارب النشطة</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.active_trials}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">إحصائيات المشاريع</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">المشاريع المنشأة</span>
                <span className="text-lg font-semibold text-gray-900">{analytics.projects.total_created}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">معدل الإكمال</span>
                <span className="text-lg font-semibold text-green-600">{analytics.projects.completion_rate.toFixed(1)}%</span>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">حسب نوع النشاط</h4>
                <div className="space-y-2">
                  {analytics.projects.by_type.map((item) => (
                    <div key={item.business_type} className="flex items-center justify-between">
                      <span className="text-gray-600 capitalize">
                        {item.business_type === 'company' ? 'شركة' : 
                         item.business_type === 'store' ? 'متجر' : 'صفحة هبوط'}
                      </span>
                      <span className="text-gray-900 font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">إحصائيات التجارب</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">إجمالي التجارب</span>
                <span className="text-lg font-semibold text-gray-900">{analytics.trials.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">التجارب النشطة</span>
                <span className="text-lg font-semibold text-green-600">{analytics.trials.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">التجارب المنتهية</span>
                <span className="text-lg font-semibold text-red-600">{analytics.trials.expired}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">التجارب المحولة</span>
                <span className="text-lg font-semibold text-blue-600">{analytics.trials.converted}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600 font-medium">معدل التحويل</span>
                <span className="text-xl font-bold text-purple-600">{analytics.trials.conversion_rate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">إحصائيات المستخدمين</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">التسجيلات الجديدة</span>
                <span className="text-lg font-semibold text-gray-900">{analytics.users.new_registrations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">المستخدمون النشطون</span>
                <span className="text-lg font-semibold text-green-600">{analytics.users.active_users}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600 font-medium">معدل التحويل</span>
                <span className="text-xl font-bold text-blue-600">{analytics.users.conversion_rate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">إحصائيات الإيرادات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">إجمالي الإيرادات</span>
                <span className="text-lg font-semibold text-gray-900">{analytics.revenue.total.toLocaleString()} جنيه</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">متوسط قيمة الطلب</span>
                <span className="text-lg font-semibold text-green-600">{analytics.revenue.average_order_value.toFixed(0)} جنيه</span>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">الإيرادات حسب الباقة</h4>
                <div className="space-y-2">
                  {Object.entries(analytics.revenue.by_plan).map(([planName, data]) => (
                    <div key={planName} className="flex items-center justify-between">
                      <span className="text-gray-600">{planName}</span>
                      <span className="text-gray-900 font-medium">{data.total.toLocaleString()} جنيه</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
