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
      <div className="shadow-md mt-4 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-lg">
        
        {/* Left Column (White Section - Dynamic Content) */}
        <div className="p-10 bg-white">
          {step === 1 && (
            <>
              <h1 className="text-3xl font-bold font-sofia">
                Emissions estimates are all about the <span className="text-primary">data</span>
              </h1>
              <p className="text-darkGrey mt-4">Here's what you'll need to gather:</p>

              {/* Data Points */}
              <div className="mt-6 space-y-6">
                {/* Data Point 1 */}
                <div className="flex items-center">
                  <Image src="/illustrations/Building-amico.svg" alt="Company Size" width={60} height={60} />
                  <p className="ml-4 text-darkGrey">
                    <strong>Number of employees, size of facilities, annual revenue</strong>
                  </p>
                </div>

                {/* Data Point 2 */}
                <div className="flex items-center">
                  <Image src="/illustrations/Fuel station-amico.svg" alt="Fuel Usage" width={60} height={60} />
                  <p className="ml-4 text-darkGrey">
                    <strong>Heating costs and information about company-owned vehicles</strong>
                  </p>
                </div>

                {/* Data Point 3 */}
                <div className="flex items-center">
                  <Image src="/illustrations/Delivery address-amico.svg" alt="Expenses" width={60} height={60} />
                  <p className="ml-4 text-darkGrey">
                    <strong>Company expenses in areas like business travel, transport / freight, capital goods, and more</strong>
                  </p>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-3xl font-bold font-sofia">
                Before <span className="text-primary">we start</span>
              </h1>

              {/* Step List */}
              <div className="mt-6 space-y-6">
  
                <div className="flex items-start">
                  <h2 className="text-3xl font-bold text-primary w-10 text-right">1.</h2>
                  <div className="ml-4">
                    <p className="font-bold text-darkGrey">Thorough means accurate</p>
                    <p className="text-darkGrey">
                      No need to be perfect, but the more data you put into the calculator, the more accurate and credible your emissions estimate will be.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <h2 className="text-3xl font-bold text-primary w-10 text-right">2.</h2>
                  <div className="ml-4">
                    <p className="font-bold text-darkGrey">Nothing extra, it all factors in</p>
                    <p className="text-darkGrey">
                      Equipoise’s comprehensive emissions analysis will attach CO₂ equivalents to the business expenses you provide (large and small). All data that we ask for either factors into your overall emissions estimate or industry benchmarking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <h2 className="text-3xl font-bold text-primary w-10 text-right">3.</h2>
                  <div className="ml-4">
                    <p className="font-bold text-darkGrey">Save the planet, we’ll save your data</p>
                    <p className="text-darkGrey">
                      Your profile saves as you go, so you can pick up where you left off or edit what you previously entered.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column (Teal Section) */}
        <div className="bg-secondary p-10 text-white flex items-center md:rounded-r-lg relative">
          {/* SME Logo (Top Right) */}
          <Image 
            src="/logos/SMECH_logo_white.svg" 
            alt="SME Climate Hub Logo" 
            width={120} 
            height={40} 
            className="absolute top-4 right-4"
          />
          <h2 className="text-2xl font-bold"></h2>
        </div>
      </div>

      {/* Navigation */}
      <SurveyNavigation
        step={step}
        totalSteps={totalGuidanceSteps}
        handleNext={() => router.push(step < totalGuidanceSteps ? `/survey/company/guidance/${step + 1}` : `/survey/company/1`)}
        handleBack={() => router.push(step > 1 ? `/survey/company/guidance/${step - 1}` : `/survey/introduction/5`)}
      />
    </div>
  );
}
