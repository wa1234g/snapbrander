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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('wizard.businessInfo')}
          </h2>
          <p className="text-gray-600">
            أدخل معلومات نشاطك التجاري لنبدأ في إنشاء موقعك الإلكتروني
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              اسم المشروع
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="مثال: موقع شركة التقنية المتقدمة"
            />
          </div>

          <div>
            <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
              {t('business.name')}
            </label>
            <input
              type="text"
              id="business_name"
              name="business_name"
              required
              value={formData.business_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="مثال: شركة التقنية المتقدمة"
            />
          </div>

          <div>
            <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 mb-2">
              {t('business.type')}
            </label>
            <select
              id="business_type"
              name="business_type"
              required
              value={formData.business_type || 'company'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              {t('business.industry')}
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">اختر المجال</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              {t('business.description')} (اختياري)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="اكتب وصفاً مختصراً عن نشاطك التجاري أو اتركه فارغاً ليقوم الذكاء الاصطناعي بتوليده"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري المعالجة...
                </>
              ) : (
                t('common.next')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
