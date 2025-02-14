"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import SurveyNavigation from "@/components/SurveyNavigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { COUNTRIES } from "@/app/data/countries";

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
    workFromHomePercentage: "",
    revenue: "",
    facilities: "",
    vehicles: "",
    machinery: "",
    electricity: "",
    businessTravel: "",
    otherExpenses: "",
    currencyCode: "",
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

  const formatDate = (dateString: string) => {
    if (!dateString) return ""; // Return empty string if no date
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original string if invalid
  
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
  };
  

  const isNextDisabled = () => {
    if (step === 1 && (!responses.timePeriodFrom || !responses.timePeriodTo)) return true;
    if (step === 2 && (!responses.employees || parseInt(responses.employees) <= 0)) return true;
    if (step === 3 && (!responses.revenue || parseFloat(responses.revenue) <= 0)) return true;
    if (step === 4 && !responses.facilities.trim()) return true;
    if (step === 5 && !responses.vehicles.trim()) return true;
    if (step === 6 && !responses.machinery.trim()) return true;
    if (step === 7 && (!responses.electricity || parseFloat(responses.electricity) <= 0)) return true;
    if (step === 8 && (!responses.businessTravel || parseFloat(responses.businessTravel) <= 0)) return true;
    if (step === 9 && !responses.otherExpenses.trim()) return true;
    return false;
  };  

  const handleNext = () => {
    if (step < totalSteps) {
      router.push(`/survey/company/${step + 1}`);
    } else {
      router.push(`/report`); // Placeholder for next section
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

const pageContent = {
  1: {
    title: "Reporting Period",
    image: "/illustrations/Calendar-amico.svg",
    tip: "This is important to make sure you are reporting consistently. This is flexible, but typically reporting periods are 1 year and align with either the calendar or financial years."
  },
  2: {
    title: "Employee Details",
    image: "/illustrations/Team goals-amico.svg",
    tip: "Total headcount at the end of the year helps us understand the size of the business and estimate homeworking emissions. Note that this calculator is designed for businesses of less than 50 employees."
  },
  3: {
    title: "Company Revenue",
    image: "/illustrations/Analytics-amico.svg",
    tip: "Understanding company revenue allows us to provide a basis of comparison to other companies in you sector. This data, along with all company data provided, remains entirely private."
  },
  4: {
    title: "Facility Overview",
    image: "/illustrations/Analytics-amico.svg",
    tip: "Captures energy use across your locations."
  },
  5: {
    title: "Company Vehicles",
    image: "/illustrations/Fuel station-amico.svg",
    tip: "Tracks emissions from company-owned transport."
  },
  6: {
    title: "Machinery Use",
    image: "/illustrations/Analytics-amico.svg",
    tip: "Assesses energy consumption by machinery."
  },
  7: {
    title: "Electricity Consumption",
    image: "/illustrations/Analytics-amico.svg",
    tip: "Key for calculating indirect emissions."
  },
  8: {
    title: "Business Travel",
    image: "/illustrations/Analytics-amico.svg",
    tip: "Helps quantify travel-related emissions."
  },
  9: {
    title: "Other Expenses",
    image: "/illustrations/Analytics-amico.svg",
    tip: "Captures emissions not covered in prior steps."
  }
};


  return (
    <div className="flex flex-col items-center min-h-screen bg-lightGrey px-4">
      {/* Top Navigation */}
      <div className="w-full max-w-4xl flex justify-between items-center pt-6">
        <button onClick={() => router.push("/")} className="text-darkGrey text-sm hover:underline">
          Save & exit
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
        <div className="bg-primary p-10 text-white md:rounded-l-lg relative flex flex-col justify-between items-center">
          
          {/* SME Logo (Fixed at Top Left) */}
          <Image 
            src="/logos/SMECH_logo_white.svg" 
            alt="SME Climate Hub Logo" 
            width={100} 
            height={40} 
            className="absolute top-6 left-6"
          />

          {/* Dynamic Image */}
          <div className="flex justify-center items-center flex-grow">
            <Image 
              src={pageContent[step]?.image || "/illustrations/Analytics-amico.svg"}
              alt={pageContent[step]?.title || "Company Data"} 
              width={300} 
              height={300} 
              className="h-auto" 
            />
          </div>

          {/* Dynamic Title */}
          <h2 className="text-2xl font-bold text-center mt-4">
            {pageContent[step]?.title || "Company Data"}
          </h2>

          {/* Dynamic Tip */}
          <div className="mt-4 text-sm text-gray-200 text-center">
            <p><strong>Why are we asking this?</strong></p>
            <p>{pageContent[step]?.tip || "This helps us calculate your emissions accurately."}</p>
          </div>
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
            <div className="space-y-4 mt-8">
              {/* Dynamic Date Range */}
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              
              {/* Employee Count Section */}
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">How many people worked at your company at the end of this time period?</h1>
                <p className="text-sm text-gray-500">Tip: Your HR or management team would know this.</p>

                <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                  <input
                    type="number"
                    min="1"
                    value={responses.employees || ""}
                    onChange={(e) => saveResponse({ employees: e.target.value })}
                    className="flex-grow bg-transparent outline-none"
                    placeholder="0"
                  />
                  <span className="ml-2 text-gray-600">employees</span>
                </div>
              </div>

              {/* Work From Home Section */}
              <div className="space-y-4 mt-8"> 
                <h2 className="text-xl font-semibold">What proportion (%) of the time did these employees work from home, on average?</h2>
                <p className="text-sm text-gray-500">Tip: Estimate if exact data isn’t available.</p>

                <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={responses.workFromHomePercentage || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                        saveResponse({ workFromHomePercentage: value });
                      }
                    }}
                    onBlur={() => {
                      if (responses.workFromHomePercentage === "") {
                        saveResponse({ workFromHomePercentage: "0" });
                      }
                    }}
                    className="flex-grow bg-transparent outline-none"
                    placeholder="0"
                  />
                  <span className="ml-2 text-gray-600">%</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              
              <h1 className="text-2xl font-bold">What was your company’s revenue in this period?</h1>
              <p className="text-sm text-gray-500">Tip: Your company's accounts team would know this.</p>
              
              <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                <input
                  type="number"
                  value={responses.revenue || ""}
                  onChange={(e) => saveResponse({ revenue: e.target.value })}
                  className="flex-grow bg-transparent outline-none"
                  placeholder="0"
                />
                <span className="ml-2 text-gray-600">
                  {responses.currencyCode || ""}
                </span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              <h1 className="text-2xl font-bold">Facilities</h1>
              <input
                type="text"
                value={responses.facilities || ""}
                onChange={(e) => saveResponse({ facilities: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              <h1 className="text-2xl font-bold">Vehicles</h1>
              <input
                type="text"
                value={responses.vehicles || ""}
                onChange={(e) => saveResponse({ vehicles: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              <h1 className="text-2xl font-bold">Machinery</h1>
              <input
                type="text"
                value={responses.machinery || ""}
                onChange={(e) => saveResponse({ machinery: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              <h1 className="text-2xl font-bold">Electricity</h1>
              <input
                type="text"
                value={responses.electricity || ""}
                onChange={(e) => saveResponse({ electricity: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              <h1 className="text-2xl font-bold">Business Travel</h1>
              <input
                type="text"
                value={responses.businessTravel || ""}
                onChange={(e) => saveResponse({ businessTravel: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </div>
          )}

          {step === 9 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
              From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              <h1 className="text-2xl font-bold">Other Expenses</h1>
              <input
                type="text"
                value={responses.otherExpenses || ""}
                onChange={(e) => saveResponse({ otherExpenses: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </div>
          )}
        </div>
      </div>

      <SurveyNavigation
          step={step}
          totalSteps={9}  
          handleNext={handleNext}
          handleBack={handleBack}
          isCompanyDataSection={true}  
          nextSectionPath="/report"
          responses={responses} 
          isNextDisabled={isNextDisabled()} 
        />

    </div>
  );
}
