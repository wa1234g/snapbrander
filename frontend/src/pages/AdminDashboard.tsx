import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalProjects: number;
  activeTrials: number;
  expiredTrials: number;
  totalUsers: number;
  revenueThisMonth: number;
}

interface Project {
  id: number;
  name: string;
  user: {
    name: string;
    email: string;
  };
  status: string;
  trial_expires_at: string;
  created_at: string;
  domain: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeTrials: 0,
    expiredTrials: 0,
    totalUsers: 0,
    revenueThisMonth: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setStats({
        totalProjects: 156,
        activeTrials: 23,
        expiredTrials: 8,
        totalUsers: 89,
        revenueThisMonth: 12450,
      });

      setProjects([
        {
          id: 1,
          name: 'شركة التسويق الرقمي',
          user: { name: 'أحمد محمد', email: 'ahmed@example.com' },
          status: 'active',
          trial_expires_at: '2025-08-08T10:00:00Z',
          created_at: '2025-08-05T08:30:00Z',
          domain: 'project-123.fureraa.com',
        },
        {
          id: 2,
          name: 'متجر الأزياء العصرية',
          user: { name: 'فاطمة علي', email: 'fatima@example.com' },
          status: 'generating',
          trial_expires_at: '2025-08-07T15:20:00Z',
          created_at: '2025-08-04T14:15:00Z',
          domain: 'project-456.fureraa.com',
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'نشط' },
      generating: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'قيد الإنشاء' },
      expired: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'منتهي الصلاحية' },
      archived: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', label: 'مؤرشف' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border} backdrop-blur-sm`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900" dir="rtl">
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
                لوحة التحكم الإدارية
              </h1>
              <p className="mt-1 text-sm text-gray-300">
                مرحباً {user?.name}، إليك نظرة عامة على النظام
              </p>
            </div>
            <div className="flex space-x-3 space-x-reverse">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg">
                إضافة مستخدم جديد
              </button>
              <button className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 px-4 py-2 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-gray-600/30">
                تصدير التقارير
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/30 hover:bg-gray-800/50 transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-300">إجمالي المشاريع</p>
                <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/30 hover:bg-gray-800/50 transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-300">التجارب النشطة</p>
                <p className="text-3xl font-bold text-white">{stats.activeTrials}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/30 hover:bg-gray-800/50 transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-300">التجارب المنتهية</p>
                <p className="text-3xl font-bold text-white">{stats.expiredTrials}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/30 hover:bg-gray-800/50 transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-300">إجمالي المستخدمين</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/30 hover:bg-gray-800/50 transition-all duration-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-300">الإيرادات الشهرية</p>
                <p className="text-3xl font-bold text-white">{stats.revenueThisMonth.toLocaleString()} ج.م</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/30">
          <div className="px-6 py-4 border-b border-gray-700/50">
            <h3 className="text-lg font-semibold text-white">المشاريع الحديثة</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    المشروع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    انتهاء التجربة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    الدومين
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/20 divide-y divide-gray-700/30">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{project.name}</div>
                        <div className="text-sm text-gray-400">تم الإنشاء: {formatDate(project.created_at)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{project.user.name}</div>
                        <div className="text-sm text-gray-400">{project.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(project.trial_expires_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`https://${project.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                      >
                        {project.domain}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">عرض</button>
                        <button className="text-green-400 hover:text-green-300 transition-colors">تمديد</button>
                        <button className="text-red-400 hover:text-red-300 transition-colors">حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
