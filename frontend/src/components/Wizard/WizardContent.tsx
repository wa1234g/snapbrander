import React from 'react';
import { useWizard } from '../../contexts/WizardContext';
import BusinessInfoStep from './BusinessInfoStep';
import ProjectDescriptionStep from './ProjectDescriptionStep';
import TemplateSelectionStep from './TemplateSelectionStep';
import ColorSelectionStep from './ColorSelectionStep';
import LogoStep from './LogoStep';
import ModulesStep from './ModulesStep';
import GenerationStep from './GenerationStep';

const WizardContent: React.FC = () => {
  const { currentStep } = useWizard();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BusinessInfoStep />;
      case 1:
        return <ProjectDescriptionStep />;
      case 2:
        return <TemplateSelectionStep />;
      case 3:
        return <ColorSelectionStep />;
      case 4:
        return <LogoStep />;
      case 5:
        return <ModulesStep />;
      case 6:
        return <GenerationStep />;
      default:
        return <BusinessInfoStep />;
    }
  };

  return (
    <div className="font-cairo">
      {renderStep()}
    </div>
  );
};

export default WizardContent;
