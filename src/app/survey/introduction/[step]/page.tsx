"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function IntroductionSurvey({ params }: { params: { step: string } }) {
  const router = useRouter();
  const step = parseInt(params.step) || 1; // Get the current step
  const totalSteps = 5; // Total steps for Introduction & Guidance
  const [inputValue, setInputValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleNext = () => {
    if (step < totalSteps) router.push(`/survey/introduction/${step + 1}`);
  };

  const handleBack = () => {
    if (step > 1) router.push(`/survey/introduction/${step - 1}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-lightGrey px-4">
      {/* Back Button */}
      {step > 1 && (
        <div className="w-full max-w-4xl pt-6">
          <button onClick={handleBack} className="text-darkGrey text-lg">
            ← Go back
          </button>
        </div>
      )}

      {/* Step Indicator */}
      <div className="w-full max-w-4xl text-center text-darkGrey text-sm mt-4">
        Step {step} / {totalSteps}
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-lg shadow-md p-10 mt-4 w-full max-w-4xl text-center">
        {/* Step 2: Terms & Conditions */}
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
              <label htmlFor="terms" className="text-darkGrey">
                I accept the terms and conditions
              </label>
            </div>
            <button
              onClick={handleNext}
              disabled={!isChecked}
              className={`mt-6 px-6 py-3 rounded-lg text-lg ${
                isChecked ? "bg-primary text-white hover:bg-secondary" : "bg-gray-300 text-gray-500"
              }`}
            >
              Continue →
            </button>
          </>
        )}

        {/* Step 3: Company Name */}
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
            <button
              onClick={handleNext}
              disabled={!inputValue.trim()}
              className={`mt-6 px-6 py-3 rounded-lg text-lg ${
                inputValue.trim()
                  ? "bg-primary text-white hover:bg-secondary"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              Continue →
            </button>
          </>
        )}

        {/* Step 4: Location Dropdown */}
        {step === 4 && (
          <>
            <h1 className="text-2xl font-bold font-sofia">Where is your company located?</h1>
            <p className="text-darkGrey mt-2 text-sm">
              The Business Carbon Calculator makes key assumptions based on your country.
            </p>
            <select
              className="border p-2 rounded w-full mt-4 text-center"
              onChange={(e) => setInputValue(e.target.value)}
            >
              <option value="">Select a country</option>
              <option value="UK">United Kingdom</option>
              <option value="USA">United States</option>
              <option value="Germany">Germany</option>
            </select>
            <button
              onClick={handleNext}
              disabled={!inputValue}
              className={`mt-6 px-6 py-3 rounded-lg text-lg ${
                inputValue ? "bg-primary text-white hover:bg-secondary" : "bg-gray-300 text-gray-500"
              }`}
            >
              Continue →
            </button>
          </>
        )}

        {/* Step 5: Sector Dropdown */}
        {step === 5 && (
          <>
            <h1 className="text-2xl font-bold font-sofia">What sector do you operate in?</h1>
            <select
              className="border p-2 rounded w-full mt-4 text-center"
              onChange={(e) => setInputValue(e.target.value)}
            >
              <option value="">Select a sector</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
            <button
              onClick={() => router.push("/survey/company/1")} // Moves to next section
              disabled={!inputValue}
              className={`mt-6 px-6 py-3 rounded-lg text-lg ${
                inputValue ? "bg-primary text-white hover:bg-secondary" : "bg-gray-300 text-gray-500"
              }`}
            >
              Continue →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
