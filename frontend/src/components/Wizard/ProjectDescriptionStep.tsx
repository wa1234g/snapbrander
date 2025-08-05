import React, { useState, useEffect } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { aiApi } from '../../services/api';

const ProjectDescriptionStep: React.FC = () => {
  const { businessInfo, project, setProject, nextStep, prevStep } = useWizard();
  
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4 font-cairo">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent mb-3">
              وصف المشروع
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              اكتب وصفاً تفصيلياً لمشروعك أو دع الذكاء الاصطناعي يولده لك بناءً على معلومات نشاطك التجاري
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

          <div className="space-y-8">
            <div className="group">
              <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="ml-3">📝</span>
                وصف المشروع التفصيلي
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  rows={10}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 resize-none text-lg leading-relaxed"
                  placeholder="اكتب وصفاً شاملاً لمشروعك، أهدافه، والخدمات التي يقدمها، والجمهور المستهدف، وما يميزك عن المنافسين..."
                />
                <div className="absolute bottom-4 left-4 text-sm text-gray-400">
                  {description.length} حرف
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={generateDescription}
                disabled={isGenerating || !businessInfo}
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-3"></div>
                    جاري التوليد بالذكاء الاصطناعي...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 ml-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    توليد وصف ذكي تلقائياً
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                className="group bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-bold transform hover:scale-105 transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                السابق
              </button>
              
              <button
                type="button"
                onClick={handleNext}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center"
              >
                التالي
                <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDescriptionStep;
