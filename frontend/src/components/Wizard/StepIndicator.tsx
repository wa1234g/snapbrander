import React from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { CheckIcon } from 'lucide-react';

const StepIndicator: React.FC = () => {
  const { currentStep, steps } = useWizard();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, index) => (
                <li key={step.id} className="relative flex-1">
                  <div className="flex items-center">
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`
                          flex items-center justify-center w-10 h-10 rounded-full border-2 
                          ${
                            index < currentStep
                              ? 'bg-primary-600 border-primary-600'
                              : index === currentStep
                              ? 'border-primary-600 bg-white'
                              : 'border-gray-300 bg-white'
                          }
                        `}
                      >
                        {index < currentStep ? (
                          <CheckIcon className="w-6 h-6 text-white" />
                        ) : (
                          <span
                            className={`
                              text-sm font-medium
                              ${
                                index === currentStep
                                  ? 'text-primary-600'
                                  : 'text-gray-500'
                              }
                            `}
                          >
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div
                        className={`
                          hidden sm:block absolute top-5 left-10 w-full h-0.5
                          ${index < currentStep ? 'bg-primary-600' : 'bg-gray-300'}
                        `}
                      />
                    )}
                  </div>
                  
                  <div className="mt-3 text-center">
                    <p
                      className={`
                        text-sm font-medium
                        ${
                          index <= currentStep
                            ? 'text-primary-600'
                            : 'text-gray-500'
                        }
                      `}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
