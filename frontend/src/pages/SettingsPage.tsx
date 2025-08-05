import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface UserSettings {
  name: string;
  email: string;
  phone?: string;
  country: string;
  language: string;
  currency: string;
  timezone: string;
}

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    phone: '',
    country: 'EG',
    language: 'ar',
    currency: 'EGP',
    timezone: 'Africa/Cairo',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setSettings({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || 'EG',
        language: user.language || 'ar',
        currency: user.currency || 'EGP',
        timezone: user.timezone || 'Africa/Cairo',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const response = await api.put('/user/profile', settings);
      updateUser(response.data.user);
      setMessage('تم حفظ الإعدادات بنجاح');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">إعدادات الحساب</h1>
          <p className="text-gray-600">إدارة معلومات حسابك وتفضيلاتك</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-4 rounded-2xl ${
                  message.includes('نجاح') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={settings.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الدولة
                  </label>
                  <select
                    name="country"
                    value={settings.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="EG">مصر</option>
                    <option value="SA">السعودية</option>
                    <option value="AE">الإمارات</option>
                    <option value="KW">الكويت</option>
                    <option value="QA">قطر</option>
                    <option value="BH">البحرين</option>
                    <option value="OM">عمان</option>
                    <option value="JO">الأردن</option>
                    <option value="LB">لبنان</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اللغة
                  </label>
                  <select
                    name="language"
                    value={settings.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملة
                  </label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="EUR">يورو (EUR)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300"
                >
                  {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
