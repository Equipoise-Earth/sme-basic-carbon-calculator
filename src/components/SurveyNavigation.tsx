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
    <div className="w-full max-w-4xl flex flex-col items-center gap-4 mt-6 md:mt-10 px-4">
      
      {/* Button Row (Centered on Mobile, Spaced on Desktop) */}
<div className="w-full flex flex-wrap justify-center md:justify-between items-center gap-4">
  
  {/* Back Button (Left-Aligned on Desktop, Centered on Mobile) */}
  {!(isIntroduction && step === 1) && (
    <button
      onClick={handleBackward}
      className="px-6 py-3 w-[140px] h-[48px] flex items-center justify-center rounded-lg text-lg font-bold leading-normal transition-all duration-300 ease-in-out bg-secondary text-white border-2 border-white hover:bg-transparent hover:border-2 hover:border-primary hover:text-primary"
    >
      ← BACK
    </button>
  )}

  {/* Next / Get Started / Calculate Button */}
  {isIntroduction && step === 1 ? (
    <button
      onClick={handleNext}
      className="px-6 py-3 w-[140px] h-[48px] flex items-center justify-center rounded-lg text-lg font-bold leading-normal transition-all duration-300 ease-in-out bg-secondary text-white border-2 border-white hover:bg-transparent hover:border-2 hover:border-primary hover:text-primary"
    >
      GET STARTED
    </button>
  ) : (
    <button
      onClick={handleForward}
      className={`px-6 py-3 w-[140px] h-[48px] flex items-center justify-center rounded-lg text-lg font-bold leading-normal transition-all duration-300 ease-in-out ${
        isNextDisabled
          ? "bg-gray-400 text-white border-2 border-gray-400 cursor-not-allowed"
          : "bg-secondary text-white border-2 border-white hover:bg-transparent hover:border-2 hover:border-primary hover:text-primary"
      }`}
      disabled={isNextDisabled}
    >
      {isCompanyDataSection && step === totalSteps ? "CALCULATE!" : "NEXT →"}
    </button>
  )}
</div>

  
      {/* Powered by Equipoise (Always Centered Below Buttons) */}
      <div className="w-full flex justify-center mt-4">
        <div className="flex items-center gap-2">
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
      </div>
  
    </div>
  );
    
}