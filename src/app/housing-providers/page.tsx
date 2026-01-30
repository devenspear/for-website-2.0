import React from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { ContentSection } from '@/components/content/ContentSection';
import { LegalDisclaimer } from '@/components/content/LegalDisclaimer';
import { Home, Shield, Lock, Scale } from 'lucide-react';

export default function HousingProvidersPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4">
        <PageHero
          icon={Home}
          title="Housing Providers"
          subtitle="A structured, non-discriminatory support framework aligned with fair housing standards"
        />

        <ContentSection
          title="A Structured, Non-Discriminatory Support Framework"
          icon={Shield}
        >
          <p>
            Friends of Recovery partners with housing providers to support stable residency for
            individuals engaged in long-term recovery through structured accountability and
            transparent, behavior-based support. The program is not a treatment service, clinical
            assessment, or housing eligibility tool. It does not evaluate diagnoses, disabilities,
            or protected characteristics. All housing decisions remain solely within the
            provider&apos;s existing policies and legal authority.
          </p>
          <p>
            Participation in the Friends of Recovery program is voluntary and independent of
            tenancy approval, lease enforcement, or housing eligibility determinations. The program
            is designed to support individual stability while maintaining clear boundaries between
            recovery support services and housing provider responsibilities.
          </p>
        </ContentSection>

        <ContentSection
          title="Transparency Without Access to Protected Information"
          icon={Lock}
        >
          <p>
            The Transparency App uses participant-approved inputs to generate neutral feedback
            related to consistency, engagement, responsibility, and daily functioning over time.
            Housing providers do not receive health data, clinical interpretations, or behavioral
            analytics. No protected information is shared, stored, or required for participation.
          </p>
          <p>
            Housing providers are not asked to monitor residents, interpret behavioral indicators,
            or participate in recovery oversight. Transparency is used solely as a personal
            accountability and self-regulation tool for participants and is not intended to
            influence tenancy decisions, lease enforcement, or disciplinary actions.
          </p>
        </ContentSection>

        <ContentSection
          title="Alignment With Fair Housing and Operational Standards"
          icon={Scale}
        >
          <p>
            Friends of Recovery operates independently from housing management and does not direct,
            recommend, or influence housing placement decisions. The program reinforces personal
            responsibility, structure, and stability in a manner consistent with fair housing
            principles, reasonable accommodation standards, and non-discriminatory practices.
          </p>
          <p>
            This partnership model supports housing stability without creating dual-role conflicts,
            surveillance concerns, or compliance risk. By maintaining clear separation between
            recovery support and housing authority, Friends of Recovery provides a professional,
            defensible framework that supports residents while protecting provider operations, legal
            obligations, and community integrity.
          </p>
        </ContentSection>

        <LegalDisclaimer>
          Friends of Recovery is not a housing provider, property manager, or leasing authority.
          Participation in recovery support services is voluntary and does not guarantee housing
          placement, tenancy continuation, or favorable lease outcomes. All housing decisions are
          governed by applicable federal, state, and local laws, including the Fair Housing Act and
          HUD regulations.
        </LegalDisclaimer>
      </div>
    </PublicLayout>
  );
}
