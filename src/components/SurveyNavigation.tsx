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
          {/* Bottom Navigation */}
            <div className="w-full max-w-4xl flex justify-between mt-6">
            {/* Go Back Button (Always Visible, Handles Section Transitions) */}
            <button
                onClick={() => {
                    if (step === 1 && typeof previousSectionPath !== "undefined") {
                        router.push(previousSectionPath);
                      } else {
                    handleBack(); // ✅ Normal back navigation
                }
                }}
                className="px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-secondary"
            >
                ← Go back
            </button>

            {/* Continue Button (Handles Section Transitions) */}
            <button
                onClick={() => {
                    if (step === totalSteps && typeof nextSectionPath !== "undefined") {
                        router.push(nextSectionPath);
                      } else {
                    handleNext(); // ✅ Normal forward navigation
                }
                }}
                className={`px-6 py-3 rounded-lg text-lg ${
                isNextDisabled
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-primary text-white hover:bg-secondary"
                }`}
                disabled={isNextDisabled}
            >
                Continue →
            </button>
            </div>
        </div>
      </>
    );
  }
  