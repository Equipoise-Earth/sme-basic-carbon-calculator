"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CompanySurvey() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string) || 1;
  const totalSteps = 16; // Placeholder, will adjust as needed

  const [inputValue, setInputValue] = useState("");

  const handleNext = () => {
    if (step < totalSteps) router.push(`/survey/company/${step + 1}`);
  };

  const handleBack = () => {
    if (step > 1) router.push(`/survey/company/${step - 1}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-lightGrey px-4">
      {/* Top Navigation (Back & Progress) */}
      <div className="w-full max-w-4xl flex justify-between items-center pt-6">
        {step > 1 ? (
          <button onClick={handleBack} className="text-darkGrey text-sm font-sofia">
            ← Go back
          </button>
        ) : (
          <div /> // Keeps alignment when "Go back" is hidden
        )}
        <p className="text-darkGrey text-sm font-sofia">
          {step} / {totalSteps}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-4xl mt-2">
        <div className="h-1 bg-gray-300 rounded-full">
          <div
            className="h-1 bg-primary rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Two-Column Layout: Left Teal, Right White */}
        <div className="bg-white rounded-lg shadow-md mt-4 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">
        {/* Left Column (Teal Section) */}
        <div className="bg-secondary p-10 text-white flex items-center md:rounded-l-lg">
            <h2 className="text-2xl font-bold">Company Vehicles</h2>
        </div>

        {/* Right Column (White Section - Questions) */}
        <div className="p-10">
            <p className="text-darkGrey">How many litres of petrol and diesel fuel did your company's vehicles use?</p>
        </div>
        </div>

      {/* Buttons */}
      <div className="w-full max-w-4xl flex justify-between mt-6">
        <button className="text-darkGrey text-sm">Cancel</button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-secondary"
        >
          {step === 1 ? "Next →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
