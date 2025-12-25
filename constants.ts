import { ShoppingBag, MapPin, Stethoscope, Calendar } from "lucide-react";
import { Agent, Capability, Insight } from "./types";

export const AGENTS: Agent[] = [
  {
    id: 'dr-sahab',
    title: 'Dr. Sahab AI',
    description: 'Your personalized AI health companion for multi-lingual primary care and assessment.',
    features: ['Symptom Analysis', 'Multi-lingual Support', 'Preventive Advice'],
    icon: Stethoscope,
    color: 'text-trustBlue',
    ctaText: 'Scroll Down'
  },
  {
    id: 'scheduling-agent',
    title: 'Health Scheduler',
    description: 'Intelligent management of your clinical appointments and health calendar.',
    features: ['One-tap Booking', 'Vaccination Reminders', 'Record Sync'],
    icon: Calendar,
    color: 'text-indigo-500'
  },
  {
    id: 'medishop',
    title: 'MediShop AI',
    description: 'Assisted medicine commerce with prescription OCR and price comparison.',
    features: ['Prescription OCR', 'Price comparison', 'Auto-cart'],
    icon: ShoppingBag,
    color: 'text-emerald-600',
    url: 'https://medishop-ai-85618371279.us-west1.run.app/'
  },
  {
    id: 'medilocate',
    title: 'Medilocate AI',
    description: 'Find nearest hospitals with real-time directions and emergency call options.',
    features: ['Nearest hospital search', 'Real-time navigation', 'Emergency SOS'],
    icon: MapPin,
    color: 'text-rose-500',
    url: 'https://medilocate-ai-85618371279.us-west1.run.app/'
  }
];

export const CAPABILITIES: Capability[] = [
  {
    id: 'cap-1',
    title: 'Conversational Intelligence',
    content: 'Advanced NLP models tuned for medical terminology, offering context-aware responses that adapt to patient literacy levels.'
  },
  {
    id: 'cap-4',
    title: 'Guardrails & Compliance',
    content: 'Built-in HIPAA and GDPR compliant frameworks that automatically flag and filter unsafe or non-compliant queries.'
  }
];

export const INSIGHTS: Insight[] = [
  {
    id: 'ins-1',
    category: 'Research',
    title: 'The role of multimodal agents in rural diagnostics.',
    date: 'Oct 12, 2023'
  },
  {
    id: 'ins-2',
    category: 'Ethics',
    title: 'Building trust: Why "Calm AI" matters in patient care.',
    date: 'Nov 04, 2023'
  },
  {
    id: 'ins-3',
    category: 'System',
    title: 'SEHAT v2.0 release notes: Enhanced radiology support.',
    date: 'Dec 01, 2023'
  }
];