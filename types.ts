import { LucideIcon } from "lucide-react";

export interface Agent {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  color: string;
  url?: string;
  ctaText?: string;
}

export interface Capability {
  id: string;
  title: string;
  content: string;
}

export interface Insight {
  id: string;
  category: string;
  title: string;
  date: string;
}