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
  const totalSteps = 10;
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
    heating: "",
    businessTravel: "",
    otherExpenses: "",
    currencyCode: "",
    companyLocation: "",
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
    let updatedResponses = { ...responses, ...newData };
  
    // Convert facilities to m² before saving
    if (newData.facilitiesRaw !== undefined) {
      if (updatedResponses.facilitiesUnit === "ft²") {
        updatedResponses.facilities = (parseFloat(newData.facilitiesRaw) / 10.764).toFixed(2);
      } else {
        updatedResponses.facilities = newData.facilitiesRaw;
      }
    }
  
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
    if (step === 4 && !responses.noFacilities && (!responses.facilitiesRaw || parseFloat(responses.facilitiesRaw) <= 0)) return true;
    if (step === 5 && !responses.noElectricity && (!responses.electricityRaw || parseFloat(responses.electricityRaw) <= 0)) return true;
    if (step === 6 && !responses.noHeating && (!responses.heating || parseFloat(responses.heating) <= 0)) return false;
    if (step === 7 && !responses.vehicles.trim()) return true;
    if (step === 8 && !responses.machinery.trim()) return true;
    if (step === 9 && (!responses.businessTravel || parseFloat(responses.businessTravel) <= 0)) return true;
    if (step === 10 && !responses.otherExpenses.trim()) return true;
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

const uniqueCurrencies = Array.from(
  new Set(COUNTRIES.map((country) => country.currencyCode))
).sort();

