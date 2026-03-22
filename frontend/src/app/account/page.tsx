'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, getUsage, createPortal } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name?: string;
  tier: string;
}

interface UsageData {
  tier: {
    tier: string;
    name: string;
    price: number;
  };
  usage: {
    projects: number;
    cut_lists: number;
    exports: number;
  };
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCurrentUser(), getUsage()])
      .then(([userData, usageData]) => {
        if (!userData) {
          router.push('/login');
          return;
        }
        setUser(userData);
        setUsage(usageData);
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleManageSubscription = async () => {
    try {
      const url = await createPortal();
      window.location.href = url;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to open billing portal');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-600">Name</dt>
              <dd className="text-gray-900">{user.name || 'Not set'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Email</dt>
              <dd className="text-gray-900">{user.email}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
              {usage?.tier.name || 'Free'}
            </span>
          </div>

          {usage && (
            <dl className="space-y-3 mb-6">
              <div className="flex justify-between">
                <dt className="text-gray-600">Projects</dt>
                <dd className="text-gray-900">
                  {usage.usage.projects} used
                  {usage.tier.tier !== 'free' && ' (unlimited)'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Cut lists this month</dt>
                <dd className="text-gray-900">
                  {usage.usage.cut_lists} used
                  {usage.tier.tier !== 'free' && ' (unlimited)'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Exports this month</dt>
                <dd className="text-gray-900">
                  {usage.usage.exports} used
                  {usage.tier.tier !== 'free' && ' (unlimited)'}
                </dd>
              </div>
            </dl>
          )}

          {user.tier !== 'free' ? (
            <button
              onClick={handleManageSubscription}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Manage subscription
            </button>
          ) : (
            <button
              onClick={() => router.push('/pricing')}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
            >
              Upgrade plan
            </button>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-500"
          >
            Sign out
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
