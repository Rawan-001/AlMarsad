import type { DictKey } from "./i18n";

export type SectionConfig = {
  slug: string;
  icon: string;
  titleKey: DictKey;
  descriptionKey: DictKey;
};

export const PLANNED_SECTIONS: SectionConfig[] = [
  { slug: "projects", icon: "📁", titleKey: "pillarProjects", descriptionKey: "pillarProjectsDesc" },
  { slug: "activities", icon: "📅", titleKey: "pillarActivities", descriptionKey: "pillarActivitiesDesc" },
  { slug: "participation", icon: "🌍", titleKey: "pillarParticipation", descriptionKey: "pillarParticipationDesc" },
  { slug: "innovation", icon: "💡", titleKey: "pillarInnovation", descriptionKey: "pillarInnovationDesc" },
  { slug: "awards", icon: "🏆", titleKey: "pillarAwards", descriptionKey: "pillarAwardsDesc" },
  { slug: "partnerships", icon: "🤝", titleKey: "pillarPartnerships", descriptionKey: "pillarPartnershipsDesc" },
  { slug: "training", icon: "🎓", titleKey: "pillarTraining", descriptionKey: "pillarTrainingDesc" },
  { slug: "media", icon: "🎙️", titleKey: "pillarMedia", descriptionKey: "pillarMediaDesc" },
];

export function getSectionBySlug(slug: string): SectionConfig | undefined {
  return PLANNED_SECTIONS.find((s) => s.slug === slug);
}
