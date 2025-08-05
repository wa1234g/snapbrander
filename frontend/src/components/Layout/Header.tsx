import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">SnapBrander</h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            {user ? (
              <>
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  لوحة التحكم
                </a>
                <a href="/billing" className="text-gray-700 hover:text-blue-600 transition-colors">
                  الفواتير
                </a>
                {user.role === 'admin' && (
                  <>
                    <a href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                      إدارة النظام
                    </a>
                    <a href="/analytics" className="text-gray-700 hover:text-blue-600 transition-colors">
                      التحليلات
                    </a>
                  </>
                )}
              </>
            ) : (
              <>
                <a href="/templates" className="text-gray-700 hover:text-blue-600 transition-colors">
                  القوالب
                </a>
                <a href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                  الأسعار
                </a>
                <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                  من نحن
                </a>
                <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                  تواصل معنا
                </a>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              {i18n.language === 'ar' ? 'English' : 'العربية'}
            </button>

            {user && (
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <span className="text-gray-700 text-sm">
                  مرحباً، {user.name}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {t('nav.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
