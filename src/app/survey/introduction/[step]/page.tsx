"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function IntroductionSurvey() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string) || 1;
  const totalSteps = 5;

  const [inputValue, setInputValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleNext = () => {
    if (step < totalSteps) router.push(`/survey/introduction/${step + 1}`);
  };

  const handleBack = () => {
    if (step > 1) router.push(`/survey/introduction/${step - 1}`);
  };

  return (
    <div className="w-full max-w-4xl flex justify-between items-center pt-6">
        {step > 1 ? (
            <button onClick={handleBack} className="text-darkGrey text-sm font-sofia">
              ← Go back
            </button>
        ) : (
    <div></div> // Keeps alignment when "Go back" is hidden
        )}
        <p className="text-darkGrey text-sm font-sofia">
            Step {step} / {totalSteps}
        </p>
    </div>

      {/* Content Section */}
      <div className="bg-white rounded-lg shadow-md p-10 mt-4 w-full max-w-4xl text-center">
        {/* ✅ STEP 1: WELCOME PAGE */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold font-sofia">
              Welcome to the{" "}
              <span className="text-primary">Business Carbon Calculator</span>
            </h1>

            {/* Image */}
            <div className="flex justify-center my-6">
              <Image
                src="/illustrations/Analytics-amico.svg"
                alt="Carbon Calculator Illustration"
                width={500}
                height={300}
              />
            </div>

            {/* Description */}
            <p className="text-darkGrey">
              We are delighted to partner with you on measuring your company’s CO₂
              emissions. The more you put into the Business Carbon Calculator, the
              more you get out. To provide you with the most comprehensive insights
              and benchmarks, we need to get to know you first.
            </p>

            {/* "Get Started" Button → Goes to Step 2 */}
            <button
              onClick={handleNext}
              className="mt-6 px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-secondary"
            >
              Get started →
            </button>
          </>
        )}

        {/* ✅ STEP 2: TERMS & CONDITIONS */}
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

        {/* ✅ STEP 3: COMPANY NAME */}
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

        {/* ✅ STEP 4: LOCATION DROPDOWN */}
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

        {/* ✅ STEP 5: SECTOR DROPDOWN */}
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
