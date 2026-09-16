import type { DictKey } from "./i18n";

export type SectionConfig = {
  slug: string;
  titleKey: DictKey;
  descriptionKey: DictKey;
};

export const PLANNED_SECTIONS: SectionConfig[] = [
  { slug: "projects", titleKey: "pillarProjects", descriptionKey: "pillarProjectsDesc" },
  { slug: "activities", titleKey: "pillarActivities", descriptionKey: "pillarActivitiesDesc" },
  { slug: "participation", titleKey: "pillarParticipation", descriptionKey: "pillarParticipationDesc" },
  { slug: "innovation", titleKey: "pillarInnovation", descriptionKey: "pillarInnovationDesc" },
  { slug: "awards", titleKey: "pillarAwards", descriptionKey: "pillarAwardsDesc" },
  { slug: "partnerships", titleKey: "pillarPartnerships", descriptionKey: "pillarPartnershipsDesc" },
  { slug: "training", titleKey: "pillarTraining", descriptionKey: "pillarTrainingDesc" },
  { slug: "media", titleKey: "pillarMedia", descriptionKey: "pillarMediaDesc" },
];

export function getSectionBySlug(slug: string): SectionConfig | undefined {
  return PLANNED_SECTIONS.find((s) => s.slug === slug);
}
