export interface ContactInfo {
  readonly email: string;
  readonly whatsappDisplay: string;
  readonly whatsappUrl: string;
  readonly linkedinUrl: string;
  readonly githubUrl: string;
  readonly githubHandle: string;
}

export interface MetricItem {
  readonly value: string;
  readonly label: string;
}

export interface ExperienceItem {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly location?: string;
  readonly summary: string;
}

export interface EducationItem {
  readonly institution: string;
  readonly degree: string;
  readonly period: string;
  readonly expectedYear: string;
}

export interface CertificationItem {
  readonly title: string;
  readonly issuer: string;
  readonly hours: number;
  readonly issuedAt: string;
  readonly verifyUrl: string;
  readonly modules: readonly string[];
}

export interface OtherCertificationItem {
  readonly title: string;
  readonly issuer: string;
  readonly issuedAt: string;
  readonly verifyUrl?: string;
}

export interface Profile {
  readonly name: string;
  readonly handle: string;
  readonly title: string;
  readonly location: string;
  readonly availability: string;
  readonly bio: string;
  readonly resumeSummary: string;
  readonly contact: ContactInfo;
  readonly metrics: readonly MetricItem[];
  readonly experiences: readonly ExperienceItem[];
  readonly education: EducationItem;
  readonly featuredCertification: CertificationItem;
  readonly otherCertifications: readonly OtherCertificationItem[];
}

export interface DiagramNode {
  readonly label: string;
  readonly detail: string;
}

export interface CaseStudy {
  readonly slug: string;
  readonly domain: string;
  readonly shortTitle: string;
  readonly title: string;
  readonly summary: string;
  readonly context: string;
  readonly period: string;
  readonly role: string;
  readonly stack: readonly string[];
  readonly diagramTitle: string;
  readonly diagramSummary: string;
  readonly diagramNodes: readonly DiagramNode[];
  readonly problem: string;
  readonly constraints: string;
  readonly solution: string;
  readonly result: string;
}

export interface PublicProject {
  readonly name: string;
  readonly owner: string;
  readonly isLegacyAccount: boolean;
  readonly legacyNote?: string;
  readonly liveUrl?: string;
  readonly repoUrl: string;
  readonly description: string;
  readonly stack: readonly string[];
}

export interface SkillGroup {
  readonly category: string;
  readonly items: readonly string[];
}

export interface AiPillar {
  readonly id: string;
  readonly shortTitle: string;
  readonly title: string;
  readonly description: string;
  readonly artifacts: readonly string[];
}
