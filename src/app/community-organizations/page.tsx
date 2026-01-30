import React from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { ContentSection } from '@/components/content/ContentSection';
import { LegalDisclaimer } from '@/components/content/LegalDisclaimer';
import { Building2, Network, Smartphone, Scale } from 'lucide-react';

export default function CommunityOrganizationsPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4">
        <PageHero
          icon={Building2}
          title="Community Organizations"
          subtitle="Building a connected recovery support ecosystem through structured, non-clinical environments"
        />

        <ContentSection
          title="Participation in the Recovery Support Ecosystem"
          icon={Network}
        >
          <p>
            Community organizations participate in the Friends of Recovery ecosystem by offering
            structured, non-clinical environments that support engagement, stability, and personal
            responsibility for individuals in long-term recovery. Participation is based on
            alignment of values and practices, not on the provision of medical, psychiatric, or
            therapeutic services. Community organizations retain full independence over their
            operations, programming, and participation criteria.
          </p>
          <p>
            Becoming part of the ecosystem does not designate a community organization as a
            treatment provider, recovery residence, clinical affiliate, or agent of Friends of
            Recovery. Participation does not create a joint venture, partnership, or supervisory
            relationship. Each organization operates within its own scope, governance, and legal
            authority.
          </p>
        </ContentSection>

        <ContentSection
          title="Role of the Transparency App Within Community Settings"
          icon={Smartphone}
        >
          <p>
            Individuals participating in community programs may independently choose to use the
            Transparency App as a personal accountability and self-awareness tool within the
            recovery ecosystem. The app reflects behavioral and cognitive patterns in neutral,
            non-diagnostic terms related to engagement, consistency, and executive functioning. It
            does not function as treatment, monitoring, or evaluation within community
            organizations.
          </p>
          <p>
            Community organizations are not required to access, manage, interpret, or act upon
            app-related information. Use of the Transparency App does not impose supervisory,
            reporting, or compliance obligations on community partners and does not influence
            eligibility, participation, or standing within community programs.
          </p>
        </ContentSection>

        <ContentSection title="Maintaining Legal and Operational Separation" icon={Scale}>
          <p>
            Friends of Recovery maintains a clear separation between recovery support services and
            community organization operations. Community organizations are not responsible for
            recovery outcomes, behavioral monitoring, or data oversight related to ecosystem
            participation. Likewise, Friends of Recovery does not direct, control, or manage
            community programs or services.
          </p>
          <p>
            This structure ensures that community organizations may support recovery-aligned
            engagement while preserving compliance with applicable laws and regulations. By
            maintaining defined boundaries and shared, non-clinical language, the ecosystem allows
            community partners to participate without assuming clinical liability, regulatory risk,
            or expanded duty of care.
          </p>
        </ContentSection>

        <LegalDisclaimer>
          Participation in the Friends of Recovery ecosystem is voluntary and non-exclusive. Friends
          of Recovery does not provide medical, psychiatric, or therapeutic services, and community
          organizations do not provide such services on behalf of Friends of Recovery. Nothing in
          this relationship shall be construed to create an employment relationship, partnership,
          joint venture, agency, or clinical affiliation.
        </LegalDisclaimer>
      </div>
    </PublicLayout>
  );
}
