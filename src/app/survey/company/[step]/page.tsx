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
    const totalSteps = 13;
    const userId = "testUser123"; // Placeholder, replace with auth later

    const [responses, setResponses] = useState({
      timePeriodFrom: "",
      timePeriodTo: "",
      employees: "",
      workFromHomePercentage: "",
      revenue: "",
      revenueCurrency: "",
      facilities: "",
      vehicles: "",
      machinery: "",
      electricity: "",
      heating: "",
      businessTravel: "",
      totalExpenditure: "",
      expensesCurrency: "",
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

    const isNextDisabled = () => step === 13 && !Object.keys(pageContent).slice(0, -1).every((key) => isStepComplete(parseInt(key)));

    const isStepComplete = (stepNumber: number) => {
      switch (stepNumber) {
        case 1:
          return responses.timePeriodFrom && responses.timePeriodTo;
        case 2:
          return responses.employees && parseInt(responses.employees) > 0;
        case 3:
          return responses.revenue && parseFloat(responses.revenue) > 0;
        case 4:
          return responses.noFacilities || (responses.facilitiesRaw && parseFloat(responses.facilitiesRaw) > 0);
        case 5:
          return responses.noElectricity || (responses.electricityRaw && parseFloat(responses.electricityRaw) > 0);
        case 6:
          return responses.heatingMethod === "No heating at site" ||
                responses.heatingMethod === "electricity" ||
                (responses.heatingUsage && parseFloat(responses.heatingUsage) > 0);
        case 7:
          return responses.vehicles === "No" || responses.petrolUsage || responses.dieselUsage;
        case 8:
          return responses.machinery === "No" || responses.machineryPetrolUsage || responses.machineryDieselUsage;
        case 9:
          return responses.noBusinessTravel ||
                responses.trainTravel ||
                responses.airTravel ||
                responses.busTravel ||
                responses.taxiTravel;
        case 10:
          return responses.noHotelNights || (responses.hotelNights && parseInt(responses.hotelNights) > 0);
        case 11:  // New Employee Commuting step
          return responses.noEmployeeCommuting ||
                responses.commuteTrain ||
                responses.commuteBus ||
                responses.commuteCar;
        case 12:
          return responses.totalExpenditure &&
          parseFloat(responses.totalExpenditure) > 0 &&
          Object.keys(responses).some((key) => !isNaN(parseFloat(responses[key])) && parseFloat(responses[key]) > 0);
        default:
          return false;
      }
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

  const getCurrencyFromCountry = (countryName: string) => {
    const country = COUNTRIES.find(c => c.name === countryName);
    return country ? country.currencyCode : "USD"; // Default to USD if not found
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
      title: "Fuel Consumption - Company Vehicles",
      image: "/illustrations/Fuel station-amico.svg",
      tip: "Fuel used in company owned or operated vehicles generate carbon emissions."
    },
    8: {
      title: "Fuel Consumption - Machinery",
      image: "/illustrations/Logistics-amico.svg",
      tip: "Fuel used in company owned or operated machinery generates carbon emissions."
    },
    9: {
      title: "Business Travel",
      image: "/illustrations/Train-amico.svg",
      tip: "Emissions are generated by employee travel while on business-related trips."
    },
    10: {
      title: "Business Travel - Accommodation",
      image: "/illustrations/Insomnia-amico.svg",
      tip: "Employees staying in accommodation while on business is included in your organisation's footprint."
    },
    11: {
      title: "Employee Commuting",
      image: "/illustrations/Back to work-amico.svg",
      tip: "Emissions are generated by employees travelling to and from their homes and work."
    },
    12: {
      title: "Company Expenses",
      image: "/illustrations/Checking boxes-amico.svg",
      tip: "Captures emissions from purchases of goods and services not recorded in previous steps."
    },
    13: {
      title: "Data Summary",
      image: "/illustrations/Analytics-amico.svg",
      tip: "Make sure you have checked each step thoroughly before continuing."
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
            <div className="bg-primary p-10 text-white md:rounded-l-lg relative flex flex-col items-center">
    {/* SME Logo (Fixed at Top Left) */}
    <Image 
      src="/logos/SMECH_logo_white.svg" 
      alt="SME Climate Hub Logo" 
      width={100} 
      height={40} 
      className="absolute top-6 left-6"
    />

    {/* Dynamic Image - Kept Near the Top */}
    <div className="mt-20">
      <Image 
        src={pageContent[step]?.image || "/illustrations/Analytics-amico.svg"}
        alt={pageContent[step]?.title || "Company Data"} 
        width={200} 
        height={200} 
        className="h-auto"
      />
    </div>

    {/* Dynamic Title */}
    <h2 className="text-2xl font-bold text-center mt-6">
      {pageContent[step]?.title || "Company Data"}
    </h2>

    {/* Dynamic Tip */}
    <div className="mt-4 text-sm text-gray-200 text-center">
      <p><strong>Why are we asking this?</strong></p>
      <p>{pageContent[step]?.tip || "This helps us calculate your emissions accurately."}</p>
    </div>
  </div>


          {/* Right Column */}
          <div className="p-6 pt-0">
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
                    value={responses.revenueCurrency || getCurrencyFromCountry(responses.companyLocation)}
                    onChange={(e) => saveResponse({ revenueCurrency: e.target.value })}
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
                {/* Dynamic Date Range */}
                <p className="text-sm text-gray-600 mb-4">
                  From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
                </p>

                {/* Title */}
                <h1 className="text-2xl font-bold">Did your company heat its site?</h1>
                <p className="text-sm text-gray-500">
                  Tip: Your landlord or office manager would know this.
                </p>

                {/* Heating Options (Radio Buttons) */}
                <div className="space-y-2">
                  {[
                    "Yes, via district heating",
                    "Yes, via natural gas",
                    "Yes, via electricity",
                    "Yes, via oil",
                    "Yes, via biomass",
                    "No heating at site",
                  ].map((option) => {
                    const extractedFuel = option.startsWith("Yes, via ")
                      ? option.replace("Yes, via ", "") // Extract fuel type
                      : option; // Keep "No heating at site" unchanged

                    return (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="heatingMethod"
                          value={extractedFuel}
                          checked={responses.heatingMethod === extractedFuel}
                          onChange={(e) => {
                            const selectedMethod = e.target.value;
                            const shouldClearUsage = selectedMethod === "electricity" || selectedMethod === "No heating at site";

                            saveResponse({
                              heatingMethod: selectedMethod,
                              heatingUsage: shouldClearUsage ? "" : responses.heatingUsage, // Preserve if relevant
                            });
                          }}
                          className="w-5 h-5"
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Message for "electricity" option */}
                {responses.heatingMethod === "electricity" && (
                  <p className="text-sm text-gray-600 italic mt-4">
                    Heating energy consumption will have been included in your electricity consumption in the previous step.
                  </p>
                )}

                {/* kWh Input (For all "Yes" options except electricity and "No heating at site") */}
                {responses.heatingMethod &&
                  responses.heatingMethod !== "electricity" &&
                  responses.heatingMethod !== "No heating at site" && (
                    <div className="mt-4">
                      <label className="block text-gray-700 font-semibold">
                        Please enter energy consumed below
                      </label>
                      <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                        <input
                          type="number"
                          min="0"
                          value={responses.heatingUsage || ""}
                          onChange={(e) => saveResponse({ heatingUsage: e.target.value })}
                          className="flex-grow bg-transparent outline-none"
                          placeholder="Enter kWh"
                        />
                        <span className="ml-2 text-gray-600">kWh</span>
                      </div>
                    </div>
                  )}
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4 mt-8">
                <p className="text-sm text-gray-600 mb-4">
                  From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
                </p>

                <h1 className="text-2xl font-bold">Did your company own or lease vehicles in the period?</h1>
                <p className="text-sm text-gray-500">
                  Tip: This includes cars, vans, trucks, and company-owned fleet. Electricity for electric cars should be included in the earlier electricity step. 
                </p>

                <div className="space-y-2">
                  {["Yes", "No"].map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="vehicles"
                        value={option}
                        checked={responses.vehicles === option}
                        onChange={(e) =>
                          saveResponse({
                            vehicles: e.target.value,
                            petrolUsage: e.target.value === "No" ? "" : responses.petrolUsage || "",
                            dieselUsage: e.target.value === "No" ? "" : responses.dieselUsage || "",
                            petrolUnit: responses.petrolUnit || "litres",
                            dieselUnit: responses.dieselUnit || "litres",
                          })
                        }
                        className="w-5 h-5"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                {responses.vehicles === "Yes" && (
                  <div className="space-y-4 mt-4">
                    <h2 className="text-lg font-semibold">Enter fuel used by company vehicles below</h2>

                    {/* Petrol Input */}
                    <label className="block text-gray-700">Petrol Usage</label>
                    <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                      <input
                        type="number"
                        min="0"
                        value={responses.petrolUsage || ""}
                        onChange={(e) => saveResponse({ petrolUsage: e.target.value })}
                        className="flex-grow bg-transparent outline-none"
                      />
                      <select
                        value={responses.petrolUnit || "litres"}
                        onChange={(e) => saveResponse({ petrolUnit: e.target.value })}
                        className="bg-transparent text-gray-600 outline-none cursor-pointer w-24"
                      >
                        <option value="litres">litres</option>
                        <option value="gallons">gallons</option>
                      </select>
                    </div>

                    {/* Diesel Input */}
                    <label className="block text-gray-700">Diesel Usage</label>
                    <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                      <input
                        type="number"
                        min="0"
                        value={responses.dieselUsage || ""}
                        onChange={(e) => saveResponse({ dieselUsage: e.target.value })}
                        className="flex-grow bg-transparent outline-none"
                      />
                      <select
                        value={responses.dieselUnit || "litres"}
                        onChange={(e) => saveResponse({ dieselUnit: e.target.value })}
                        className="bg-transparent text-gray-600 outline-none cursor-pointer w-24"
                      >
                        <option value="litres">litres</option>
                        <option value="gallons">gallons</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 8 && (
              <div className="space-y-4 mt-8">
                <p className="text-sm text-gray-600 mb-4">
                  From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
                </p>

                <h1 className="text-2xl font-bold">Did your company use fuel for owned or leased machinery?</h1>
                <p className="text-sm text-gray-500">
                  Tip: This includes construction equipment, generators, and manufacturing machines.
                </p>

                <div className="space-y-2">
                  {["Yes", "No"].map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="machinery"
                        value={option}
                        checked={responses.machinery === option}
                        onChange={(e) =>
                          saveResponse({
                            machinery: e.target.value,
                            machineryPetrolUsage: e.target.value === "No" ? "" : responses.machineryPetrolUsage || "",
                            machineryDieselUsage: e.target.value === "No" ? "" : responses.machineryDieselUsage || "",
                            machineryPetrolUnit: responses.machineryPetrolUnit || "litres",
                            machineryDieselUnit: responses.machineryDieselUnit || "litres",
                          })
                        }
                        className="w-5 h-5"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                {responses.machinery === "Yes" && (
                  <div className="space-y-4 mt-4">
                    <h2 className="text-lg font-semibold">Enter fuel used by machinery below</h2>

                    {/* Petrol Input */}
                    <label className="block text-gray-700">Petrol Usage</label>
                    <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                      <input
                        type="number"
                        min="0"
                        value={responses.machineryPetrolUsage || ""}
                        onChange={(e) => saveResponse({ machineryPetrolUsage: e.target.value })}
                        className="flex-grow bg-transparent outline-none"
                      />
                      <select
                        value={responses.machineryPetrolUnit || "litres"}
                        onChange={(e) => saveResponse({ machineryPetrolUnit: e.target.value })}
                        className="bg-transparent text-gray-600 outline-none cursor-pointer w-24"
                      >
                        <option value="litres">litres</option>
                        <option value="gallons">gallons</option>
                      </select>
                    </div>

                    {/* Diesel Input */}
                    <label className="block text-gray-700">Diesel Usage</label>
                    <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                      <input
                        type="number"
                        min="0"
                        value={responses.machineryDieselUsage || ""}
                        onChange={(e) => saveResponse({ machineryDieselUsage: e.target.value })}
                        className="flex-grow bg-transparent outline-none"
                      />
                      <select
                        value={responses.machineryDieselUnit || "litres"}
                        onChange={(e) => saveResponse({ machineryDieselUnit: e.target.value })}
                        className="bg-transparent text-gray-600 outline-none cursor-pointer w-24"
                      >
                        <option value="litres">litres</option>
                        <option value="gallons">gallons</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 9 && (
              <div className="space-y-4 mt-8">
                <p className="text-sm text-gray-600 mb-4">
                  From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
                </p>

                <h1 className="text-2xl font-bold">Business Travel</h1>
                <p className="text-sm text-gray-500">
                  Tip: If no data is available, you can estimate travel distances.
                </p>

                {/* Travel Inputs (Only show if "No Business Travel" is NOT checked) */}
                {!responses.noBusinessTravel &&
                  [
                    { key: "train", label: "Train Travel" },
                    { key: "air", label: "Air Travel" },
                    { key: "bus", label: "Bus Travel" },
                    { key: "taxi", label: "Taxi Travel" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-gray-700">{label}</label>
                      <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                        <input
                          type="number"
                          min="0"
                          value={responses[`${key}Travel`] || ""}
                          onChange={(e) =>
                            saveResponse({
                              [`${key}Travel`]: e.target.value,
                              [`${key}Unit`]: responses[`${key}Unit`] || "km", // Ensure unit is stored
                            })
                          }
                          className="flex-grow bg-transparent outline-none"
                        />
                        <select
                          value={responses[`${key}Unit`] || "km"}
                          onChange={(e) =>
                            saveResponse({
                              [`${key}Unit`]: e.target.value,
                            })
                          }
                          className="bg-transparent text-gray-600 outline-none cursor-pointer w-20"
                        >
                          <option value="km">km</option>
                          <option value="mi">mi</option>
                        </select>
                      </div>
                    </div>
                  ))}

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={responses.noBusinessTravel || false}
                    onChange={(e) =>
                      saveResponse({
                        noBusinessTravel: e.target.checked,
                        trainTravel: e.target.checked ? "" : responses.trainTravel || "",
                        airTravel: e.target.checked ? "" : responses.airTravel || "",
                        busTravel: e.target.checked ? "" : responses.busTravel || "",
                        taxiTravel: e.target.checked ? "" : responses.taxiTravel || "",
                      })
                    }
                    className="w-5 h-5"
                  />
                  <span>There was no business travel in this period</span>
                </label>
              </div>
            )}


            {step === 10 && (
              <div className="space-y-4 mt-8">
                <p className="text-sm text-gray-600 mb-4">
                  From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
                </p>

                <h1 className="text-2xl font-bold">Business Travel - Hotel Stays</h1>
                <p className="text-sm text-gray-500">
                  Tip: Make sure the value provided is the total number of nights spent per person.
                </p>

                

                {/* Hotel Stays Input (Only show if "No Business Travel" is NOT checked) */}
                {!responses.noHotelNights && (
                  <>
                    <label className="block text-gray-700">Hotel Nights</label>
                    <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                      <input
                        type="number"
                        min="0"
                        value={responses.hotelNights || ""}
                        onChange={(e) => saveResponse({ hotelNights: e.target.value })}
                        className="flex-grow bg-transparent outline-none"
                      />
                      <span className="ml-2 text-gray-600">person/nights</span>
                    </div>
                  </>
                )}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={responses.noHotelNights || false}
                    onChange={(e) =>
                      saveResponse({
                        noHotelNights: e.target.checked,
                        hotelNights: e.target.checked ? "" : responses.hotelNights || "",
                      })
                    }
                    className="w-5 h-5"
                  />
                  <span>There was no hotel stays in this period</span>
                </label>
              </div>
            )}


            {step === 11 && (
              <div className="space-y-4 mt-8">
                <p className="text-sm text-gray-600 mb-4">
                  From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
                </p>

                <h1 className="text-2xl font-bold">Employee Commuting</h1>
                <p className="text-sm text-gray-500">
                  Tip: If no data is available, you can estimate commuting distances based on employee habits.
                </p>

                

                {/* Commuting Inputs (Only show if "No Employee Commuting" is NOT checked) */}
                {!responses.noEmployeeCommuting &&
                  [
                    { key: "commuteTrain", label: "Train Travel" },
                    { key: "commuteBus", label: "Bus Travel" },
                    { key: "commuteCar", label: "Car Travel" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-gray-700">{label}</label>
                      <div className="flex items-center border p-2 rounded w-full bg-gray-100">
                        <input
                          type="number"
                          min="0"
                          value={responses[key] || ""}
                          onChange={(e) =>
                            saveResponse({
                              [key]: e.target.value,
                              [`${key}Unit`]: responses[`${key}Unit`] || "km", // Ensure unit is stored
                            })
                          }
                          className="flex-grow bg-transparent outline-none"
                        />
                        <select
                          value={responses[`${key}Unit`] || "km"}
                          onChange={(e) =>
                            saveResponse({
                              [`${key}Unit`]: e.target.value,
                            })
                          }
                          className="bg-transparent text-gray-600 outline-none cursor-pointer w-20"
                        >
                          <option value="km">km</option>
                          <option value="mi">mi</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {/* No Employee Commuting Checkbox */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={responses.noEmployeeCommuting || false}
                    onChange={(e) =>
                      saveResponse({
                        noEmployeeCommuting: e.target.checked,
                        commuteTrain: e.target.checked ? "" : responses.commuteTrain || "",
                        commuteAir: e.target.checked ? "" : responses.commuteAir || "",
                        commuteBus: e.target.checked ? "" : responses.commuteBus || "",
                        commuteCar: e.target.checked ? "" : responses.commuteCar || "",
                      })
                    }
                    className="w-5 h-5"
                  />
                  <span>There was no employee commuting in this period</span>
                </label>
              </div>
            )}

            {step === 12 && (
              <div className="space-y-6 mt-8">
                <p className="text-sm text-gray-600 mb-4">
                  From {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}
                </p>

                <h1 className="text-2xl font-bold">Company Expenses</h1>
                <p className="text-sm text-gray-500">
                  Capture your company’s expenditure across key categories. This helps estimate emissions from purchased goods and services.
                </p>

                {/* Total Expenditure Input */}
                <label className="block text-gray-700 text-base font-medium">Total Expenditure</label>
                <div className="flex items-center border p-2 rounded-lg w-full bg-gray-100">
                  <input
                    type="number"
                    value={responses.totalExpenditure || ""}
                    onChange={(e) => saveResponse({ ...responses, totalExpenditure: e.target.value })}
                    className="flex-grow bg-transparent outline-none text-base font-medium"
                    placeholder="Enter amount"
                  />
                  <select
                    value={responses.expensesCurrency || getCurrencyFromCountry(responses.companyLocation)}
                    onChange={(e) => saveResponse({ expensesCurrency: e.target.value })}
                    className="ml-2 bg-transparent text-gray-700 outline-none cursor-pointer w-[100px] text-left text-base font-medium"
                  >
                    {uniqueCurrencies.map((currencyCode) => (
                      <option key={currencyCode} value={currencyCode}>
                        {currencyCode}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Show categories ONLY if total expenditure is set */}
                {responses.totalExpenditure && (
                  [
                    {
                      key: "transport",
                      title: "Transport / Freight",
                      fields: ["Road Freight", "Air Freight", "Sea Freight", "Rail Freight", "Other transport services"],
                    },
                    {
                      key: "materials",
                      title: "Materials and Inventory",
                      fields: [
                        "Paper and packaging",
                        "Textiles",
                        "Plastic products",
                        "Metal products",
                        "Wood products",
                        "Books, printed matter and recorded media",
                        "Chemicals",
                        "Food products",
                        "Beverages",
                        "Other manufactured goods/inventory",
                      ],
                    },
                    {
                      key: "capitalGoods",
                      title: "Capital Goods",
                      fields: [
                        "Furniture and other general products",
                        "Phones, television and communication equipment",
                        "Computers and office machinery",
                        "Vehicles",
                        "Other machinery, tools and equipment",
                      ],
                    },
                    {
                      key: "businessServices",
                      title: "Business Services",
                      fields: [
                        "Legal, accounting and business consultancy services",
                        "Software, hosting, computer programming & related activities",
                        "Insurance and pension funding",
                        "Financial intermediation",
                        "Construction and maintenance work",
                        "Corporate entertainment",
                      ],
                    },
                  ].map((category) => (
                    <details key={category.key} className="bg-gray-100 p-4 rounded-md">
                      <summary className="cursor-pointer text-base font-medium">{category.title}</summary>
                      <div className="mt-4 space-y-2">
                        {category.fields.map((field) => {
                          const variableName = `expenses${category.title.split(" ")[0]}${field.split(" ")[0]}`; // Generate variable name
                          
                          return (
                            <div key={variableName}>
                              <label className="block text-gray-700 text-sm">{field}</label>
                              <div className="flex items-center border p-2 rounded w-full bg-white">
                                <input
                                  type="number"
                                  min="0"
                                  value={responses[variableName] || ""}
                                  onChange={(e) => saveResponse({ ...responses, [variableName]: e.target.value })}
                                  className="flex-grow bg-transparent outline-none text-base"
                                  placeholder="0"
                                />
                                <span className="ml-2 text-gray-600 text-base">{responses.expensesCurrency || "Currency"}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  ))
                )}

                {/* Total Calculation */}
                {responses.totalExpenditure && (
                  <div className="mt-6 border-t pt-4">
                    {(() => {
                      const totalCaptured = Object.keys(responses)
                        .filter((key) => key.startsWith("expenses") && !isNaN(Number(responses[key])))
                        .reduce((acc, key) => acc + Number(responses[key] || "0"), 0);

                      const totalExpenditure = parseFloat(responses.totalExpenditure) || 0;
                      const percentage = totalExpenditure ? Math.min((totalCaptured / totalExpenditure) * 100, 100) : 0;
                      
                      let coverageLabel = "Low";
                      let barColor = "bg-red-500";

                      if (percentage > 66) {
                        coverageLabel = "High";
                        barColor = "bg-green-500";
                      } else if (percentage > 33) {
                        coverageLabel = "Medium";
                        barColor = "bg-orange-500";
                      }

                      return (
                        <>
                          <p className="text-base font-medium text-gray-700">
                            {totalCaptured.toLocaleString()} of total expenditure of {totalExpenditure.toLocaleString()} {responses.expensesCurrency} captured so far
                          </p>

                          {/* Expenditure Coverage Bar */}
                          <div className="relative w-full h-3 bg-gray-300 rounded-full mt-2">
                            <div
                              className={`absolute top-0 left-0 h-3 ${barColor} rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>

                          <p className="mt-1 text-sm text-gray-600">
                            Expenditure coverage: <span className="font-medium">{coverageLabel}</span>
                          </p>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}


  {step === 13 && (() => {
    // 🔹 Retrieve total captured expenses & total expenditure
    const totalCaptured = Object.keys(responses)
      .filter((key) => 
        !isNaN(Number(responses[key])) && 
        key.startsWith("expenses") // 🔹 Only sum expense-related values
      )
      .reduce((acc, key) => acc + Number(responses[key] || "0"), 0);

    const totalExpenditure = parseFloat(responses.totalExpenditure) || 0;
    const percentage = totalExpenditure ? Math.min((totalCaptured / totalExpenditure) * 100, 100) : 0;

    // 🔹 Determine coverage label
    let coverageLabel = "Low";
    if (percentage > 66) coverageLabel = "High";
    else if (percentage > 33) coverageLabel = "Medium";

    return (
      <div className="space-y-6 mt-8">
        <h1 className="text-2xl font-bold">Data Summary & Validation</h1>
        <p className="text-sm text-gray-500">
          Review your inputs below. Click on any incomplete step to edit it, then click calculate to run your report for {formatDate(responses.timePeriodFrom)} to {formatDate(responses.timePeriodTo)}.
        </p>

        {/* Summary List */}
        <div className="space-y-2 mt-4">
          {Object.keys(pageContent).map((key) => {
            const stepNumber = parseInt(key);
            if (stepNumber >= 13) return null; // Skip current step

            return (
              <div key={stepNumber} className="flex justify-between items-center border p-2 rounded bg-gray-100">
    <span>{pageContent[stepNumber].title}</span>

    {isStepComplete(stepNumber) ? (
      <div className="flex items-center">
        <span className="text-secondary font-bold">Complete</span>
        {/* 🔹 Display coverage level for Step 12 (Expenses) */}
        {stepNumber === 12 && totalExpenditure > 0 && (
          <span className="ml-2 text-gray-500 text-sm">(Coverage: {coverageLabel})</span>
        )}
      </div>
    ) : (
      <button
        onClick={() => router.push(`/survey/company/${stepNumber}`)}
        className="text-red-400 font-bold underline"
      >
        Incomplete - click to review
      </button>
    )}
  </div>

            );
          })}
        </div>
      </div>
    );
  })()}


          </div>
        </div>

        <SurveyNavigation
            step={step}
            totalSteps={13}  
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
