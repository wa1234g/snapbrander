import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Project {
  id: number;
  name: string;
  business_name: string;
  business_type: string;
  status: string;
  domain?: string;
  wp_admin_url?: string;
  trial_expires_at?: string;
  created_at: string;
  template?: {
    name: string;
    preview_image: string;
  };
}

interface Subscription {
  id: number;
  status: string;
  billing_cycle: string;
  current_period_end: string;
  plan: {
    name: string;
    monthly_price: number;
    yearly_price: number;
  };
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsResponse, subscriptionResponse] = await Promise.all([
        api.get('/projects'),
        api.get('/subscriptions'),
      ]);

      setProjects(projectsResponse.data.data || []);
      setSubscription(subscriptionResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', color: 'bg-green-100 text-green-800' },
      generating: { label: 'قيد الإنشاء', color: 'bg-yellow-100 text-yellow-800' },
      draft: { label: 'مسودة', color: 'bg-gray-100 text-gray-800' },
      failed: { label: 'فشل', color: 'bg-red-100 text-red-800' },
      archived: { label: 'مؤرشف', color: 'bg-purple-100 text-purple-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTrialTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'انتهت';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} يوم`;
    return `${hours} ساعة`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">مرحباً، {user?.name}</h1>
          <p className="text-gray-600">إدارة مشاريعك ومواقعك الإلكترونية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">مشاريعي</h2>
                <a
                  href="/wizard"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  إنشاء موقع جديد
                </a>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مشاريع بعد</h3>
                  <p className="text-gray-600 mb-6">ابدأ بإنشاء أول موقع إلكتروني لك</p>
                  <a
                    href="/wizard"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    إنشاء موقعي الأول
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{project.business_name}</h3>
                            {getStatusBadge(project.status)}
                          </div>
                          <p className="text-gray-600 mb-2">{project.name}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>نوع النشاط: {project.business_type === 'company' ? 'شركة' : project.business_type === 'store' ? 'متجر' : 'صفحة هبوط'}</span>
                            <span>تاريخ الإنشاء: {new Date(project.created_at).toLocaleDateString('ar-EG')}</span>
                          </div>
                          
                          {project.trial_expires_at && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-yellow-800 font-medium">
                                  فترة التجربة تنتهي خلال: {getTrialTimeRemaining(project.trial_expires_at)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {project.template && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 mr-4">
                            <img 
                              src={`/storage/${project.template.preview_image}`} 
                              alt={project.template.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {project.status === 'active' && project.wp_admin_url && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-4">
                            <a
                              href={`https://${project.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              زيارة الموقع
                            </a>
                            <a
                              href={project.wp_admin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              لوحة التحكم
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">إحصائيات سريعة</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">إجمالي المشاريع</span>
                  <span className="text-2xl font-bold text-blue-600">{projects.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المشاريع النشطة</span>
                  <span className="text-2xl font-bold text-green-600">
                    {projects.filter(p => p.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">قيد الإنشاء</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {projects.filter(p => p.status === 'generating').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">روابط مفيدة</h3>
              <div className="space-y-3">
                <a
                  href="/billing"
                  className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-blue-600 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3z" />
                  </svg>
                  <span className="text-gray-700 font-medium">إدارة الفواتير</span>
                </a>
                
                <a
                  href="/settings"
                  className="flex items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl hover:from-green-100 hover:to-blue-100 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-green-600 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700 font-medium">إعدادات الحساب</span>
                </a>
              </div>
            </div>

            {subscription && (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">اشتراكي الحالي</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الباقة</span>
                    <span className="font-semibold text-gray-900">{subscription.plan.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الحالة</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">تاريخ التجديد</span>
                    <span className="text-gray-900">
                      {new Date(subscription.current_period_end).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
