import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WizardStep, BusinessInfo, Project, Template, ColorScheme, Module } from '../types';
import { draftApi } from '../services/api';

interface WizardContextType {
  currentStep: number;
  steps: WizardStep[];
  businessInfo: BusinessInfo | null;
  project: Project | null;
  selectedTemplate: Template | null;
  selectedColors: ColorScheme | null;
  selectedModules: Module[];
  logoFile: File | null;
  logoUrl: string | null;
  isGenerating: boolean;
  setCurrentStep: (step: number) => void;
  setBusinessInfo: (info: BusinessInfo) => void;
  setProject: (project: Project) => void;
  setSelectedTemplate: (template: Template) => void;
  setSelectedColors: (colors: ColorScheme) => void;
  setSelectedModules: (modules: Module[]) => void;
  setLogoFile: (file: File | null) => void;
  setLogoUrl: (url: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

interface WizardProviderProps {
  children: ReactNode;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedColors, setSelectedColors] = useState<ColorScheme | null>(null);
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps: WizardStep[] = [
    {
      id: 0,
      title: 'معلومات النشاط',
      description: 'أدخل معلومات نشاطك التجاري',
      component: () => null,
      isComplete: !!businessInfo,
    },
    {
      id: 1,
      title: 'وصف المشروع',
      description: 'مراجعة وتعديل الوصف المُولد بالذكاء الاصطناعي',
      component: () => null,
      isComplete: !!project?.description,
    },
    {
      id: 2,
      title: 'اختيار القالب',
      description: 'اختر القالب المناسب لموقعك',
      component: () => null,
      isComplete: !!selectedTemplate,
    },
    {
      id: 3,
      title: 'الألوان',
      description: 'اختر الألوان المناسبة لعلامتك التجارية',
      component: () => null,
      isComplete: !!selectedColors,
    },
    {
      id: 4,
      title: 'الشعار',
      description: 'ارفع شعارك أو اطلب توليد شعار بالذكاء الاصطناعي',
      component: () => null,
      isComplete: !!(logoFile || logoUrl),
    },
    {
      id: 5,
      title: 'الموديولات',
      description: 'اختر الميزات الإضافية لموقعك',
      component: () => null,
      isComplete: true,
    },
    {
      id: 6,
      title: 'إنشاء الموقع',
      description: 'مراجعة نهائية وإنشاء موقعك',
      component: () => null,
      isComplete: false,
    },
  ];

  const saveDraft = async () => {
    try {
      const stepData = {
        businessInfo,
        project,
        selectedTemplate,
        selectedColors,
        selectedModules,
        logoUrl,
      };

      await draftApi.save({
        current_step: currentStep,
        step_data: stepData,
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const loadDraft = async () => {
    try {
      const response = await draftApi.resume();
      const draft = response.data;

      if (draft && draft.step_data) {
        const stepData = draft.step_data;
        setCurrentStep(draft.current_step);
        setBusinessInfo(stepData.businessInfo || null);
        setProject(stepData.project || null);
        setSelectedTemplate(stepData.selectedTemplate || null);
        setSelectedColors(stepData.selectedColors || null);
        setSelectedModules(stepData.selectedModules || []);
        setLogoUrl(stepData.logoUrl || null);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setBusinessInfo(null);
    setProject(null);
    setSelectedTemplate(null);
    setSelectedColors(null);
    setSelectedModules([]);
    setLogoFile(null);
    setLogoUrl(null);
    setIsGenerating(false);
  };

  useEffect(() => {
    loadDraft();
  }, []);

  useEffect(() => {
    if (businessInfo || project || selectedTemplate || selectedColors) {
      saveDraft();
    }
  }, [businessInfo, project, selectedTemplate, selectedColors, selectedModules, currentStep]);

  const value: WizardContextType = {
    currentStep,
    steps,
    businessInfo,
    project,
    selectedTemplate,
    selectedColors,
    selectedModules,
    logoFile,
    logoUrl,
    isGenerating,
    setCurrentStep,
    setBusinessInfo,
    setProject,
    setSelectedTemplate,
    setSelectedColors,
    setSelectedModules,
    setLogoFile,
    setLogoUrl,
    setIsGenerating,
    saveDraft,
    loadDraft,
    nextStep,
    prevStep,
    resetWizard,
  };

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
};
