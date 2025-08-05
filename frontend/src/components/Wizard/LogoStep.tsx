import React, { useState, useRef } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { aiApi, projectApi } from '../../services/api';

const LogoStep: React.FC = () => {
  const { businessInfo, project, setProject, nextStep, prevStep } = useWizard();
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(project?.logo_path || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('حجم الملف كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('يرجى اختيار ملف صورة صحيح');
        return;
      }

      setLogoFile(file);
      setError('');

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateLogo = async () => {
    if (!businessInfo) return;
    
    setIsGenerating(true);
    setError('');

    try {
      const response = await aiApi.generateLogo({
        business_name: businessInfo.business_name,
        business_type: businessInfo.business_type,
        style: 'modern',
        colors: project?.colors ? [project.colors.primary, project.colors.secondary] : undefined,
      });

      if (response.data.logo_url) {
        setLogoPreview(response.data.logo_url);
        setLogoFile(null); // Clear file since we have generated logo
      }
    } catch (err: any) {
      setError('فشل في توليد الشعار. يرجى المحاولة مرة أخرى أو رفع شعار يدوياً.');
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadLogo = async () => {
    if (!logoFile || !project?.id) return;

    setIsUploading(true);
    setError('');

    try {
      const response = await projectApi.uploadLogo(project.id, logoFile);
      if (response.data) {
        setProject({ ...project, logo_path: response.data.logo_path });
      }
    } catch (err: any) {
      setError('فشل في رفع الشعار. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = async () => {
    if (logoFile && project?.id) {
      await uploadLogo();
    }

    if (project && logoPreview) {
      setProject({ ...project, logo_path: logoPreview });
    }

    nextStep();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 font-cairo">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent mb-3">
              شعار الموقع
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              ارفع شعار شركتك أو دع الذكاء الاصطناعي ينشئ شعاراً احترافياً لك
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Logo Preview Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="ml-3">🎨</span>
                معاينة الشعار
              </h3>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-300 min-h-[300px] flex items-center justify-center">
                {logoPreview ? (
                  <div className="text-center">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="max-w-full max-h-64 mx-auto rounded-xl shadow-lg"
                    />
                    <p className="text-gray-600 mt-4 text-sm">معاينة الشعار الحالي</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">لا يوجد شعار محدد</p>
                    <p className="text-gray-400 text-sm">ارفع شعاراً أو قم بتوليد واحد بالذكاء الاصطناعي</p>
                  </div>
                )}
              </div>
            </div>

            {/* Logo Options Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="ml-3">⚡</span>
                خيارات الشعار
              </h3>

              {/* Upload Logo Option */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-emerald-300 transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <svg className="w-6 h-6 ml-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  رفع شعار موجود
                </h4>
                <p className="text-gray-600 mb-4">
                  ارفع شعار شركتك الحالي بصيغة PNG أو JPG
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-4 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-3"></div>
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      اختيار ملف الشعار
                    </>
                  )}
                </button>
                
                {logoFile && (
                  <div className="mt-3 text-sm text-gray-600 bg-emerald-50 p-3 rounded-xl">
                    <span className="font-medium">الملف المحدد:</span> {logoFile.name}
                  </div>
                )}
              </div>

              {/* Generate Logo Option */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-teal-300 transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <svg className="w-6 h-6 ml-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  توليد شعار بالذكاء الاصطناعي
                </h4>
                <p className="text-gray-600 mb-4">
                  دع الذكاء الاصطناعي ينشئ شعاراً احترافياً بناءً على معلومات شركتك
                </p>
                
                <button
                  type="button"
                  onClick={generateLogo}
                  disabled={isGenerating || !businessInfo}
                  className="w-full group bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-4 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-3"></div>
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 ml-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      توليد شعار ذكي
                    </>
                  )}
                </button>
              </div>

              {/* Skip Option */}
              <div className="bg-gray-50/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <svg className="w-6 h-6 ml-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  تخطي هذه الخطوة
                </h4>
                <p className="text-gray-600 text-sm">
                  يمكنك إضافة الشعار لاحقاً من لوحة تحكم الموقع
                </p>
              </div>
            </div>
          </div>

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
              disabled={isUploading || isGenerating}
              className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center"
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

export default LogoStep;
