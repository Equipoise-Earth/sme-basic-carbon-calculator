"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function CompanyGuidance() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string) || 1;
  const totalGuidanceSteps = 2; // 2 guidance screens

  const handleBack = () => {
    if (step > 1) {
      router.push(`/survey/company/guidance/${step - 1}`);
    } else {
      router.push(`/survey/introduction/5`); // ✅ Go back to last Introduction step
    }
  };

  const handleNext = () => {
    if (step < totalGuidanceSteps) {
      router.push(`/survey/company/guidance/${step + 1}`);
    } else {
      router.push(`/survey/company/1`); // ✅ Move to Company Data (Step 1)
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-lightGrey px-4">
      {/* Cancel Button (Now Top Left) */}
      <div className="w-full max-w-4xl pt-6 flex justify-between">
        <button onClick={() => router.push("/")} className="text-darkGrey text-sm">
          Cancel
        </button>
      </div>
  
      {/* Two-Column Layout: Left White, Right Teal */}
      <div className="bg-white md:rounded-l-lg shadow-md mt-4 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">
        {/* Left Column (White Section) */}
        <div className="p-10">
          {step === 1 && (
            <>
              <h1 className="text-3xl font-bold font-sofia">
                Emissions estimates are all about the <span className="text-primary">data</span>
              </h1>
              <p className="text-darkGrey mt-4">Here's what you'll need to gather:</p>
            </>
          )}
        </div>
  
        {/* Right Column (Teal Section) */}
        <div className="bg-secondary p-10 text-white flex items-center md:rounded-r-lg">
          <h2 className="text-2xl font-bold">Company Data</h2>
        </div>
      </div>
  
      {/* Bottom Navigation */}
      <div className="w-full max-w-4xl flex justify-between mt-6">
        {/* "Go Back" (Bottom Left) */}
        {step > 1 ? (
          <button onClick={() => router.back()} className="px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-secondary">
          ← Go back
        </button>
        ) : (
          <div />
        )}
  
        {/* "Next / Start" (Bottom Right) */}
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-secondary"
        >
          {step === 2 ? "Start →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
