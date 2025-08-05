import React, { useState, useEffect } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { useTranslation } from 'react-i18next';
import { aiApi, projectApi } from '../../services/api';
import { BusinessInfo } from '../../types';

const BusinessInfoStep: React.FC = () => {
  const { businessInfo, setBusinessInfo, setProject, nextStep } = useWizard();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<BusinessInfo>({
    name: '',
    business_name: '',
    business_type: 'company',
    industry: '',
    description: '',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('BusinessInfo from context:', businessInfo);
    if (businessInfo && Object.keys(businessInfo).length > 0) {
      console.log('Setting form data from context:', businessInfo);
      setFormData(prev => ({
        ...prev,
        ...businessInfo,
        business_type: businessInfo.business_type || 'company'
      }));
    } else {
      console.log('No businessInfo in context, using default state');
    }
  }, [businessInfo]);

  useEffect(() => {
    console.log('Form data state updated:', formData);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    const finalFormData = {
      ...formData,
      business_type: formData.business_type || 'company'
    };

    console.log('Form data before submission:', finalFormData);
    console.log('Business type value:', finalFormData.business_type);

    if (!finalFormData.name || !finalFormData.business_name || !finalFormData.business_type) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      setIsGenerating(false);
      return;
    }

    try {
      setBusinessInfo(finalFormData);

      const projectData = {
        name: finalFormData.name,
        business_name: finalFormData.business_name,
        business_type: finalFormData.business_type,
        description: finalFormData.description,
      };
      
      console.log('Project data being sent:', projectData);

      const projectResponse = await projectApi.init(projectData);

      setProject(projectResponse.data);

      if (!finalFormData.description) {
        try {
          const aiResponse = await aiApi.generateDescription({
            business_name: finalFormData.business_name,
            business_type: finalFormData.business_type,
            industry: finalFormData.industry,
            language: 'ar',
          });

          if (aiResponse.data.description) {
            const updatedFormData = { ...finalFormData, description: aiResponse.data.description };
            setFormData(updatedFormData);
            setBusinessInfo(updatedFormData);
          }
        } catch (aiErr) {
          console.log('AI description generation failed, continuing without it');
        }
      }

      nextStep();
    } catch (err: any) {
      console.error('Project init error:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء المشروع');
    } finally {
      setIsGenerating(false);
    }
  };

  const businessTypes = [
    { value: 'company', label: t('business.company') },
    { value: 'store', label: t('business.store') },
    { value: 'landing', label: t('business.landing') },
  ];

  const industries = [
    'التكنولوجيا',
    'التجارة الإلكترونية',
    'الخدمات المالية',
    'الصحة والطب',
    'التعليم',
    'العقارات',
    'المطاعم والأغذية',
    'الموضة والأزياء',
    'السفر والسياحة',
    'الرياضة واللياقة',
    'الفنون والثقافة',
    'أخرى',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 font-cairo">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent mb-3">
              معلومات النشاط التجاري
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              أدخل المعلومات الأساسية لنشاطك التجاري لنبدأ في إنشاء موقعك الإلكتروني المميز
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

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group">
              <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="ml-3">🚀</span>
                اسم المشروع
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 text-lg"
                  placeholder="مثال: موقع شركة التقنية المتقدمة"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            <div className="group">
              <label htmlFor="business_name" className="block text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="ml-3">🏢</span>
                اسم النشاط التجاري
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  required
                  value={formData.business_name}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 text-lg"
                  placeholder="مثال: شركة التقنية المتقدمة"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            <div className="group">
              <label htmlFor="business_type" className="block text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="ml-3">🎯</span>
                نوع النشاط التجاري
              </label>
              <div className="relative">
                <select
                  id="business_type"
                  name="business_type"
                  required
                  value={formData.business_type || 'company'}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 text-lg appearance-none"
                >
                  {businessTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group">
              <label htmlFor="industry" className="block text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="ml-3">🏭</span>
                مجال العمل
              </label>
              <div className="relative">
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 text-lg appearance-none"
                >
                  <option value="">اختر المجال</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group">
              <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="ml-3">📋</span>
                وصف النشاط (اختياري)
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 resize-none text-lg leading-relaxed"
                  placeholder="اكتب وصفاً مختصراً عن نشاطك التجاري، أهدافه، والخدمات التي يقدمها، أو اتركه فارغاً ليقوم الذكاء الاصطناعي بتوليده تلقائياً..."
                />
                <div className="absolute bottom-4 left-4 text-sm text-gray-400">
                  {formData.description.length} حرف
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isGenerating}
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-4 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-3"></div>
                    جاري المعالجة بالذكاء الاصطناعي...
                  </>
                ) : (
                  <>
                    ابدأ إنشاء موقعي
                    <svg className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
