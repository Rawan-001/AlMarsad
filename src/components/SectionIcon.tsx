import {
  CalendarDays,
  FileText,
  FolderKanban,
  GraduationCap,
  Globe,
  Handshake,
  Lightbulb,
  Mic,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  research: FileText,
  projects: FolderKanban,
  activities: CalendarDays,
  participation: Globe,
  innovation: Lightbulb,
  awards: Trophy,
  partnerships: Handshake,
  training: GraduationCap,
  media: Mic,
};

export function SectionIcon({
  slug,
  className,
  style,
}: {
  slug: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = ICONS[slug] ?? FolderKanban;
  return <Icon className={className} style={style} strokeWidth={1.5} />;
}
