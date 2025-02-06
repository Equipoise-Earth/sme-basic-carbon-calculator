"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import SurveyNavigation from "@/components/SurveyNavigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CompanySurvey() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string) || 1;
  const totalSteps = 9;
  const userId = "testUser123"; // Placeholder, replace with auth later

  const [responses, setResponses] = useState({
    timePeriodFrom: "",
    timePeriodTo: "",
    employees: "",
    revenue: "",
    facilities: "",
    vehicles: "",
    machinery: "",
    electricity: "",
    businessTravel: "",
    otherExpenses: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage before Firestore
  useEffect(() => {
    const storedData = localStorage.getItem(`companyResponses_${userId}`);
    if (storedData) {
      setResponses(JSON.parse(storedData));
      setIsLoading(false);
      return;
    }

    const fetchResponses = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setResponses(data);
          localStorage.setItem(`companyResponses_${userId}`, JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, []);

  const saveResponse = async (newData: Partial<typeof responses>) => {
    const updatedResponses = { ...responses, ...newData };
    setResponses(updatedResponses);
    localStorage.setItem(`companyResponses_${userId}`, JSON.stringify(updatedResponses));

    try {
      await setDoc(doc(db, "users", userId), updatedResponses, { merge: true });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && (!responses.timePeriodFrom || !responses.timePeriodTo)) return true;
    if (step === 2 && !responses.employees) return true;
    if (step === 3 && !responses.revenue) return true;
    if (step === 4 && !responses.facilities) return true;
    if (step === 5 && !responses.vehicles) return true;
    if (step === 6 && !responses.machinery) return true;
    if (step === 7 && !responses.electricity) return true;
    if (step === 8 && !responses.businessTravel) return true;
    if (step === 9 && !responses.otherExpenses) return true;
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      router.push(`/survey/company/${step + 1}`);
    } else {
      router.push(`/survey/fuel-energy/1`); // Placeholder for next section
    }
  };

  const handleBack = () => {
    if (step > 1) {
      router.push(`/survey/company/${step - 1}`);
    } else {
      router.push(`/survey/company/guidance/2`); // Redirect to the last guidance step
    }
  };

  // Quick-fill for last financial year
const setLastFinancialYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  saveResponse({
    timePeriodFrom: `${year - 2}-04-01`,
    timePeriodTo: `${year - 1}-03-31`,
  });
};

// Quick-fill for last calendar year
const setLastCalendarYear = () => {
  const year = new Date().getFullYear() - 1;
  saveResponse({
    timePeriodFrom: `${year}-01-01`,
    timePeriodTo: `${year}-12-31`,
  });
};

  return (
    <div className="flex flex-col items-center min-h-screen bg-lightGrey px-4">
      {/* Top Navigation */}
      <div className="w-full max-w-4xl flex justify-between items-center pt-6">
        <button onClick={() => router.push("/")} className="text-darkGrey text-sm hover:underline">
          Cancel
        </button>
        <p className="text-darkGrey text-sm font-sofia">
          Step {step} / {totalSteps}
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

      {/* Two-Column Layout */}
      <div className="bg-white rounded-lg shadow-md mt-4 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">
        {/* Left Column */}
        <div className="bg-secondary p-10 text-white md:rounded-l-lg relative flex justify-between items-start">
          {/* SME Logo (Top Left) */}
          <Image 
            src="/logos/SMECH_logo_white.svg" 
            alt="SME Climate Hub Logo" 
            width={120} 
            height={40} 
            className="absolute top-6 left-6"
          />

          {/* Company Data Heading (Top Right) */}
          <h2 className="text-2xl font-bold absolute top-10 right-8">Company Data</h2>
        </div>


        {/* Right Column */}
        <div className="p-10">
        {step === 1 && (
            <>
              <h1 className="text-2xl font-bold">What is the time period you want to calculate emissions for?</h1>

              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600">From:</label>
                  <input
                    type="date"
                    value={responses.timePeriodFrom || ""}
                    onChange={(e) => saveResponse({ timePeriodFrom: e.target.value })}
                    className="border p-2 rounded w-full bg-gray-100"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm text-gray-600">To:</label>
                  <input
                    type="date"
                    value={responses.timePeriodTo || ""}
                    onChange={(e) => saveResponse({ timePeriodTo: e.target.value })}
                    className="border p-2 rounded w-full bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={setLastFinancialYear}
                  className="border border-black px-4 py-2 rounded hover:bg-gray-200"
                >
                  Last Financial Year
                </button>

                <button
                  onClick={setLastCalendarYear}
                  className="border border-black px-4 py-2 rounded hover:bg-gray-200"
                >
                  Last Calendar Year
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold">Employees</h1>
              <input
                type="number"
                value={responses.employees || ""}
                onChange={(e) => saveResponse({ employees: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-2xl font-bold">Revenue</h1>
              <input
                type="number"
                value={responses.revenue || ""}
                onChange={(e) => saveResponse({ revenue: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="text-2xl font-bold">Facilities</h1>
              <input
                type="text"
                value={responses.facilities || ""}
                onChange={(e) => saveResponse({ facilities: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </>
          )}

          {step === 5 && (
            <>
              <h1 className="text-2xl font-bold">Vehicles</h1>
              <input
                type="text"
                value={responses.vehicles || ""}
                onChange={(e) => saveResponse({ vehicles: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </>
          )}

          {step === 6 && (
            <>
              <h1 className="text-2xl font-bold">Machinery</h1>
              <input
                type="text"
                value={responses.machinery || ""}
                onChange={(e) => saveResponse({ machinery: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </>
          )}

          {step === 7 && (
            <>
              <h1 className="text-2xl font-bold">Electricity</h1>
              <input
                type="text"
                value={responses.electricity || ""}
                onChange={(e) => saveResponse({ electricity: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </>
          )}

          {step === 8 && (
            <>
              <h1 className="text-2xl font-bold">Business Travel</h1>
              <input
                type="text"
                value={responses.businessTravel || ""}
                onChange={(e) => saveResponse({ businessTravel: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </>
          )}

          {step === 9 && (
            <>
              <h1 className="text-2xl font-bold">Other Expenses</h1>
              <input
                type="text"
                value={responses.otherExpenses || ""}
                onChange={(e) => saveResponse({ otherExpenses: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </>
          )}
        </div>
      </div>

      {/* Survey Navigation */}
      <SurveyNavigation
        step={step}
        totalSteps={totalSteps}
        handleNext={handleNext}
        handleBack={handleBack}
        isNextDisabled={isNextDisabled()}
      />
    </div>
  );
}
