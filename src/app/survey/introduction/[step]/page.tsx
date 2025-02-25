"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import SurveyNavigation from "@/components/SurveyNavigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { COUNTRIES } from "@/app/data/countries"; 


export default function IntroductionSurvey() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string) || 1;
  const totalSteps = 5;
  const userId = "testUser123"; // Placeholder user (will replace with auth later)

  // Store all responses as an object
  const [responses, setResponses] = useState({
    companyName: "",
    companyLocation: "",
    currencyCode: "",
    companySector: "",
    termsAccepted: false,
  });
  
// Check localStorage before Firestore
useEffect(() => {
    const storedData = localStorage.getItem(`companyResponses_${userId}`);
    if (storedData) {
      setResponses(JSON.parse(storedData));
      return;
    }
  
    const fetchResponses = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setResponses(data);
          localStorage.setItem(`companyResponses_${userId}`, JSON.stringify(data)); // ✅ Store under companyResponses
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };
  
    fetchResponses();
  }, []);

// Save to localStorage and Firestore only on change
const saveResponse = async (newData: Partial<typeof responses>) => {
  const updatedResponses = { ...responses, ...newData };
  setResponses(updatedResponses);
  localStorage.setItem(`companyResponses_${userId}`, JSON.stringify(updatedResponses));

  // Also update companyResponses with currencyCode (if it exists)
  if (newData.currencyCode) {
    const storedCompanyData = localStorage.getItem(`companyResponses_${userId}`);
    const companyData = storedCompanyData ? JSON.parse(storedCompanyData) : {};
    
    const updatedCompanyData = { ...companyData, currencyCode: newData.currencyCode };
    localStorage.setItem(`companyResponses_${userId}`, JSON.stringify(updatedCompanyData));

    try {
      await setDoc(doc(db, "users", userId), updatedCompanyData, { merge: true });
    } catch (error) {
      console.error("Error saving currencyCode to Firestore:", error);
    }
  }

  try {
    await setDoc(doc(db, "users", userId), updatedResponses, { merge: true });
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
};


  // ✅ Disable "Next" button if required fields aren't filled
  const isNextDisabled = () => {
    if (step === 2 && !responses.termsAccepted) return true; // Terms checkbox required
    if (step === 3 && !responses.companyName.trim()) return true; // Company name required
    if (step === 4 && !responses.companyLocation) return true; // Country selection required
    if (step === 5 && !responses.companySector) return true; // Sector selection required
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      router.push(`/survey/introduction/${step + 1}`);
    } else {
      router.push(`/survey/company/guidance/1`);
    }
  };

  const handleBack = () => {
    if (step > 1) router.push(`/survey/introduction/${step - 1}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-lightGrey px-4">
      
      {/* NAVIGATION BAR */}
      <div className="w-full max-w-4xl flex justify-between items-center pt-6">
        <button
          onClick={() => router.push("/")}
          className="text-darkGrey text-sm font-sofia hover:underline"
        >
          Save & exit
        </button>
        <p className="text-darkGrey text-sm font-sofia">
          Onboarding {step} / {totalSteps}
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
  
      {/* CONTENT SECTION - Now Matches Other Pages */}
      <div className="bg-white rounded-lg shadow-md p-10 mt-4 w-full max-w-6xl flex flex-col min-h-[600px]">
          
        {/* SME Climate Hub Logo - Fixed at Top */}
        <div className="w-full flex justify-center mb-8">
          <Image
            src="/logos/SME-Climate-Hub-logo-teal.svg"
            alt="SME Climate Hub Logo"
            width={148}
            height={40}
            className="h-auto"
          />
        </div>
        
        {/* Centered Content */}
        <div className="flex flex-col flex-grow justify-center items-center text-center mt-[-40px]">
          
          {step === 1 && (
            <div className="text-center max-w-2xl">
              <h1 className="text-3xl font-bold font-sofia mb-2">
                Welcome to the <span className="text-primary">Business Carbon Calculator</span>
              </h1>
  
              <div className="flex justify-center">
                <Image 
                  src="/illustrations/Analytics-amico.svg" 
                  alt="Carbon Calculator" 
                  width={300} 
                  height={200} 
                  className="h-auto" 
                />
              </div>
  
              <p className="text-darkGrey text-lg">
                We’re delighted to partner with you in measuring your company’s CO₂ emissions.  
                This tool helps you track and reduce your carbon footprint effectively.
              </p>
            </div>
          )}
  
          {/* STEP 2: TERMS & CONDITIONS */}
          {step === 2 && (
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold font-sofia">Terms & Conditions</h1>
              <p className="text-darkGrey mt-4">Placeholder text for terms and conditions.</p>
              <div className="mt-6 flex items-center justify-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={responses.termsAccepted}
                  onChange={() => saveResponse({ termsAccepted: !responses.termsAccepted })}
                  className="mr-2"
                />
                <label htmlFor="terms" className="text-darkGrey">
                  I accept the terms and conditions
                </label>
              </div>
            </div>
          )}
  
          {/* STEP 3: COMPANY NAME */}
          {step === 3 && (
            <div className="max-w-2xl w-full">
              <h1 className="text-2xl font-bold font-sofia">What is the name of your company?</h1>
              <input
                type="text"
                placeholder="Enter company name"
                value={responses.companyName}
                onChange={(e) => saveResponse({ companyName: e.target.value })}
                className="border p-2 rounded w-full mt-4 text-center"
              />
            </div>
          )}
  
          {/* STEP 4: COMPANY LOCATION */}
          {step === 4 && (
            <div className="max-w-2xl w-full">
              <h1 className="text-2xl font-bold font-sofia">Where is your company located?</h1>
              <select
                value={responses.companyLocation}
                onChange={(e) => {
                  const selectedCountry = COUNTRIES.find(country => country.locode === e.target.value);
                  saveResponse({ 
                    companyLocation: e.target.value,
                    currencyCode: selectedCountry?.currencyCode || "" 
                  });
                }}
                className="border p-2 rounded w-full mt-4 text-center">
                <option value="">Select a country</option>
                {COUNTRIES.map((country) => (
                  <option key={country.locode} value={country.locode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          )}
  
          {/* STEP 5: SECTOR */}
          {step === 5 && (
            <div className="max-w-2xl w-full">
              <h1 className="text-2xl font-bold font-sofia">What sector do you operate in?</h1>
              <select
                value={responses.companySector}
                onChange={(e) => saveResponse({ companySector: e.target.value })}
                className="border p-2 rounded w-full mt-4 text-center"
              >
                <option value="">Select a sector</option>
                <option value="Business activities">Business activities – Consultancy, legal, accounting, etc.</option>
                <option value="Construction and civil engineering">Construction and civil engineering</option>
                <option value="Creative arts and entertainment activities">Creative arts and entertainment activities</option>
                <option value="Education and research">Education and research</option>
                <option value="Energy and utilities">Energy and utilities</option>
                <option value="Finance – General">Finance – General</option>
                <option value="Finance – Insurance and pension">Finance – Insurance and pension</option>
                <option value="Health care and services">Health care and services</option>
                <option value="Information technology">Information technology</option>
                <option value="Land use – Agriculture, forestry, and fishing">Land use – Agriculture, forestry, and fishing</option>
                <option value="Manufacturing – Chemicals">Manufacturing – Chemicals</option>
                <option value="Manufacturing – Consumer goods">Manufacturing – Consumer goods</option>
                <option value="Manufacturing – Food and beverages">Manufacturing – Food and beverages</option>
                <option value="Manufacturing – Heavy industries">Manufacturing – Heavy industries</option>
                <option value="Manufacturing – Other">Manufacturing – Other</option>
                <option value="Membership organizations">Membership organizations</option>
                <option value="Non-governmental organization">Non-governmental organization</option>
                <option value="Other commercial service activities">Other commercial service activities</option>
                <option value="Pharmaceuticals">Pharmaceuticals</option>
                <option value="Public administration">Public administration</option>
                <option value="Publishing activities">Publishing activities</option>
                <option value="Real estate activities">Real estate activities</option>
                <option value="Retail and wholesale">Retail and wholesale</option>
                <option value="Telecommunication">Telecommunication</option>
                <option value="Tourism and hospitality">Tourism and hospitality</option>
                <option value="Transport and logistics">Transport and logistics</option>
                <option value="Warehousing">Warehousing</option>
              </select>
            </div>
          )}
        </div>
      </div>
  
      {/* SURVEY NAVIGATION */}
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
