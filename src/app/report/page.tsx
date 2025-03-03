"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/app/data/countries";
import { EXPENSE_EMISSION_FACTORS, CAPITAL_GOODS_CATEGORIES } from "@/app/data/emissionFactors";

export default function Report() {
  const userId = "testUser123";
  const [processedData, setProcessedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState([]);
  const [apiLogs, setApiLogs] = useState([]); // ✅ Store API request/response pairs
  const [expandedIndex, setExpandedIndex] = useState(null); // ✅ Track dropdown state

  const router = useRouter();

  useEffect(() => {
    const fetchDataAndCalculateEmissions = async () => {
      try {
        console.log("🚀 Fetching user data...");
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) throw new Error("User data not found.");

        const userData = docSnap.data();
        console.log("🔎 Retrieved User Data:", userData);

        const countryDetails = COUNTRIES.find((c) => c.locode === userData.companyLocation);
        if (!countryDetails) throw new Error(`Country not found for locode: ${userData.companyLocation}`);

        const regionCode = countryDetails.exiobaseLocode;
        const sourceCode = countryDetails.sourceCode;
        const expensesCurrency = userData.expensesCurrency.toLowerCase(); // ✅ Ensure lowercase

        const reportingYear = userData.timePeriodTo ? new Date(userData.timePeriodTo).getFullYear() : 2024;

        const batchRequests = [];

        // ✅ **Base emissions calculations**
        const electricityRequest = {
          emission_factor: {
            activity_id: "electricity-supply_grid*",
            source: sourceCode,
            region: regionCode,
            year: reportingYear,
            source_lca_activity: "electricity_generation",
            data_version: "^20",
            year_fallback: true,
          },
          parameters: {
            energy: parseFloat(userData.electricity) || 1000,
            energy_unit: "kWh",
          },
        };
        batchRequests.push(electricityRequest);

        const homeworkingRequest = {
          emission_factor: {
            activity_id: "homeworking-type_custom",
            region: regionCode,
            year: reportingYear,
            source_lca_activity: "unknown",
            data_version: "^20",
          },
          parameters: {
            number:
              (parseInt(userData.employees) || 10) *
              8 *
              220 *
              ((parseFloat(userData.workFromHomePercentage) || 0) / 100),
          },
        };
        batchRequests.push(homeworkingRequest);

        console.log("✅ Base requests added:", JSON.stringify(batchRequests, null, 2));

        // ✅ **Expense-based emissions**
        const validExpenseKeys = Object.keys(EXPENSE_EMISSION_FACTORS);
const relevantKeys = ["electricity", "workFromHomePercentage", ...validExpenseKeys];

Object.entries(userData).forEach(([key, value]) => {
  if (!relevantKeys.includes(key) && key !== "electricity" && key !== "workFromHomePercentage") return; // ✅ Ensure electricity & homeworking are included

  const activityId = EXPENSE_EMISSION_FACTORS[key];

  if ((activityId && parseFloat(value) > 0) || key === "electricity" || key === "workFromHomePercentage") {
   console.log(`🔎 Adding Expense: ${key}, Value: ${value}, Activity ID: ${activityId}, Currency: ${expensesCurrency.toLowerCase()}`);

    batchRequests.push({
      emission_factor: {
        activity_id: activityId,
        region: regionCode,
        year: reportingYear,
        source_lca_activity: "unknown",
        data_version: "^20",
      },
      parameters: {
        money: parseFloat(value),
        money_unit: expensesCurrency.toLowerCase(),
      },
    });
  } else {
    console.warn(`⚠️ Skipped Expense: ${key}, Value: ${value}, Activity ID: ${activityId || "N/A"}`);
  }
});


        console.log("🚀 Final Batch Request Payload:", JSON.stringify(batchRequests, null, 2));

        // ✅ **Make the API request**
        const apiResponse = await fetch("https://api.climatiq.io/batch", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(batchRequests),
        });

        console.log("🔄 Waiting for API response...");

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          throw new Error(`API Request Failed: ${apiResponse.status} ${apiResponse.statusText} - ${errorText}`);
        }

        const apiData = await apiResponse.json();
        console.log("🔎 Climatiq API Response:", JSON.stringify(apiData, null, 2));

        if (!apiData.results) throw new Error("No results returned from Climatiq.");

        // ✅ **Store API request & response pairs for debugging**
        const apiLogsData = batchRequests.map((req, index) => ({
          request: req,
          response: apiData.results[index] || null,
        }));
        setApiLogs(apiLogsData);

        // ✅ **Categories for emissions results display**
        const categories = [
          { scope: "2", scopeCategory: "0", scopeCategoryName: "Electricity" },
          { scope: "3", scopeCategory: "7", scopeCategoryName: "Homeworking" },
        ];

        Object.keys(EXPENSE_EMISSION_FACTORS).forEach((key) => {
          const category = CAPITAL_GOODS_CATEGORIES.includes(key) ? "2" : "1";
          categories.push({
            scope: "3",
            scopeCategory: category,
            scopeCategoryName: key.replace("expenses", "").replace(/([A-Z])/g, " $1").trim(),
          });
        });

        // ✅ **Process API response & handle errors**
        const errors = [];
        const processed = apiData.results.map((result, index) => {
          const emissionFactor = result?.emission_factor || {};
          if (result?.error) {
            errors.push({
              category: categories[index]?.scopeCategoryName || "Unknown",
              message: result.error.message || "Unknown error occurred.",
            });
          }

          return {
            scope: categories[index]?.scope || "Unknown",
            scopeCategory: categories[index]?.scopeCategory || "N/A",
            scopeCategoryName: categories[index]?.scopeCategoryName || "Unknown",
            kgCO2e: result.co2e || 0,
            dataSource: emissionFactor.source || "Unknown",
            yearUsed: emissionFactor.year || "N/A",
            expensesCurrency: expensesCurrency,
            error: result?.error || null,
          };
        });

        setErrorMessages(errors);
        setProcessedData(processed);

        await setDoc(doc(db, "users", userId), { emissionsReport: processed }, { merge: true });
      } catch (error) {
        console.error("❌ Error generating report:", error);
        setErrorMessages([{ category: "General", message: error.message }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndCalculateEmissions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Company Emissions Report</h1>

      {isLoading ? (
        <p>Loading report...</p>
      ) : (
        <>
          {processedData.length > 0 ? (
            <div className="bg-white p-4 shadow rounded-md">
              {processedData.map((item, index) => (
                <div key={index} className="mb-4 border-b pb-2">
                  <h2 className="font-bold text-xl">{item.scopeCategoryName}</h2>
                  <p>Scope: {item.scope}</p>
                  <p>Category: {item.scopeCategory}</p>
                  <p>Emissions: {item.kgCO2e} kgCO₂e</p>
                  <p>Data Source: {item.dataSource}</p>
                  <p>Emission Factor Year: {item.yearUsed}</p>
                  <button onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                    {expandedIndex === index ? "🔽 Hide Debug Info" : "▶ Show Debug Info"}
                  </button>
                  {expandedIndex === index && (
                    <pre className="bg-gray-100 p-4 mt-2 text-sm overflow-auto">
                      {JSON.stringify(apiLogs[index], null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No report data available.</p>
          )}
        </>
      )}
    </div>
  );
}
