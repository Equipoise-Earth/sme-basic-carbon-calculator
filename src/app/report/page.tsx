"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/app/data/countries";

export default function Report() {
  const userId = "testUser123";
  const [reportData, setReportData] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState([]); // ✅ Track errors

  const router = useRouter();

  useEffect(() => {
    const fetchDataAndCalculateEmissions = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const countryDetails = COUNTRIES.find(
            (c) => c.locode === userData.companyLocation
          );

          const regionCode = countryDetails ? countryDetails.locode : "GB";
          const sourceCode = countryDetails ? countryDetails.sourceCode : "BEIS";

          const batchRequests = [
            {
              emission_factor: {
                activity_id: "electricity-supply_grid*",
                source: sourceCode,
                region: regionCode,
                year: 2024,
                source_lca_activity: "electricity_generation",
                data_version: "^20",
                year_fallback: true,
              },
              parameters: {
                energy: parseFloat(userData.electricity) || 1000,
                energy_unit: "kWh",
              },
            },
            {
              emission_factor: {
                activity_id: "homeworking-type_custom",
                region: regionCode,
                year: 2024,
                source_lca_activity: "unknown",
                data_version: "^20",
              },
              parameters: {
                number: (parseInt(userData.employees) || 10) * 8 * 220 * 0.5,
              },
            },
          ];

          const apiResponse = await fetch("https://api.climatiq.io/batch", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(batchRequests),
          });

          const apiData = await apiResponse.json();
          setReportData(apiData);

          const categories = [
            {
              scope: "Scope 2",
              scopeCategory: "0",
              scopeCategoryName: "Electricity",
            },
            {
              scope: "Scope 3",
              scopeCategory: "7",
              scopeCategoryName: "Homeworking",
            },
          ];

          const errors = [];
          const processed = apiData.results.map((result, index) => {
            const emissionFactor = result?.emission_factor || {};

            // ✅ Error handling for each batch request
            if (result?.error) {
              errors.push({
                category: categories[index].scopeCategoryName,
                message: result.error.message || "Unknown error occurred.",
              });
            }

            return {
              scope: categories[index].scope,
              scopeCategory: categories[index].scopeCategory,
              scopeCategoryName: categories[index].scopeCategoryName,
              kgCO2e: result.co2e || 0,
              dataSource: emissionFactor.source || "Unknown", // ✅ Dynamic source from API
              yearUsed: emissionFactor.year || "N/A",
              error: result?.error || null, // ✅ Store error if exists
            };
          });

          setErrorMessages(errors); // ✅ Capture errors for display
          setProcessedData(processed);

          await setDoc(doc(db, "users", userId), { emissionsReport: processed }, { merge: true });
        }
      } catch (error) {
        console.error("Error generating report:", error);
        setErrorMessages([{ category: "General", message: error.message }]); // ✅ Global error handler
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndCalculateEmissions();
  }, []);

  if (isLoading) return <p>Loading report...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Company Emissions Report</h1>

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

              {/* ✅ Display error if exists */}
              {item.error && (
                <p className="text-red-500 mt-2">⚠️ Error: {item.error.message}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No report data available.</p>
      )}

      {/* ✅ General Errors */}
      {errorMessages.length > 0 && (
        <div className="bg-red-100 p-4 rounded-md mt-4">
          <h2 className="font-bold text-red-700">Errors Detected:</h2>
          {errorMessages.map((err, idx) => (
            <p key={idx} className="text-red-600">
              <strong>{err.category}:</strong> {err.message}
            </p>
          ))}
        </div>
      )}

      <button
        onClick={() => router.push("/")}
        className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary"
      >
        Back to Home
      </button>
    </div>
  );
}
