import React from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { ContentSection } from '@/components/content/ContentSection';
import { LegalDisclaimer } from '@/components/content/LegalDisclaimer';
import { Handshake, Stethoscope, Target, Shield } from 'lucide-react';

export default function SponsorshipPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4">
        <PageHero
          icon={Handshake}
          title="Sponsorship Opportunities"
          subtitle="Partner with us in supporting long-term recovery through clinically grounded transparency"
        />

        <ContentSection
          title="Supporting Recovery Through Clinically Grounded Transparency"
          icon={Stethoscope}
        >
          <p>
            Sponsorship with Friends of Recovery supports a recovery ecosystem that emphasizes
            self-awareness, accountability, and consistency in daily behavior using clinically
            legible, non-moralizing language. Sponsorship funds are directed toward sustaining
            systems that translate recovery principles into observable behavioral and cognitive
            functioning terms—such as emotional regulation, impulse control, responsibility, and
            engagement—rather than judgment, labels, or subjective interpretation.
          </p>
          <p>
            This approach allows recovery support to remain aligned with behavioral health
            frameworks while operating outside the scope of medical or therapeutic treatment.
            Sponsors contribute to a model that is recovery-aligned, research-friendly, and
            HIPAA-defensible, supporting long-term recovery engagement across community, housing,
            employment, and post-treatment settings.
          </p>
        </ContentSection>

        <ContentSection
          title="Advancing Objective, Non-Diagnostic Accountability"
          icon={Target}
        >
          <p>
            The sponsored ecosystem promotes transparency by focusing on measurable behavioral
            regulation and cognitive patterns over time. The framework explicitly avoids moral
            evaluation, instead emphasizing executive functioning, insight capacity, congruent
            self-reporting, and adaptive change. This allows individuals and support networks to
            share a common, objective understanding of progress without reliance on blame, shame, or
            surveillance.
          </p>
          <p>
            Sponsorship enables the continued development and maintenance of tools and environments
            that encourage honesty, internal locus of control, and responsibility while respecting
            autonomy and privacy. Contributions do not fund clinical care, diagnosis, or treatment
            services, and sponsorship does not create oversight, influence, or control over
            participant outcomes.
          </p>
        </ContentSection>

        <ContentSection
          title="A Responsible, Defensible Partnership Model"
          icon={Shield}
        >
          <p>
            Sponsorship with Friends of Recovery supports a system designed to be ethically sound
            and legally appropriate for healthcare-adjacent, community-based recovery work. The
            model reinforces learning and collaboration by making behavioral patterns visible and
            understandable in ways that support insight and stability without extending clinical
            responsibility or regulatory risk.
          </p>
          <p>
            Sponsors participate by funding infrastructure and recovery support capacity, not by
            directing services or accessing data. This structure ensures that sponsorship remains
            compatible with compliance standards while contributing to long-term recovery outcomes
            for individuals and the communities in which they live.
          </p>
        </ContentSection>

        <LegalDisclaimer>
          Friends of Recovery does not provide medical, psychiatric, or therapeutic services.
          Sponsorship contributions support non-clinical recovery support infrastructure and
          education. Sponsorship does not confer governance authority, clinical responsibility, data
          access, or decision-making influence over individuals or programs.
        </LegalDisclaimer>
      </div>
    </PublicLayout>
  );
}
