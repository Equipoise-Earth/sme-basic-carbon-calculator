"use client";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ Added

interface SurveyNavigationProps {
  step: number;
  totalSteps: number;
  handleNext: () => void;
  handleBack: () => void;
  isNextDisabled?: boolean;
  isIntroduction?: boolean; // ✅ Add this prop
  previousSectionPath?: string; // ✅ Add this prop
  nextSectionPath?: string;     // ✅ Add this prop
}

export default function SurveyNavigation({
  step,
  totalSteps,
  handleNext,
  handleBack,
  isNextDisabled = false,
  isIntroduction = false, // ✅ Default to false
  previousSectionPath,    // ✅ Destructure
  nextSectionPath,        // ✅ Destructure
}: SurveyNavigationProps) {
  const router = useRouter(); // ✅ Use router

  return (
    <div className="w-full max-w-4xl flex justify-between mt-6">
      
      {/* Go Back Button (Hidden on Intro Step 1) */}
      {!(isIntroduction && step === 1) && (
        <button
          onClick={() => {
            if (step === 1 && previousSectionPath) {
              router.push(previousSectionPath); // ✅ Navigate back
            } else {
              handleBack();
            }
          }}
          className="px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 ease-in-out bg-secondary text-white border-2 border-white hover:bg-transparent hover:border-2 hover:border-primary hover:text-primary"
        >
          ← GO BACK
        </button>
      )}

      {/* Powered by Equipoise Logo */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full mt-4 md:mt-0">
        <span className="text-sm text-darkGrey">Powered by</span>
        <Image
          src="/logos/Equipoise_Logo-Vector.png"
          alt="Equipoise Logo"
          width={100}
          height={40}
          className="h-auto"
        />
      </div>

      {/* Continue / Get Started Button */}
      {isIntroduction && step === 1 ? (
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 ease-in-out bg-secondary text-white border-2 border-white hover:bg-transparent hover:border-2 hover:border-primary hover:text-primary"
        >
          GET STARTED
        </button>
      ) : (
        <button
          onClick={() => {
            if (step === totalSteps && nextSectionPath) {
              router.push(nextSectionPath); // ✅ Navigate forward
            } else {
              handleNext();
            }
          }}
          className={`px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 ease-in-out ${
            isNextDisabled
              ? "bg-gray-400 text-white border-2 border-gray-400 cursor-not-allowed"
              : "bg-secondary text-white border-2 border-white hover:bg-transparent hover:border-2 hover:border-primary hover:text-primary"
          }`}
          disabled={isNextDisabled}
        >
          CONTINUE →
        </button>
      )}
    </div>
  );
}
