interface SurveyNavigationProps {
    step: number;
    totalSteps: number;
    handleNext: () => void;
    handleBack: () => void;
    isNextDisabled?: boolean; // ✅ Add a new prop for disabling the button
  }
  
  export default function SurveyNavigation({
    step,
    totalSteps,
    handleNext,
    handleBack,
    isNextDisabled = false, // Default to false
  }: SurveyNavigationProps) {
    return (
      <>
        {/* Bottom Navigation */}
        <div className="w-full max-w-4xl flex justify-between mt-6">
          {/* Go Back Button (Always Visible) */}
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-secondary"
          >
            ← Go back
          </button>
  
          {/* Continue Button (Disabled if required inputs are empty) */}
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-secondary">
            Continue →
            </button>
        </div>
      </>
    );
  }
  