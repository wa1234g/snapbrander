import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      'nav.dashboard': 'لوحة التحكم',
      'nav.projects': 'المشاريع',
      'nav.templates': 'القوالب',
      'nav.settings': 'الإعدادات',
      'nav.logout': 'تسجيل الخروج',

      'auth.login': 'تسجيل الدخول',
      'auth.register': 'إنشاء حساب',
      'auth.email': 'البريد الإلكتروني',
      'auth.password': 'كلمة المرور',
      'auth.confirmPassword': 'تأكيد كلمة المرور',
      'auth.name': 'الاسم',
      'auth.phone': 'رقم الهاتف',
      'auth.forgotPassword': 'نسيت كلمة المرور؟',

      'wizard.businessInfo': 'معلومات النشاط',
      'wizard.projectDescription': 'وصف المشروع',
      'wizard.templateSelection': 'اختيار القالب',
      'wizard.colorSelection': 'اختيار الألوان',
      'wizard.logoStep': 'الشعار',
      'wizard.modulesStep': 'الموديولات',
      'wizard.generationStep': 'إنشاء الموقع',

      'business.name': 'اسم النشاط التجاري',
      'business.type': 'نوع النشاط',
      'business.company': 'شركة',
      'business.store': 'متجر إلكتروني',
      'business.landing': 'صفحة هبوط',
      'business.industry': 'المجال',
      'business.description': 'وصف النشاط',

      'common.next': 'التالي',
      'common.previous': 'السابق',
      'common.save': 'حفظ',
      'common.cancel': 'إلغاء',
      'common.loading': 'جاري التحميل...',
      'common.error': 'حدث خطأ',
      'common.success': 'تم بنجاح',
      'common.generate': 'توليد',
      'common.upload': 'رفع',
      'common.select': 'اختيار',
      'common.preview': 'معاينة',

      'currency.egp': 'جنيه مصري',
      'currency.usd': 'دولار أمريكي',
      'currency.eur': 'يورو',

      'trial.remaining': 'متبقي من التجربة المجانية',
      'trial.expired': 'انتهت فترة التجربة',
      'trial.subscribe': 'اشترك الآن',
    },
  },
  en: {
    translation: {
      'nav.dashboard': 'Dashboard',
      'nav.projects': 'Projects',
      'nav.templates': 'Templates',
      'nav.settings': 'Settings',
      'nav.logout': 'Logout',

      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.name': 'Name',
      'auth.phone': 'Phone',
      'auth.forgotPassword': 'Forgot Password?',

      'wizard.businessInfo': 'Business Info',
      'wizard.projectDescription': 'Project Description',
      'wizard.templateSelection': 'Template Selection',
      'wizard.colorSelection': 'Color Selection',
      'wizard.logoStep': 'Logo',
      'wizard.modulesStep': 'Modules',
      'wizard.generationStep': 'Site Generation',

      'business.name': 'Business Name',
      'business.type': 'Business Type',
      'business.company': 'Company',
      'business.store': 'E-commerce Store',
      'business.landing': 'Landing Page',
      'business.industry': 'Industry',
      'business.description': 'Business Description',

      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.generate': 'Generate',
      'common.upload': 'Upload',
      'common.select': 'Select',
      'common.preview': 'Preview',

      'currency.egp': 'Egyptian Pound',
      'currency.usd': 'US Dollar',
      'currency.eur': 'Euro',

      'trial.remaining': 'Trial Remaining',
      'trial.expired': 'Trial Expired',
      'trial.subscribe': 'Subscribe Now',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
