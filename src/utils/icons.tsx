import {
  CheckCircle,
  Package,
  Truck,
  IndianRupee,
  Sparkles,
  Award,
  Star,
  Tag,
  WandSparkles,
  Rocket,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "check-circle": CheckCircle,
  package: Package,
  truck: Truck,
  rupee: IndianRupee,
  sparkles: Sparkles,
  award: Award,
  star: Star,
  tag: Tag,
  wand: WandSparkles,
  rocket: Rocket,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}
