'use client';

import { useState } from 'react';

// This would typically be a reusable component
const PricingCard = ({ plan, isAnnual, onSelectPlan }: { plan: any, isAnnual: boolean, onSelectPlan: (plan: any) => void }) => {
  const price = isAnnual ? plan.price.annual : plan.price.monthly;
  const period = isAnnual ? '/year' : '/month';
  const savings = plan.price.monthly * 12 - plan.price.annual;

  return (
    <div className={`border rounded-lg p-6 flex flex-col ${plan.featured ? 'border-blue-600' : 'border-gray-300'}`}>
      <h3 className="text-2xl font-bold">{plan.name}</h3>
      <p className="mt-2 text-gray-500">{plan.description}</p>
      <div className="mt-4">
        <span className="text-4xl font-bold">{price > 0 ? `SAR ${price}`: 'Free'}</span>
        <span className="text-gray-500">{price > 0 && period}</span>
      </div>
      {isAnnual && price > 0 && <p className="text-green-600 mt-2">Save SAR {savings}!</p>}
      <ul className="mt-6 space-y-4 flex-grow">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelectPlan(plan)}
        className={`mt-8 w-full py-3 rounded-md font-semibold ${plan.featured ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
      >
        Choose Plan
      </button>
    </div>
  );
};

const plans = [
  { id: 'free', name: 'Free', description: 'For trials and small projects.', price: { monthly: 0, annual: 0 }, features: ['1 trial site', '3 templates', 'Free subdomain', '14-day trial'], featured: false },
  { id: 'basic', name: 'Basic', description: 'For professionals and small businesses.', price: { monthly: 299, annual: 2870 }, features: ['5 websites', '50 templates', 'Basic hosting', 'Custom domain'], featured: true },
  { id: 'pro', name: 'Professional', description: 'For growing businesses and agencies.', price: { monthly: 799, annual: 7670 }, features: ['25 websites', 'All templates', 'Advanced hosting + CDN', 'Priority support'], featured: false },
  { id: 'enterprise', name: 'Enterprise', description: 'For large-scale operations.', price: { monthly: 1999, annual: 19190 }, features: ['Unlimited websites', 'Exclusive templates', 'Dedicated hosting', 'Account manager'], featured: false },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const handleSelectPlan = (plan: any) => {
    const planToStore = {
      id: plan.id,
      name: plan.name,
      price: isAnnual ? plan.price.annual : plan.price.monthly,
      billingCycle: isAnnual ? 'annual' : 'monthly',
      timestamp: new Date().getTime(),
      expires: new Date().getTime() + (1000 * 60 * 60 * 24), // 24-hour expiry
    };
    localStorage.setItem('selectedPlan', JSON.stringify(planToStore));
    // Redirect to registration page
    window.location.href = '/register';
  };

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">Our Pricing</h2>
        <p className="mt-2 text-gray-600">Choose the plan that fits your needs.</p>

        <div className="mt-8 flex justify-center items-center space-x-4">
          <span>Monthly</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isAnnual} onChange={() => setIsAnnual(!isAnnual)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <span className="flex items-center">
            Annual <span className="ml-2 px-2 py-1 text-xs bg-green-200 text-green-800 rounded-full">Save 20%</span>
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map(plan => (
            <PricingCard key={plan.id} plan={plan} isAnnual={isAnnual} onSelectPlan={handleSelectPlan} />
          ))}
        </div>

        <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold">30-Day Money-Back Guarantee</h3>
            <p className="mt-2 text-gray-600">Not satisfied? Get a full refund within 30 days of your purchase.</p>
        </div>
      </div>
    </div>
  );
}
