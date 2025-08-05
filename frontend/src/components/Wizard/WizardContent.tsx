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
      case 1:
        return <BusinessInfoStep />;
      case 2:
        return <ProjectDescriptionStep />;
      case 3:
        return <TemplateSelectionStep />;
      case 4:
        return <ColorSelectionStep />;
      case 5:
        return <LogoStep />;
      case 6:
        return <ModulesStep />;
      case 7:
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
