import React from 'react';

interface LegalDisclaimerProps {
  children: React.ReactNode;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ children }) => (
  <div className="mt-8 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
    <p className="text-xs text-neutral-500 leading-relaxed">{children}</p>
  </div>
);
