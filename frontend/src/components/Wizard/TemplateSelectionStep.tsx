import React, { useState, useEffect } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { templateApi } from '../../services/api';

import { Template } from '../../types';

const TemplateSelectionStep: React.FC = () => {
  const { businessInfo, selectedTemplate, setSelectedTemplate, nextStep, prevStep } = useWizard();
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedCategory, businessInfo]);

  const fetchTemplates = async () => {
    try {
      const response = await templateApi.list();
      setTemplates(response.data);
    } catch (err: any) {
      setError('فشل في تحميل القوالب');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (businessInfo?.business_type) {
      filtered = filtered.filter(template => 
        template.business_types?.includes(businessInfo.business_type)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleNext = () => {
    if (!selectedTemplate) {
      setError('يرجى اختيار قالب للمتابعة');
      return;
    }
    nextStep();
  };

  const categories = [
    { value: 'all', label: 'جميع القوالب' },
    { value: 'business', label: 'أعمال' },
    { value: 'ecommerce', label: 'متجر إلكتروني' },
    { value: 'portfolio', label: 'معرض أعمال' },
    { value: 'blog', label: 'مدونة' },
    { value: 'landing', label: 'صفحة هبوط' },
  ];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="mr-4 text-lg">جاري تحميل القوالب...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            اختيار القالب
          </h2>
          <p className="text-gray-600">
            اختر القالب المناسب لنوع نشاطك التجاري
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg ${
                selectedTemplate?.id === template.id
                  ? 'border-primary-600 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-video bg-gray-100 relative">
                {template.preview_image ? (
                  <img
                    src={template.preview_image}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{template.description}</p>
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {template.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg">لا توجد قوالب متاحة لهذا التصنيف</p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-8 py-3 rounded-md font-medium"
          >
            السابق
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedTemplate}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
