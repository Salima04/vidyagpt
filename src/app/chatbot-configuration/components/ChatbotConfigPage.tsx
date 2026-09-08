'use client';

import React, { useState } from 'react';
import ConfigNav from './ConfigNav';
import GeneralPanel from './GeneralPanel';
import GreetingPanel from './GreetingPanel';
import GuardrailsPanel from './GuardrailsPanel';
import CourseMappingPanel from './CourseMappingPanel';
import CitationsPanel from './CitationsPanel';

export type ConfigSection =
  | 'general' |'greeting' |'guardrails' |'course-mapping' |'citations';

export default function ChatbotConfigPage() {
  const [activeSection, setActiveSection] = useState<ConfigSection>('general');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-700 text-foreground">Chatbot Configuration</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure VidyaGPT&apos;s behavior, responses, and knowledge guardrails
        </p>
      </div>

      <div className="flex gap-6 items-start">
        <ConfigNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <div className="flex-1 min-w-0">
          {activeSection === 'general' && <GeneralPanel />}
          {activeSection === 'greeting' && <GreetingPanel />}
          {activeSection === 'guardrails' && <GuardrailsPanel />}
          {activeSection === 'course-mapping' && <CourseMappingPanel />}
          {activeSection === 'citations' && <CitationsPanel />}
        </div>
      </div>
    </div>
  );
}