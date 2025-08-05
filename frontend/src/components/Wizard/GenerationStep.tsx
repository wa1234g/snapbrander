import React, { useState } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { projectApi } from '../../services/api';

const GenerationStep: React.FC = () => {
  const { project, setProject } = useWizard();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [siteDetails, setSiteDetails] = useState<any>(null);
  const [error, setError] = useState('');

  const generateSite = async () => {
    if (!project?.id) return;
    
    setIsGenerating(true);
    setError('');
    setGenerationProgress(0);

    try {
      const steps = [
        'إنشاء قاعدة البيانات...',
        'تثبيت WordPress...',
        'تطبيق القالب...',
        'تخصيص الألوان...',
        'إضافة الشعار...',
        'توليد المحتوى بالذكاء الاصطناعي...',
        'تثبيت الموديولات...',
        'إعداد الإعدادات النهائية...',
        'تم إنشاء موقعك بنجاح! 🎉'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setGenerationProgress(((i + 1) / steps.length) * 100);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const response = await projectApi.generateSite(project.id);
      
      if (response.data) {
        setSiteDetails(response.data);
        setProject({ ...project, ...response.data });
        setIsComplete(true);
      }
    } catch (err: any) {
      setError('فشل في إنشاء الموقع. يرجى المحاولة مرة أخرى.');
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isComplete && siteDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 font-cairo">
        {/* Success Animation Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                🎉 تم إنشاء موقعك بنجاح!
              </h2>
              <p className="text-gray-600 text-xl">
                موقعك الجديد جاهز الآن ويمكنك الوصول إليه والبدء في استخدامه
              </p>
            </div>

            {/* Site Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Site Access */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  رابط الموقع
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">عنوان الموقع:</label>
                    <div className="flex items-center mt-1">
                      <input
                        type="text"
                        value={siteDetails.site_url || `https://${project?.subdomain || 'your-site'}.fureraa.com`}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(siteDetails.site_url)}
                        className="mr-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        نسخ
                      </button>
                    </div>
                  </div>
                  <a
                    href={siteDetails.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    زيارة الموقع
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* WordPress Admin */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  لوحة تحكم WordPress
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">اسم المستخدم:</label>
                    <div className="flex items-center mt-1">
                      <input
                        type="text"
                        value={siteDetails.wp_username || 'admin'}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(siteDetails.wp_username)}
                        className="mr-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        نسخ
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">كلمة المرور:</label>
                    <div className="flex items-center mt-1">
                      <input
                        type="password"
                        value={siteDetails.wp_password || '••••••••'}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(siteDetails.wp_password)}
                        className="mr-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        نسخ
                      </button>
                    </div>
                  </div>
                  <a
                    href={siteDetails.wp_admin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    دخول لوحة التحكم
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Trial Information */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 mb-8">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                فترة التجربة المجانية
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 mb-2">
                    يمكنك استخدام موقعك مجاناً لمدة <strong>72 ساعة</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    بعد انتهاء فترة التجربة، ستحتاج للاشتراك للاستمرار في استخدام الموقع
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">72</div>
                  <div className="text-sm text-gray-600">ساعة متبقية</div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">الخطوات التالية:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">تخصيص الموقع</h4>
                  <p className="text-sm text-gray-600">ادخل لوحة تحكم WordPress وخصص موقعك حسب احتياجاتك</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">إضافة المحتوى</h4>
                  <p className="text-sm text-gray-600">أضف صفحاتك ومنتجاتك ومحتواك الخاص</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">نشر الموقع</h4>
                  <p className="text-sm text-gray-600">اشترك في إحدى خططنا لنشر موقعك بشكل دائم</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 font-cairo">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-3">
              إنشاء موقعك الآن
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              جميع المعلومات جاهزة! اضغط على الزر أدناه لبدء إنشاء موقعك باستخدام الذكاء الاصطناعي
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50/80 backdrop-blur border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center">
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Project Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ملخص مشروعك:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">اسم المشروع:</span>
                <span className="mr-2 text-gray-800">{project?.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">نوع النشاط:</span>
                <span className="mr-2 text-gray-800">
                  {project?.business_type === 'company' ? 'شركة' : 
                   project?.business_type === 'store' ? 'متجر' : 'صفحة هبوط'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">القالب:</span>
                <span className="mr-2 text-gray-800">{project?.template?.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">الموديولات:</span>
                <span className="mr-2 text-gray-800">{project?.modules?.length || 0} موديول</span>
              </div>
            </div>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">جاري إنشاء موقعك...</h3>
                  <p className="text-gray-600">{currentStep}</p>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                
                <div className="text-center">
                  <span className="text-lg font-bold text-gray-800">{Math.round(generationProgress)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          {!isGenerating && !isComplete && (
            <div className="text-center">
              <button
                onClick={generateSite}
                disabled={!project?.id}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-6 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center mx-auto"
              >
                <svg className="w-8 h-8 ml-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                إنشاء موقعي الآن
              </button>
              <p className="text-gray-500 text-sm mt-4">
                ستستغرق العملية حوالي 2-3 دقائق
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerationStep;
