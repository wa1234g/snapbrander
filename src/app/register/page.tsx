'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    businessType: '',
    agreeToTerms: false,
  });
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const planData = localStorage.getItem('selectedPlan');
    if (planData) {
      setSelectedPlan(JSON.parse(planData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, plan: selectedPlan?.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess('Registration successful! Please login.');
      // clear form, maybe redirect to login page
      // window.location.href = '/login';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-6 max-w-lg">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center">Create Your Account</h2>
          {selectedPlan && <p className="text-center text-gray-600 mt-2">You've selected the <span className="font-bold">{selectedPlan.name}</span> plan.</p>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex space-x-4">
              <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
            </div>
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
            <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
            <input type="text" name="companyName" placeholder="Company Name (Optional)" onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
            <select name="businessType" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md bg-white">
              <option value="">Select Business Type...</option>
              <option value="ecommerce">E-commerce</option>
              <option value="agency">Agency</option>
              <option value="portfolio">Portfolio</option>
              <option value="blog">Blog</option>
              <option value="other">Other</option>
            </select>
            <div className="flex items-center">
              <input type="checkbox" name="agreeToTerms" id="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link>
              </label>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700">Create Account</button>
          </form>
          <p className="text-center mt-4 text-sm">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
