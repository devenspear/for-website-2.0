import React from 'react';
import { Card, CardContent } from '@/components/common/Card';
import { LucideIcon } from 'lucide-react';

interface ContentSectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: 'default' | 'highlight';
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  icon: Icon,
  children,
  variant = 'default',
}) => {
  const bgClass = variant === 'highlight' ? 'bg-indigo-50 border-indigo-100' : '';

  return (
    <Card className={`mb-6 ${bgClass}`}>
      <CardContent>
        <div className="flex items-start gap-3 mb-4">
          {Icon && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#eef2ff' }}
            >
              <Icon size={20} color="#4f46e5" />
            </div>
          )}
          <h2 className="text-xl font-semibold text-neutral-900 pt-1.5">{title}</h2>
        </div>
        <div className="text-neutral-700 leading-relaxed space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
};
