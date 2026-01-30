import React from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { ContentSection } from '@/components/content/ContentSection';
import { LegalDisclaimer } from '@/components/content/LegalDisclaimer';
import { Heart, Shield, Landmark, HandHeart } from 'lucide-react';

export default function DonatePage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4">
        <PageHero
          icon={Heart}
          title="Donate"
          subtitle="Support recovery through responsible, non-clinical technology"
        />

        <ContentSection
          title="Supporting Recovery Through Responsible, Non-Clinical Technology"
          icon={Shield}
        >
          <p>
            Donations to Friends of Recovery support a nonprofit recovery ecosystem that promotes
            self-awareness, accountability, and consistency in daily behavior using transparent,
            data-informed tools. Contributions help sustain systems that translate recovery
            principles into observable behavioral and cognitive functioning terms—such as emotional
            regulation, impulse control, responsibility, and engagement—without moral judgment,
            diagnosis, or treatment delivery.
          </p>
          <p>
            Donated funds are used to support non-clinical recovery infrastructure, education, and
            technology that reinforces insight development and adaptive change. Friends of Recovery
            does not provide medical, psychiatric, or therapeutic services, and donations do not
            fund clinical care, diagnosis, or treatment.
          </p>
        </ContentSection>

        <ContentSection title="Technology Use Within a Nonprofit Framework" icon={Landmark}>
          <p>
            Technology supported by donations, including the Transparency App, is used as a
            voluntary, non-clinical tool to help individuals better understand patterns related to
            behavioral regulation, executive functioning, and consistency over time. The technology
            does not function as surveillance, clinical monitoring, or an electronic health record.
            It is designed to be HIPAA-defensible, recovery-aligned, and appropriate for
            community-based recovery settings.
          </p>
          <p>
            Donations do not grant donors access to personal data, behavioral information, or system
            outputs. All data use is participant-approved and focused on learning and self-awareness
            rather than evaluation or enforcement. The nonprofit retains full control over how
            donated funds are allocated in support of its mission and operations.
          </p>
        </ContentSection>

        <ContentSection title="Ethical Giving With Clear Boundaries" icon={HandHeart}>
          <p>
            Friends of Recovery is committed to responsible stewardship, transparency, and ethical
            use of technology within a nonprofit legal framework. Donations support systems that
            reduce stigma, improve shared understanding, and encourage personal responsibility
            without relying on blame, shame, or subjective interpretation.
          </p>
          <p>
            Contributing to Friends of Recovery supports long-term recovery outcomes by funding
            tools and environments that make behavioral patterns visible and understandable—helping
            individuals build insight, strengthen healthy behaviors, and participate more actively
            in their recovery process while respecting autonomy and privacy.
          </p>
        </ContentSection>

        <LegalDisclaimer>
          Friends of Recovery is a nonprofit organization. Donations support non-clinical recovery
          support services, education, and technology infrastructure. Contributions do not create a
          donor relationship involving governance authority, service direction, data access, or
          clinical responsibility. Friends of Recovery does not provide medical, psychiatric, or
          therapeutic services.
        </LegalDisclaimer>
      </div>
    </PublicLayout>
  );
}
