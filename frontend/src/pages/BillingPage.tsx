import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Plan {
  id: number;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  features: string[];
  is_popular: boolean;
}

interface Invoice {
  id: number;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  issued_at: string;
  due_at: string;
  paid_at?: string;
}

interface Subscription {
  id: number;
  status: string;
  billing_cycle: string;
  current_period_end: string;
  plan: Plan;
}

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const [plansResponse, invoicesResponse, subscriptionResponse] = await Promise.all([
        api.get('/payments/plans'),
        api.get('/payments/invoices'),
        api.get('/subscriptions'),
      ]);

      setPlans(plansResponse.data);
      setInvoices(invoicesResponse.data.data || []);
      setSubscription(subscriptionResponse.data);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    setIsProcessing(true);
    try {
      const paymentIntentResponse = await api.post('/payments/create-payment-intent', {
        plan_id: planId,
        billing_cycle: selectedBillingCycle,
      });

      const confirmResponse = await api.post('/payments/confirm-payment', {
        payment_intent_id: paymentIntentResponse.data.payment_intent.id,
        plan_id: planId,
        billing_cycle: selectedBillingCycle,
      });

      await api.post('/subscriptions', {
        plan_id: planId,
        billing_cycle: selectedBillingCycle,
        payment_id: confirmResponse.data.payment.id,
      });

      await fetchBillingData();
      alert('تم الاشتراك بنجاح!');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'مدفوعة', color: 'bg-green-100 text-green-800' },
      pending: { label: 'معلقة', color: 'bg-yellow-100 text-yellow-800' },
      overdue: { label: 'متأخرة', color: 'bg-red-100 text-red-800' },
      cancelled: { label: 'ملغية', color: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الفواتير...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">إدارة الفواتير والاشتراكات</h1>
          <p className="text-gray-600">اختر الباقة المناسبة لك وأدر فواتيرك</p>
        </div>

        {subscription && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">اشتراكك الحالي</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{subscription.plan.name}</h3>
                <p className="text-gray-600">الباقة الحالية</p>
              </div>
              <div className="text-center">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.status === 'active' ? 'نشط' : 'غير نشط'}
                </span>
                <p className="text-gray-600 mt-1">الحالة</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(subscription.current_period_end).toLocaleDateString('ar-EG')}
                </p>
                <p className="text-gray-600">تاريخ التجديد</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">اختر باقتك</h2>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedBillingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                شهري
              </button>
              <button
                onClick={() => setSelectedBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedBillingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                سنوي (خصم 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white/80 backdrop-blur-lg rounded-3xl p-6 border shadow-xl relative ${
                  plan.is_popular ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white/20'
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      الأكثر شعبية
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {selectedBillingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price}
                    <span className="text-lg text-gray-600 font-normal"> جنيه</span>
                  </div>
                  <p className="text-gray-600">
                    {selectedBillingCycle === 'yearly' ? 'سنوياً' : 'شهرياً'}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing || (subscription?.plan.id === plan.id && subscription.status === 'active')}
                  className={`w-full py-3 px-6 rounded-2xl font-medium transition-all duration-300 ${
                    subscription?.plan.id === plan.id && subscription.status === 'active'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.is_popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isProcessing ? 'جاري المعالجة...' : 
                   subscription?.plan.id === plan.id && subscription.status === 'active' ? 'الباقة الحالية' : 'اشترك الآن'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">سجل الفواتير</h2>
          
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600">لا توجد فواتير بعد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">رقم الفاتورة</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">المبلغ</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">تاريخ الإصدار</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">تاريخ الاستحقاق</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-medium">{invoice.invoice_number}</td>
                      <td className="py-3 px-4 text-gray-900">{invoice.amount} {invoice.currency}</td>
                      <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(invoice.issued_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(invoice.due_at).toLocaleDateString('ar-EG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
