'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { BarChart3, DollarSign, Activity, AlertTriangle } from 'lucide-react';

interface StatRow {
  label: string;
  value: string;
  subtext?: string;
}

interface StatTable {
  title: string;
  icon: React.ReactNode;
  color: string;
  stats: StatRow[];
}

const statisticalData: StatTable[] = [
  {
    title: 'Economic Burden - NC',
    icon: <DollarSign size={18} />,
    color: '#4f46e5',
    stats: [
      { label: 'Combined Annual Cost', value: '>$6.8 billion/year' },
      { label: 'Per OUD Case', value: '~$750,000', subtext: 'societal cost/year' },
      { label: 'Opioid Costs (2022)', value: '~$749 million' },
      { label: 'Employer Cost per Abuser', value: '~$20,000/year' },
    ],
  },
  {
    title: 'Relapse & Treatment',
    icon: <Activity size={18} />,
    color: '#d97706',
    stats: [
      { label: 'Relapse (First 90 Days)', value: '50-70%' },
      { label: 'Relapse Identification', value: '~$834', subtext: 'per person' },
      { label: 'Retention in Treatment', value: '~$2,699', subtext: 'per person' },
      { label: 'Outpatient (30 days)', value: '~$1,700' },
    ],
  },
  {
    title: 'Healthcare & Mortality',
    icon: <AlertTriangle size={18} />,
    color: '#dc2626',
    stats: [
      { label: 'Overdose Death Costs (2019)', value: '~$2.4 billion' },
      { label: 'Inpatient Treatment', value: '$6K-$25K', subtext: '30-day program' },
      { label: 'Sober Living', value: '$1.2K-$3K/month' },
      { label: 'Long-term Programs', value: '>$50,000' },
    ],
  },
];

const keyTakeaways = [
  'Investing in sustained treatment prevents costly repeated episodes',
  'Early relapse identification saves significant downstream costs',
  'Community support reduces long-term healthcare utilization',
  'Transparency tools improve accountability and recovery outcomes',
];

export const StatisticalData: React.FC = () => {
  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 size={24} color="#4f46e5" className="animate-pulse" />
            <h2 className="text-2xl font-bold text-neutral-900">
              The Impact of Recovery Support
            </h2>
          </div>
          <p className="text-neutral-600">
            Understanding the economic and social burden of substance use disorders in North
            Carolina
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {statisticalData.map((table, idx) => (
            <div
              key={idx}
              className="group"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Card className="h-full relative transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader>
                  <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                    <span
                      className="transition-transform duration-300 group-hover:scale-110"
                      style={{ color: table.color }}
                    >
                      {table.icon}
                    </span>
                    {table.title}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {table.stats.map((stat, statIdx) => (
                    <div
                      key={statIdx}
                      className="flex justify-between items-start transition-all duration-300 group-hover:translate-x-1"
                      style={{ transitionDelay: `${statIdx * 50}ms` }}
                    >
                      <span className="text-sm text-neutral-600">{stat.label}</span>
                      <div className="text-right">
                        <span
                          className="font-semibold transition-colors duration-300"
                          style={{ color: '#18181b' }}
                        >
                          {stat.value}
                        </span>
                        {stat.subtext && (
                          <span className="block text-xs text-neutral-500">{stat.subtext}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
                {/* Animated top border on hover */}
                <div
                  className="absolute top-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-t-2xl"
                  style={{ backgroundColor: table.color }}
                />
              </Card>
            </div>
          ))}
        </div>

        {/* Key Takeaways with hover effects */}
        <Card className="bg-indigo-50 border-indigo-100 overflow-hidden group">
          <CardContent>
            <h3 className="font-semibold text-indigo-900 mb-4">Key Takeaways</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {keyTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 transition-all duration-300 hover:translate-x-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-125" />
                  <span className="text-sm text-indigo-800">{takeaway}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
