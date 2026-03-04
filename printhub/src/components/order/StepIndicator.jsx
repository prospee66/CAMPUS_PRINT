import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Upload', full: 'Upload Files' },
  { label: 'Options', full: 'Print Options' },
  { label: 'Delivery', full: 'Delivery' },
  { label: 'Review', full: 'Review' },
  { label: 'Payment', full: 'Payment' },
];

export default function StepIndicator({ currentStep }) {
  const pct = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="mb-8">
      {/* Mobile: progress bar + step label */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-800">
            {STEPS[currentStep - 1]?.full}
          </p>
          <p className="text-xs font-medium text-gray-400">
            Step {currentStep} of {STEPS.length}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between">
          {STEPS.map((_, i) => {
            const idx = i + 1;
            const done = currentStep > idx;
            const active = currentStep === idx;
            return (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  done ? 'bg-accent' : active ? 'bg-primary-600 scale-125' : 'bg-gray-300'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet: full step row */}
      <div className="hidden sm:flex items-start justify-between">
        {STEPS.map((step, i) => {
          const idx = i + 1;
          const done = currentStep > idx;
          const active = currentStep === idx;
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-200
                    ${done
                      ? 'bg-accent border-accent text-white'
                      : active
                      ? 'bg-primary-600 border-primary-600 text-white ring-4 ring-primary-100'
                      : 'bg-white border-gray-300 text-gray-400'}`}
                >
                  {done ? <Check size={15} strokeWidth={3} /> : idx}
                </div>
                <span
                  className={`text-xs mt-2 font-medium whitespace-nowrap ${
                    active ? 'text-primary-600' : done ? 'text-accent' : 'text-gray-400'
                  }`}
                >
                  {step.full}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 mb-5 min-w-[20px] transition-all duration-300 ${
                    currentStep > idx ? 'bg-accent' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
