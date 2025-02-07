"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Report() {
  const userId = "testUser123";
  const [reportData, setReportData] = useState(null);
  const [processedData, setProcessedData] = useState([]);  // ✅ New state for processed data
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDataAndCalculateEmissions = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const countryCode = mapCountryToLocode(userData.companyLocation);

          const batchRequests = [
            {
              emission_factor: {
                activity_id: "electricity-supply_grid-source_supplier_mix",
                source: "BEIS",
                region: countryCode,
                year: 2024,
                source_lca_activity: "electricity_generation",
                data_version: "^20",
              },
              parameters: {
                energy: parseFloat(userData.electricity) || 1000,
                energy_unit: "kWh",
              },
            },
            {
              emission_factor: {
                activity_id: "homeworking-type_office_equipment_and_heating",
                source: "BEIS",
                region: countryCode,
                year: 2024,
                source_lca_activity: "unknown",
                data_version: "^20",
              },
              parameters: {
                time: (parseInt(userData.employees) || 10) * 8 * 220 * 0.5,
                time_unit: "h",
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
              dataSource: "BEIS",
            },
            {
              scope: "Scope 3",
              scopeCategory: "7",
              scopeCategoryName: "Homeworking",
              dataSource: "BEIS",
            },
          ];

          const processed = apiData.results.map((result, index) => ({
            scope: categories[index].scope,
            scopeCategory: categories[index].scopeCategory,
            scopeCategoryName: categories[index].scopeCategoryName,
            kgCO2e: result.co2e || 0,
            dataSource: categories[index].dataSource,
          }));

          setProcessedData(processed); // ✅ Store processed data for rendering

          await setDoc(doc(db, "users", userId), { emissionsReport: processed }, { merge: true });
        }
      } catch (error) {
        console.error("Error generating report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndCalculateEmissions();
  }, []);

  const mapCountryToLocode = (country: string) => {
    const locodeMap = {
      UK: "GB",
      USA: "US",
      Germany: "DE",
    };
    return locodeMap[country] || "GB";
  };

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
            </div>
          ))}
        </div>
      ) : (
        <p>No report data available.</p>
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
