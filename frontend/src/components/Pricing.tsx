'use client';

import { useState, useEffect } from 'react';
import { getTiers, createCheckout, getCurrentUser } from '@/lib/auth';

interface Tier {
  tier: string;
  name: string;
  price: number;
  limits: {
    projects: number;
    cut_lists_per_month: number;
    exports_per_month: number;
  };
  features: string[];
}

export default function PricingPage() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<{ tier: string } | null>(null);

  useEffect(() => {
    getTiers().then(setTiers).catch(console.error);
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  const handleSelect = async (tier: string) => {
    if (tier === 'free') return;
    
    setLoading(tier);
    try {
      const url = await createCheckout(tier);
      window.location.href = url;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Checkout failed');
      setLoading(null);
    }
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Unlimited' : limit;
  };

  const featureLabels: Record<string, string> = {
    basic_cut_list: 'Basic cut list generation',
    advanced_nesting: 'Advanced 2D nesting optimization',
    pdf: 'PDF export (no watermark)',
    pdf_watermarked: 'PDF export (watermarked)',
    dxf: 'DXF export for CNC',
    csv: 'CSV export',
    api_access: 'API access',
    team: 'Team collaboration',
    hardware_finder: 'Hardware finder integration',
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From DIY projects to professional shops, we have a plan that fits your needs.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-4">
          {tiers.map((tier) => {
            const isCurrentTier = user?.tier === tier.tier;
            const isFree = tier.tier === 'free';
            
            return (
              <div
                key={tier.tier}
                className={`relative flex flex-col rounded-3xl p-8 ${
                  tier.tier === 'maker'
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-600'
                    : 'bg-white ring-1 ring-gray-200'
                }`}
              >
                {tier.tier === 'maker' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold ${tier.tier === 'maker' ? 'text-white' : 'text-gray-900'}`}>
                    {tier.name}
                  </h3>
                  <p className={`mt-2 text-sm ${tier.tier === 'maker' ? 'text-indigo-100' : 'text-gray-600'}`}>
                    {tier.tier === 'free' && 'For trying out CutList Cloud'}
                    {tier.tier === 'maker' && 'For serious DIYers and hobbyists'}
                    {tier.tier === 'shop' && 'For small cabinet shops'}
                    {tier.tier === 'pro' && 'For professional operations'}
                  </p>
                </div>

                <div className="mb-6">
                  <span className={`text-4xl font-bold tracking-tight ${tier.tier === 'maker' ? 'text-white' : 'text-gray-900'}`}>
                    ${tier.price}
                  </span>
                  <span className={`text-sm ${tier.tier === 'maker' ? 'text-indigo-100' : 'text-gray-600'}`}>
                    /month
                  </span>
                </div>

                <ul className="mb-8 space-y-3 text-sm">
                  <li className={tier.tier === 'maker' ? 'text-indigo-100' : 'text-gray-600'}>
                    • {formatLimit(tier.limits.projects)} projects
                  </li>
                  <li className={tier.tier === 'maker' ? 'text-indigo-100' : 'text-gray-600'}>
                    • {formatLimit(tier.limits.cut_lists_per_month)} cut lists/month
                  </li>
                  <li className={tier.tier === 'maker' ? 'text-indigo-100' : 'text-gray-600'}>
                    • {formatLimit(tier.limits.exports_per_month)} exports/month
                  </li>
                  {tier.features
                    .filter((f) => f !== 'all')
                    .map((feature) => (
                      <li key={feature} className={tier.tier === 'maker' ? 'text-indigo-100' : 'text-gray-600'}>
                        • {featureLabels[feature] || feature}
                      </li>
                    ))}
                  {tier.tier === 'pro' && (
                    <li className={tier.tier === 'maker' ? 'text-indigo-100' : 'text-gray-600'}>
                      • All features included
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handleSelect(tier.tier)}
                  disabled={isCurrentTier || loading !== null}
                  className={`mt-auto rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isFree
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      : tier.tier === 'maker'
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isCurrentTier ? 'Current plan' : isFree ? 'Get started' : loading === tier.tier ? 'Loading...' : 'Subscribe'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
