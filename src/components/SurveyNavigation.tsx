"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SurveyNavigationProps {
  step: number;
  totalSteps: number;
  handleNext: () => void;
  handleBack: () => void;
  isNextDisabled?: boolean;
  isIntroduction?: boolean;
  isCompanyDataSection?: boolean; 
  previousSectionPath?: string;
  nextSectionPath?: string;
}

export default function SurveyNavigation({
  step,
  totalSteps,
  handleNext,
  handleBack,
  isNextDisabled = false,
  isIntroduction = false,
  isCompanyDataSection = false,
  previousSectionPath,
  nextSectionPath,
}: SurveyNavigationProps) {
  const router = useRouter();

  const handleForward = () => {
    if (isCompanyDataSection && step === totalSteps) {
      router.push("/report"); 
    } else if (nextSectionPath && step === totalSteps) {
      router.push(nextSectionPath); 
    } else {
      handleNext(); 
    }
  };

  const handleBackward = () => {
    if (step === 1 && previousSectionPath) {
      router.push(previousSectionPath); 
    } else {
      handleBack(); 
    }
  };

  return (
    <div className="w-full max-w-4xl flex justify-between mt-6">
      
      {/* Back Button */}
      {!(isIntroduction && step === 1) && (
        <button
          onClick={handleBackward}
          className="px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 ease-in-out bg-secondary text-white border-2 border-white hover:bg-transparent hover:border-2 hover:border-primary hover:text-primary"
        >
          ← GO BACK
        </button>
      )}

      {/* Powered by Equipoise Logo */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full mt-4 md:mt-0">
        <span className="text-sm text-darkGrey">Powered by</span>
        <a href="https://equipoise.earth" target="_blank" rel="noopener noreferrer">
          <Image
            src="/logos/Equipoise_Logo-Vector.png"
            alt="Equipoise Logo"
            width={100}
            height={40}
            className="h-auto"
            unoptimized
          />
        </a>
      </div>

      {/* Continue / Get Started / Calculate Button */}
      {isIntroduction && step === 1 ? (
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 ease-in-out bg-secondary text-white border-2 border-white hover:bg-transparent hover:border-2 hover:border-primary hover:text-primary"
        >
          GET STARTED
        </button>
      ) : (
        <button
          onClick={handleForward}
          className={`px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 ease-in-out ${
            isNextDisabled
              ? "bg-gray-400 text-white border-2 border-gray-400 cursor-not-allowed"  // ✅ Disabled style
              : "bg-secondary text-white border-2 border-white hover:bg-transparent hover:border-2 hover:border-primary hover:text-primary"
          }`}
          disabled={isNextDisabled}  // ✅ Simplified disabling logic
        >
          {isCompanyDataSection && step === totalSteps ? "CALCULATE!" : "CONTINUE →"}
        </button>
      )}
    </div>
  );
}