const pageContent = {
  1: {
    title: "Reporting Period",
    image: "/illustrations/Calendar-amico.svg",
    tip: "This is important to make sure you are reporting consistently. This is flexible, but typically reporting periods are 1 year and align with either the calendar or financial years."
  },
  2: {
    title: "Employee Details",
    image: "/illustrations/Team goals-amico.svg",
    tip: "Total headcount at the end of the year helps us understand the size of the business and estimate homeworking emissions. Note that this calculator is designed for single-site businesses."
  },
  3: {
    title: "Company Revenue",
    image: "/illustrations/Analytics-amico.svg",
    tip: "Understanding company revenue allows us to provide a basis of comparison to other companies in you sector. This data, along with all company data provided, remains entirely private."
  },
  4: {
    title: "Facility Overview",
    image: "/illustrations/Building-amico.svg",
    tip: "The size of your company's facilities, rented or owned, helps us determine rates of energy usage and associated emissions."
  },
  5: {
    title: "Electricity Consumption",
    image: "/illustrations/Electrician-amico.svg",
    tip: "Electricity is a key aspect of business carbon emissions. Your consumption will be multiplied by the most recent carbon intensity of your country of operation."
  },
    6: {
      title: "Heating Consumption",
      image: "/illustrations/Building-amico.svg",
      tip: "Heating contributes to carbon emissions. If you use gas, oil, or any other fuel for heating, enter your total energy consumption here.",
    },  
  7: {
    title: "Company Vehicles",
    image: "/illustrations/Fuel station-amico.svg",
    tip: "Tracks emissions from company-owned transport."
  },
  8: {
    title: "Machinery Use",
    image: "/illustrations/Logistics-amico.svg",
    tip: "Assesses energy consumption by machinery."
  },
  9: {
    title: "Business Travel",
    image: "/illustrations/Train-amico.svg",
    tip: "Helps quantify travel-related emissions."
  },
  10: {
    title: "Other Expenses",
    image: "/illustrations/Checking boxes-amico.svg",
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
          Data collection {step} / {totalSteps}
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
      <div className="bg-white rounded-lg shadow-md mt-4 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 md:min-h-[600px]">
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

  {/* Dynamic Image with Mobile-Specific Top Margin */}
  <div className="flex justify-center items-center flex-grow mt-14 sm:mt-10 md:mt-0">
    <Image 
      src={pageContent[step]?.image || "/illustrations/Analytics-amico.svg"}
      alt={pageContent[step]?.title || "Company Data"} 
      width={200} 
      height={200} 
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
        <div className="p-6 pt-4">
        {step === 1 && (
            <div className="space-y-4 mt-8">
            {/* Dynamic Date Range */}
            <p className="text-sm text-gray-600 mb-4">&nbsp;</p>
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 mt-8">
              {/* Dynamic Date Range */}
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              
              {/* Employee Count Section */}
              <div className="space-y-4 mb-8">
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
              <div className="space-y-4 pt-8"> 
                <h1 className="text-2xl font-semibold">What proportion (%) of the time did these employees work from home, on average?</h1>
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

                {/* Currency Dropdown */}
                <select
                  value={responses.currencyCode || ""}
                  onChange={(e) => saveResponse({ currencyCode: e.target.value })}
                  className="ml-2 bg-transparent text-gray-600 outline-none cursor-pointer w-[100px] text-left"
                >
                  {uniqueCurrencies.map((currencyCode) => (
                    <option key={currencyCode} value={currencyCode}>
                      {currencyCode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              <h1 className="text-2xl font-bold">What was the total area of your company's facilities in this period?</h1>
              <p className="text-sm text-gray-500">Include all office, retail, workshop and warehouse spaces - exclude home offices or shared workspaces.</p>
              {/* Facility Area Input & Unit Selector */}
<div className="mt-4">
  <label className="block text-gray-700">Total area</label>

  <div className="flex items-center border p-2 rounded w-full mt-2 bg-gray-100">
    <input
      type="number"
      min="0"
      value={responses.facilitiesRaw || ""}
      onChange={(e) => {
        saveResponse({ facilitiesRaw: e.target.value });
      }}
      onBlur={() => {
        if (responses.facilitiesRaw && responses.facilitiesUnit === "ft²") {
          saveResponse({
            facilities: (parseFloat(responses.facilitiesRaw) * 0.092903).toFixed(2), // Convert to m²
          });
        } else {
          saveResponse({ facilities: responses.facilitiesRaw });
        }
      }}
      disabled={responses.noFacilities}
      className={`flex-grow bg-transparent outline-none ${
        responses.noFacilities ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
      }`}
      placeholder="Enter area"
    />

    {/* Embedded Unit Dropdown */}
    <select
      value={responses.facilitiesUnit || "m²"}
      onChange={(e) => saveResponse({ facilitiesUnit: e.target.value })}
      disabled={responses.noFacilities}
      className="ml-2 bg-transparent text-gray-600 outline-none cursor-pointer w-[80px] text-right"
    >
      <option value="m²">m²</option>
      <option value="ft²">ft²</option>
    </select>
  </div>
</div>


              {/* "No Facilities" Checkbox - Below the Inputs */}
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="noFacilities"
                  checked={responses.noFacilities || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    saveResponse({
                      noFacilities: checked,
                      facilitiesRaw: checked ? "" : responses.facilitiesRaw,
                      facilitiesUnit: checked ? "m²" : responses.facilitiesUnit,
                      facilities: checked ? "" : responses.facilities, // Ensure backend storage consistency
                    });
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="noFacilities">No owned or leased facilities</label>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              
              <h1 className="text-2xl font-bold">
                How much electricity did your company consume in this period?
              </h1>
              <p className="text-sm text-gray-500">
                Tip: This will be on your electricity bill or recorded by your operations teams. If you shared services 
                so cannot split this, leave as zero and it can be captured in your expenditure.
              </p>

              {/* Electricity Input with kWh inside the field */}
              <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                <input
                  type="number"
                  min="0"
                  value={responses.electricityRaw || ""}
                  onChange={(e) => {
                    saveResponse({ electricityRaw: e.target.value });
                  }}
                  onBlur={() => {
                    // Convert to kWh if needed (for consistency in backend storage)
                    if (responses.electricityRaw) {
                      saveResponse({ electricity: responses.electricityRaw });
                    }
                  }}
                  disabled={responses.noElectricity}
                  className={`flex-grow bg-transparent outline-none ${
                    responses.noElectricity ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
                  }`}
                  placeholder="0"
                />
                <span className="ml-2 text-gray-600">kWh</span>
              </div>

              {/* "No Electricity Usage" Checkbox - Below the Input */}
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="noElectricity"
                  checked={responses.noElectricity || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    saveResponse({
                      noElectricity: checked,
                      electricityRaw: checked ? "" : responses.electricityRaw,
                      electricity: checked ? "" : responses.electricity, // Ensure backend storage consistency
                    });
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="noElectricity">No owned or leased assets</label>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              <h1 className="text-2xl font-bold">Did your company heat buildings in the period?</h1>
              <input
                type="text"
                value={responses.heating || ""}
                onChange={(e) => saveResponse({ heating: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              <h1 className="text-2xl font-bold">Did your company own or lease vehicles in the period?</h1>
              <input
                type="text"
                value={responses.vehicles || ""}
                onChange={(e) => saveResponse({ vehicles: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4 mt-8">
              <p className="text-sm text-gray-600 mb-4">
                From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
              </p>
              <h1 className="text-2xl font-bold">Did your company use fuel for machinery in the period?</h1>
              <input
                type="text"
                value={responses.machinery || ""}
                onChange={(e) => saveResponse({ machinery: e.target.value })}
                className="border p-2 rounded w-full mt-4"
              />
            </div>
          )}

          {step === 9 && (
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

          {step === 10 && (
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
          totalSteps={10}  
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
