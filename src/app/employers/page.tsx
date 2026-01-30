import React from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { ContentSection } from '@/components/content/ContentSection';
import { Briefcase, Shield, EyeOff, Handshake } from 'lucide-react';

export default function EmployersPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4">
        <PageHero
          icon={Briefcase}
          title="Employers"
          subtitle="A structured, defensible approach to workforce participation"
        />

        <ContentSection
          title="A Structured, Defensible Approach to Workforce Participation"
          icon={Shield}
        >
          <p>
            Friends of Recovery partners with employers to support workforce participation for
            individuals in recovery through structured accountability and transparent,
            behavior-based support. Our model is grounded in observable patterns related to
            reliability, responsibility, engagement, and follow-through—not diagnosis, treatment, or
            moral judgment. This approach allows employers to engage in recovery-supportive hiring
            while maintaining clear workplace expectations and operational standards.
          </p>
          <p>
            Participation in the program is voluntary and designed to complement, not replace,
            existing employer policies, procedures, or supervisory practices. Employers are not
            required to make clinical assessments, interpret personal data, or assume monitoring
            responsibilities.
          </p>
        </ContentSection>

        <ContentSection
          title="Transparency Without Employer Oversight or Surveillance"
          icon={EyeOff}
        >
          <p>
            The Transparency App uses participant-approved inputs to generate feedback related to
            behavioral regulation, consistency, and accountability over time. Information is framed
            in neutral, clinically grounded terms to reduce subjectivity and misinterpretation.
            Employers do not receive raw data, health information, or clinical insight, and are not
            asked to access or manage protected information.
          </p>
          <p>
            Transparency within the program is intended to support individual self-awareness and
            early course correction, not disciplinary action or performance management. Employment
            decisions remain solely within the employer&apos;s existing HR and legal frameworks.
          </p>
        </ContentSection>

        <ContentSection
          title="A Partnership Model Aligned With Workplace Standards"
          icon={Handshake}
        >
          <p>
            Friends of Recovery provides a structured support layer that aligns recovery
            accountability with real-world employment expectations. The program reinforces personal
            responsibility, clear boundaries, and adaptive behavior while respecting privacy,
            autonomy, and workplace authority.
          </p>
          <p>
            This partnership model helps reduce uncertainty, supports workforce stability, and
            creates a clear separation between recovery support and employer oversight. The result
            is a professional, compliant pathway for employers seeking to engage individuals in
            recovery while maintaining consistency, clarity, and organizational integrity.
          </p>
        </ContentSection>
      </div>
    </PublicLayout>
  );
}
