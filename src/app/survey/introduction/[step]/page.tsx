"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import SurveyNavigation from "@/components/SurveyNavigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
    companySector: "",
    termsAccepted: false,
  });
  
// Check localStorage before Firestore
useEffect(() => {
    const storedData = localStorage.getItem(`userResponses_${userId}`);
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
          localStorage.setItem(`userResponses_${userId}`, JSON.stringify(data));
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
  localStorage.setItem(`userResponses_${userId}`, JSON.stringify(updatedResponses)); // ✅ Save locally first

  try {
    await setDoc(doc(db, "users", userId), updatedResponses, { merge: true }); // ✅ Firestore only when needed
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
          Cancel
        </button>
        <p className="text-darkGrey text-sm font-sofia">
          Step {step} / {totalSteps}
        </p>
      </div>

      {/* CONTENT SECTION */}
      <div className="bg-white rounded-lg shadow-md p-10 mt-4 w-full max-w-4xl text-center">
        {/* SME Climate Hub Logo */}
        <div className="w-full flex justify-center mb-8">
          <Image
            src="/logos/SME-Climate-Hub-logo-teal.svg"
            alt="SME Climate Hub Logo"
            width={148}
            height={40}
            className="h-auto"
          />
        </div>

        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold font-sofia mb-4">
              Welcome to the <span className="text-primary">Business Carbon Calculator</span>
            </h1>

            <div className="flex justify-center my-6">
              <Image 
                src="/illustrations/Analytics-amico.svg" 
                alt="Carbon Calculator" 
                width={400} 
                height={300} 
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
          <>
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
          </>
        )}

        {/* STEP 3: COMPANY NAME */}
        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold font-sofia">What is the name of your company?</h1>
            <input
              type="text"
              placeholder="Enter company name"
              value={responses.companyName}
              onChange={(e) => saveResponse({ companyName: e.target.value })}
              className="border p-2 rounded w-full mt-4 text-center"
            />
          </>
        )}

        {/* STEP 4: COMPANY LOCATION */}
        {step === 4 && (
          <>
            <h1 className="text-2xl font-bold font-sofia">Where is your company located?</h1>
            <select
              value={responses.companyLocation}
              onChange={(e) => saveResponse({ companyLocation: e.target.value })}
              className="border p-2 rounded w-full mt-4 text-center"
            >
              <option value="">Select a country</option>
              <option value="UK">United Kingdom</option>
              <option value="USA">United States</option>
              <option value="Germany">Germany</option>
            </select>
          </>
        )}

        {/* STEP 5: SECTOR */}
        {step === 5 && (
          <>
            <h1 className="text-2xl font-bold font-sofia">What sector do you operate in?</h1>
            <select
              value={responses.companySector}
              onChange={(e) => saveResponse({ companySector: e.target.value })}
              className="border p-2 rounded w-full mt-4 text-center"
            >
              <option value="">Select a sector</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
          </>
        )}
      </div>

      {/* SURVEY NAVIGATION */}
      <SurveyNavigation
        step={step}
        totalSteps={totalSteps}
        handleNext={handleNext}
        handleBack={handleBack}
        nextSectionPath="/survey/company/guidance/1"
        isNextDisabled={isNextDisabled()}
        isIntroduction={true} // ✅ Add this flag for introduction steps
      />
    </div>
  );
}
