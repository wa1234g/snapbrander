import React, { useState, useEffect } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { aiApi } from '../../services/api';
import { ColorScheme } from '../../types';

interface ColorPalette extends ColorScheme {
  id: string;
  name: string;
}

const ColorSelectionStep: React.FC = () => {
  const { businessInfo, project, setProject, nextStep, prevStep } = useWizard();
  
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    generateColorPalettes();
  }, [businessInfo]);

  const generateColorPalettes = async () => {
    if (!businessInfo) return;
    
    setIsGenerating(true);
    setError('');

    try {
      const response = await aiApi.generateColors({
        business_type: businessInfo.business_type,
        industry: businessInfo.industry,
        mood: 'professional',
      });

      if (response.data.colors) {
        const palette: ColorPalette = {
          id: '1',
          name: 'الألوان المولدة بالذكاء الاصطناعي',
          ...response.data.colors
        };
        setColorPalettes([palette, ...getDefaultPalettes()]);
      } else {
        setColorPalettes(getDefaultPalettes());
      }
    } catch (err: any) {
      setError('فشل في توليد الألوان. سيتم عرض الألوان الافتراضية.');
      setColorPalettes(getDefaultPalettes());
    } finally {
      setIsGenerating(false);
    }
  };

  const getDefaultPalettes = (): ColorPalette[] => [
    {
      id: '1',
      name: 'الأزرق الاحترافي',
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA',
      background: '#F8FAFC',
      text: '#1F2937'
    },
    {
      id: '2',
      name: 'الأخضر الطبيعي',
      primary: '#10B981',
      secondary: '#047857',
      accent: '#34D399',
      background: '#F0FDF4',
      text: '#1F2937'
    },
    {
      id: '3',
      name: 'البنفسجي الإبداعي',
      primary: '#8B5CF6',
      secondary: '#5B21B6',
      accent: '#A78BFA',
      background: '#FAF5FF',
      text: '#1F2937'
    },
    {
      id: '4',
      name: 'البرتقالي الحيوي',
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FCD34D',
      background: '#FFFBEB',
      text: '#1F2937'
    }
  ];

  const handlePaletteSelect = (palette: ColorPalette) => {
    setSelectedPalette(palette);
    setError('');
  };

  const handleNext = () => {
    if (!selectedPalette) {
      setError('يرجى اختيار لوحة ألوان للموقع');
      return;
    }

    if (project) {
      const { id, name, ...colors } = selectedPalette;
      setProject({ ...project, colors });
    }
    nextStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-12 px-4 font-cairo">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-rose-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-orange-800 bg-clip-text text-transparent mb-3">
              اختيار ألوان الموقع
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              اختر لوحة الألوان المناسبة لموقعك من الألوان المولدة بالذكاء الاصطناعي
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

          {isGenerating ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">جاري توليد الألوان...</h3>
              <p className="text-gray-600">الذكاء الاصطناعي يختار أفضل الألوان لنشاطك التجاري</p>
            </div>
          ) : (
            <>
              {/* Generate New Colors Button */}
              <div className="flex justify-center mb-8">
                <button
                  type="button"
                  onClick={generateColorPalettes}
                  disabled={isGenerating}
                  className="group bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <svg className="w-5 h-5 ml-3 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  توليد ألوان جديدة
                </button>
              </div>

              {/* Color Palettes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {colorPalettes.map((palette) => (
                  <div
                    key={palette.id}
                    onClick={() => handlePaletteSelect(palette)}
                    className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 ${
                      selectedPalette?.id === palette.id
                        ? 'border-rose-500 ring-4 ring-rose-500/20'
                        : 'border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    {/* Color Preview */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-rose-600 transition-colors">
                          {palette.name}
                        </h3>
                        {selectedPalette?.id === palette.id && (
                          <div className="bg-rose-500 text-white rounded-full p-2 shadow-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Color Swatches */}
                      <div className="grid grid-cols-5 gap-3 mb-4">
                        <div className="text-center">
                          <div
                            className="w-12 h-12 rounded-xl shadow-md mx-auto mb-2 border-2 border-white"
                            style={{ backgroundColor: palette.primary }}
                          ></div>
                          <span className="text-xs text-gray-600 font-medium">أساسي</span>
                        </div>
                        <div className="text-center">
                          <div
                            className="w-12 h-12 rounded-xl shadow-md mx-auto mb-2 border-2 border-white"
                            style={{ backgroundColor: palette.secondary }}
                          ></div>
                          <span className="text-xs text-gray-600 font-medium">ثانوي</span>
                        </div>
                        <div className="text-center">
                          <div
                            className="w-12 h-12 rounded-xl shadow-md mx-auto mb-2 border-2 border-white"
                            style={{ backgroundColor: palette.accent }}
                          ></div>
                          <span className="text-xs text-gray-600 font-medium">مميز</span>
                        </div>
                        <div className="text-center">
                          <div
                            className="w-12 h-12 rounded-xl shadow-md mx-auto mb-2 border-2 border-white"
                            style={{ backgroundColor: palette.background }}
                          ></div>
                          <span className="text-xs text-gray-600 font-medium">خلفية</span>
                        </div>
                        <div className="text-center">
                          <div
                            className="w-12 h-12 rounded-xl shadow-md mx-auto mb-2 border-2 border-white"
                            style={{ backgroundColor: palette.text }}
                          ></div>
                          <span className="text-xs text-gray-600 font-medium">نص</span>
                        </div>
                      </div>

                      {/* Preview Card */}
                      <div
                        className="rounded-xl p-4 shadow-inner"
                        style={{ backgroundColor: palette.background }}
                      >
                        <div
                          className="text-lg font-bold mb-2"
                          style={{ color: palette.text }}
                        >
                          معاينة التصميم
                        </div>
                        <div
                          className="text-sm mb-3"
                          style={{ color: palette.text, opacity: 0.8 }}
                        >
                          هذا مثال على شكل النص والألوان في موقعك
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                            style={{ backgroundColor: palette.primary }}
                          >
                            زر أساسي
                          </button>
                          <button
                            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                            style={{ backgroundColor: palette.accent }}
                          >
                            زر مميز
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
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
              disabled={!selectedPalette}
              className="group bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center"
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

export default ColorSelectionStep;
