"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SurveyNavigation from "@/components/SurveyNavigation";

export default function CompanyGuidance() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string) || 1;
  const totalGuidanceSteps = 2; // 2 guidance screens

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

        <SurveyNavigation
        step={step}
        totalSteps={totalGuidanceSteps}
        handleNext={() => router.push(step < totalGuidanceSteps ? `/survey/company/guidance/${step + 1}` : `/survey/company/1`)}
        handleBack={() => router.push(step > 1 ? `/survey/company/guidance/${step - 1}` : `/survey/introduction/5`)}
        />

    </div>

  );
}
