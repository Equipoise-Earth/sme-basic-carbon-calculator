"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import SurveyNavigation from "@/components/SurveyNavigation";

export default function IntroductionSurvey() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string) || 1;
  const totalSteps = 5;

  const [inputValue, setInputValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  // ✅ Function to check if "Continue" should be disabled
  const isNextDisabled = () => {
    if (step === 2 && !isChecked) return true; // Terms checkbox required
    if (step === 3 && !inputValue.trim()) return true; // Company name required
    if (step === 4 && !inputValue) return true; // Country selection required
    if (step === 5 && !inputValue) return true; // Sector selection required
    return false; // Otherwise, allow proceeding
  };

  const handleNext = () => {
    if (step < totalSteps) router.push(`/survey/introduction/${step + 1}`);
  };

  const handleBack = () => {
    if (step > 1) router.push(`/survey/introduction/${step - 1}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-lightGrey px-4">
      
      {/* ✅ NAVIGATION BAR (Cancel + Step Counter) */}
      <div className="w-full max-w-4xl flex justify-between items-center pt-6">
        <button 
          onClick={() => router.push("/")} 
          className="text-darkGrey text-sm font-sofia hover:underline"
        >
          Cancel
        </button>
        <p className="text-darkGrey text-sm font-sofia">
          Step {step} / {totalSteps}
        </p>
      </div>

      {/* ✅ CONTENT SECTION */}
      <div className="bg-white rounded-lg shadow-md p-10 mt-4 w-full max-w-4xl text-center">
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold font-sofia">
              Welcome to the <span className="text-primary">Business Carbon Calculator</span>
            </h1>
            <div className="flex justify-center my-6">
              <Image src="/illustrations/Analytics-amico.svg" alt="Carbon Calculator" width={500} height={300} />
            </div>
            <p className="text-darkGrey">We are delighted to partner with you on measuring your company’s CO₂ emissions...</p>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold font-sofia">Terms & Conditions</h1>
            <p className="text-darkGrey mt-4">Placeholder text for terms and conditions.</p>
            <div className="mt-6 flex items-center justify-center">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-darkGrey">I accept the terms and conditions</label>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold font-sofia">What is the name of your company?</h1>
            <input
              type="text"
              placeholder="Enter company name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border p-2 rounded w-full mt-4 text-center"
            />
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="text-2xl font-bold font-sofia">Where is your company located?</h1>
            <p className="text-darkGrey mt-2 text-sm">
              The Business Carbon Calculator makes key assumptions based on your country.
            </p>
            <select
              className="border p-2 rounded w-full mt-4 text-center"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            >
              <option value="">Select a country</option>
              <option value="UK">United Kingdom</option>
              <option value="USA">United States</option>
              <option value="Germany">Germany</option>
            </select>
          </>
        )}

        {step === 5 && (
          <>
            <h1 className="text-2xl font-bold font-sofia">What sector do you operate in?</h1>
            <select
              className="border p-2 rounded w-full mt-4 text-center"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            >
              <option value="">Select a sector</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
          </>
        )}
      </div>

      {/* ✅ SURVEY NAVIGATION (BOTTOM) */}
      <SurveyNavigation
        step={step}
        totalSteps={totalSteps}
        handleNext={handleNext}
        handleBack={handleBack}
        isNextDisabled={isNextDisabled()} // ✅ Disable "Continue" if required data missing
      />
    </div>
  );
}
