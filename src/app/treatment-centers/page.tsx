import React from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { ContentSection } from '@/components/content/ContentSection';
import { LegalDisclaimer } from '@/components/content/LegalDisclaimer';
import { Stethoscope, Heart, Smartphone, RefreshCw } from 'lucide-react';

export default function TreatmentCentersPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4">
        <PageHero
          icon={Stethoscope}
          title="Treatment Centers"
          subtitle="A recovery support ecosystem aligned with clinical care for post-aftercare continuity"
        />

        <ContentSection
          title="A Recovery Support Ecosystem Aligned With Clinical Care"
          icon={Heart}
        >
          <p>
            Friends of Recovery operates as a recovery support ecosystem that complements, but does
            not replace, licensed treatment services. The ecosystem consists of structured recovery
            environments, accountability supports, and shared behavioral language that reinforce
            clinical gains following treatment. It is not a treatment modality, clinical
            intervention, or diagnostic system, and it does not provide medical, psychiatric, or
            therapeutic services.
          </p>
          <p>
            The recovery ecosystem is designed to remain compatible with clinical care by
            translating recovery principles into neutral, clinically legible behavioral and
            cognitive functioning terms—such as emotional regulation, impulse modulation, insight
            capacity, and responsibility. This allows continuity of understanding between treatment
            and post-treatment settings without extending clinical authority or responsibility
            beyond discharge.
          </p>
        </ContentSection>

        <ContentSection
          title="Transparency as a Support Tool Within the Recovery Setting"
          icon={Smartphone}
        >
          <p>
            Transparency within the Friends of Recovery ecosystem functions as a recovery support
            mechanism rather than a clinical or monitoring system. Behavioral and cognitive patterns
            are made visible in a manner that is HIPAA-defensible, research-friendly, and
            non-diagnostic. The focus is on consistency, engagement, and executive functioning over
            time, not on compliance, morality, or symptom tracking.
          </p>
          <p>
            Any technology used within the ecosystem supports self-awareness and accountability in
            the recovery setting and does not function as treatment, clinical documentation, or
            remote patient monitoring. Treatment centers are not required to access, interpret, or
            act upon transparency-related information, and no clinical decision-making is delegated
            to recovery support tools.
          </p>
        </ContentSection>

        <ContentSection
          title="Post-Aftercare Continuity Without Clinical Extension"
          icon={RefreshCw}
        >
          <p>
            Following discharge, individuals transition from structured treatment environments into
            recovery settings where accountability and feedback are less formalized. Friends of
            Recovery supports this transition by maintaining a shared, non-clinical language for
            understanding behavior and functioning in daily life. Recovery principles such as
            honesty, responsibility, diligence, and humility are operationalized as congruent
            self-reporting, internal locus of control, goal-directed behavior, and insight
            capacity—terms consistent with behavioral health frameworks.
          </p>
          <p>
            This structure allows recovery settings to reinforce treatment outcomes without assuming
            clinical roles or responsibilities. The ecosystem supports adaptive change, personal
            responsibility, and long-term recovery engagement while preserving clear separation
            between licensed treatment services and non-clinical recovery support.
          </p>
        </ContentSection>

        <LegalDisclaimer>
          Friends of Recovery does not provide medical, psychiatric, or therapeutic services and
          does not function as a treatment program, continuing care provider, or clinical monitoring
          system. Participation in recovery support services is voluntary and independent of
          treatment admission, discharge, or clinical decision-making. All clinical care remains
          under the authority of licensed treatment providers and governed by applicable laws and
          professional standards.
        </LegalDisclaimer>
      </div>
    </PublicLayout>
  );
}
