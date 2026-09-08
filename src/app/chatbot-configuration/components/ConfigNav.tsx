import React from 'react';
import {
  Settings,
  MessageCircle,
  ShieldCheck,
  BookOpen,
  Link2,
} from 'lucide-react';
import { ConfigSection } from './ChatbotConfigPage';

const sections: {
  key: ConfigSection;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  { key: 'general', label: 'General', icon: <Settings size={16} />, description: 'Property ID & basic settings' },
  { key: 'greeting', label: 'Greeting Message', icon: <MessageCircle size={16} />, description: 'Customize welcome text' },
  { key: 'guardrails', label: 'Guardrails', icon: <ShieldCheck size={16} />, description: 'Hallucination & safety controls' },
  { key: 'course-mapping', label: 'Course Mapping', icon: <BookOpen size={16} />, description: 'Map knowledge to courses' },
  { key: 'citations', label: 'Citations & Sources', icon: <Link2 size={16} />, description: 'Source attribution settings' },
];

export default function ConfigNav({
  activeSection,
  onSectionChange,
}: {
  activeSection: ConfigSection;
  onSectionChange: (s: ConfigSection) => void;
}) {
  return (
    <nav className="w-56 flex-shrink-0 sticky top-6">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {sections.map((sec) => (
          <button
            key={`confignav-${sec.key}`}
            onClick={() => onSectionChange(sec.key)}
            className={`w-full flex items-start gap-3 px-4 py-3.5 text-left border-b border-border last:border-0 transition-all duration-150 ${
              activeSection === sec.key
                ? 'bg-primary/5 border-l-2 border-l-primary' :'hover:bg-muted'
            }`}
          >
            <span
              className={`mt-0.5 flex-shrink-0 ${
                activeSection === sec.key ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {sec.icon}
            </span>
            <div>
              <p
                className={`text-sm font-600 ${
                  activeSection === sec.key ? 'text-primary' : 'text-foreground'
                }`}
              >
                {sec.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {sec.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}