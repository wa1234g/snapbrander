import React, { useState, useEffect } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { useTranslation } from 'react-i18next';
import { aiApi } from '../../services/api';

const ProjectDescriptionStep: React.FC = () => {
  const { businessInfo, project, setProject, nextStep, prevStep } = useWizard();
  const { t } = useTranslation();
  
  const [description, setDescription] = useState(project?.description || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project?.description) {
      setDescription(project.description);
    }
  }, [project]);

  const generateDescription = async () => {
    if (!businessInfo) return;
    
    setIsGenerating(true);
    setError('');

    try {
      const response = await aiApi.generateDescription({
        business_name: businessInfo.business_name,
        business_type: businessInfo.business_type,
        industry: businessInfo.industry,
        language: 'ar',
      });

      if (response.data.description) {
        setDescription(response.data.description);
      }
    } catch (err: any) {
      setError('فشل في توليد الوصف. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (!description.trim()) {
      setError('يرجى إدخال وصف للمشروع');
      return;
    }

    if (project) {
      setProject({ ...project, description });
    }
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            وصف المشروع
          </h2>
          <p className="text-gray-600">
            اكتب وصفاً تفصيلياً لمشروعك أو دع الذكاء الاصطناعي يولده لك
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              وصف المشروع
            </label>
            <textarea
              id="description"
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="اكتب وصفاً شاملاً لمشروعك، أهدافه، والخدمات التي يقدمها..."
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={generateDescription}
              disabled={isGenerating || !businessInfo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري التوليد...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  توليد بالذكاء الاصطناعي
                </>
              )}
            </button>
          </div>

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
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-medium"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDescriptionStep;
