import React, { useState, useEffect } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { moduleApi } from '../../services/api';
import { Module } from '../../types';

const ModulesStep: React.FC = () => {
  const { project, setProject, nextStep, prevStep } = useWizard();
  
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>(project?.modules || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await moduleApi.list();
      if (response.data) {
        setModules(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      setError('فشل في تحميل الموديولات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModule = (moduleId: number) => {
    const moduleIdStr = moduleId.toString();
    setSelectedModules(prev => 
      prev.includes(moduleIdStr)
        ? prev.filter(id => id !== moduleIdStr)
        : [...prev, moduleIdStr]
    );
  };

  const handleNext = () => {
    if (project) {
      setProject({ ...project, modules: selectedModules });
    }
    nextStep();
  };

  const getModuleIcon = (category: string) => {
    switch (category) {
      case 'communication':
        return '💬';
      case 'ecommerce':
        return '🛒';
      case 'analytics':
        return '📊';
      case 'social':
        return '📱';
      case 'booking':
        return '📅';
      default:
        return '🔧';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'communication':
        return 'التواصل';
      case 'ecommerce':
        return 'التجارة الإلكترونية';
      case 'analytics':
        return 'التحليلات';
      case 'social':
        return 'وسائل التواصل';
      case 'booking':
        return 'الحجوزات';
      default:
        return 'عام';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 py-12 px-4 font-cairo flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">جاري تحميل الموديولات...</h2>
          <p className="text-gray-600">نحضر لك أفضل الإضافات لموقعك</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 py-12 px-4 font-cairo">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-fuchsia-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-fuchsia-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-800 bg-clip-text text-transparent mb-3">
              الموديولات الإضافية
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              اختر الموديولات التي تريد إضافتها لموقعك لتعزيز وظائفه وتحسين تجربة المستخدمين
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

          {/* Selected Modules Summary */}
          {selectedModules.length > 0 && (
            <div className="mb-8 bg-violet-50/80 backdrop-blur border border-violet-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-violet-800 mb-3 flex items-center">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                الموديولات المحددة ({selectedModules.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {modules
                  .filter(module => selectedModules.includes(module.id.toString()))
                  .map(module => (
                    <span
                      key={module.id}
                      className="inline-flex items-center px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
                    >
                      <span className="ml-2">{getModuleIcon(module.category)}</span>
                      {module.name}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {modules.map((module) => (
              <div
                key={module.id}
                onClick={() => toggleModule(module.id)}
                className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 ${
                  selectedModules.includes(module.id.toString())
                    ? 'border-violet-500 ring-4 ring-violet-500/20'
                    : 'border-gray-200 hover:border-violet-300'
                }`}
              >
                <div className="p-6">
                  {/* Module Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">
                        {getModuleIcon(module.category)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-violet-600 transition-colors">
                          {module.name}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {getCategoryName(module.category)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedModules.includes(module.id.toString())
                        ? 'bg-violet-500 border-violet-500'
                        : 'border-gray-300 group-hover:border-violet-400'
                    }`}>
                      {selectedModules.includes(module.id.toString()) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Module Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {module.description}
                  </p>

                  {/* Module Features */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {module.is_free ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          مجاني
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {module.price} ج.م
                        </span>
                      )}
                    </div>
                    
                    {selectedModules.includes(module.id.toString()) && (
                      <span className="text-violet-600 text-sm font-medium">
                        محدد ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {modules.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد موديولات متاحة</h3>
              <p className="text-gray-600">سيتم إضافة المزيد من الموديولات قريباً</p>
            </div>
          )}

          {/* Navigation */}
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
              className="group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center"
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
  );
};

export default ModulesStep;
