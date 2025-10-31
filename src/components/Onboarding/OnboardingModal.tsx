import { useState } from 'react';
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to SocialHub AI',
    description: 'Your all-in-one platform for managing social media content with AI-powered tools',
  },
  {
    id: 'ai-copilot',
    title: 'Meet Your AI Co-Pilot',
    description: 'Get instant content ideas, strategies, and marketing advice from our AI assistant',
  },
  {
    id: 'caption-generator',
    title: 'Generate Perfect Captions',
    description: 'Create platform-optimized captions with the right tone and hashtags in seconds',
  },
  {
    id: 'calendar',
    title: 'Plan Your Content',
    description: 'Schedule posts across multiple platforms with our visual calendar',
  },
  {
    id: 'asset-studio',
    title: 'Create Beautiful Assets',
    description: 'Auto-resize images and videos for every platform with one click',
  },
  {
    id: 'analytics',
    title: 'Track Your Performance',
    description: 'Monitor engagement, reach, and optimize your posting strategy',
  },
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, steps[currentStep].id]);
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (user) {
      await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      for (const step of steps) {
        await supabase.from('onboarding_progress').upsert({
          user_id: user.id,
          step_name: step.id,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      }
    }
    onClose();
  };

  const handleSkip = async () => {
    if (user) {
      await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
    }
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Getting Started</h2>
              <p className="text-sm text-slate-600">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="flex gap-2 mb-8">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    index <= currentStep
                      ? 'bg-blue-600'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <span className="text-2xl font-bold text-blue-600">{currentStep + 1}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {currentStepData.title}
              </h3>
              <p className="text-slate-600 text-lg max-w-md mx-auto">
                {currentStepData.description}
              </p>
            </div>

            <div className="bg-slate-100 rounded-xl aspect-video mb-6 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <p className="text-sm">Interactive tutorial video</p>
                <p className="text-xs mt-1">{currentStepData.id}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {currentStep === 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2">Quick Tips:</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Connect your social accounts to start posting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Use AI tools to generate content ideas and captions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Schedule posts in advance with the calendar</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Skip Tutorial
          </button>
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Check className="w-5 h-5" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
