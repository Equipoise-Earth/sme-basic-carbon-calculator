import Image from "next/image"; 

interface SurveyNavigationProps {
    step: number;
    totalSteps: number;
    handleNext: () => void;
    handleBack: () => void;
    isNextDisabled?: boolean;
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
                    handleBack();
                }
                }}
                className="px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-secondary"
            >
                ← Go back
            </button>
        
            {/* Powered by Equipoise Logo */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full mt-4 md:mt-0">
                <span className="text-sm text-darkGrey">Powered by</span>
                <Image
                    src="/logos/Equipoise_Logo+Vector.png"
                    alt="Equipoise Logo"
                    width={100}
                    height={40}
                    className="h-auto"
                />
            </div>


            {/* Continue Button (Handles Section Transitions) */}
            <button
                onClick={() => {
                    if (step === totalSteps && typeof nextSectionPath !== "undefined") {
                        router.push(nextSectionPath);
                      } else {
                    handleNext(); 
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
  