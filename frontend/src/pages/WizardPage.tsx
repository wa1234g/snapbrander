import React from 'react';
import { WizardProvider } from '../contexts/WizardContext';
import { WizardContent } from '../components/Wizard/WizardContent';

export const WizardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <WizardProvider>
        <WizardContent />
      </WizardProvider>
    </div>
  );
};
