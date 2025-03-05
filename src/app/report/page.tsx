  "use client";

  import { useEffect, useState } from "react";
  import { db } from "@/lib/firebase";
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { useRouter } from "next/navigation";
  import { COUNTRIES } from "@/app/data/countries";
  import { EXPENSE_EMISSION_FACTORS, CAPITAL_GOODS_CATEGORIES, HEATING_EMISSION_FACTORS } from "@/app/data/emissionFactors";

  export default function Report() {
    const userId = "testUser123";
    const [processedData, setProcessedData] = useState([]);
    const [userData, setUserData] = useState({});
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
                setUserData(userData);

                const countryDetails = COUNTRIES.find((c) => c.locode === userData.companyLocation);
                if (!countryDetails) throw new Error(`Country not found for locode: ${userData.companyLocation}`);

                const regionCode = countryDetails.exiobaseLocode;
                const sourceCode = countryDetails.sourceCode;
                const expensesCurrency = userData.expensesCurrency.toLowerCase(); // ✅ Ensure lowercase

                const reportingYear = userData.timePeriodTo ? new Date(userData.timePeriodTo).getFullYear() : 2024;

                const batchRequests = [];
                const requestMappings = {}; // Store request-category mappings


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
                    energy: parseFloat(userData.electricity),
                    energy_unit: "kWh",
                  },
                };
            
                batchRequests.push({
                  ...electricityRequest,
                  originalKey: "electricity",
                });
                

                const homeworkingRequest = {
                  emission_factor: {
                    activity_id: "homeworking-type_custom",
                    region: regionCode,
                    year: reportingYear,
                    source_lca_activity: "unknown",
                    year_fallback: true,
                    data_version: "^20",
                  },
                  parameters: {
                    number:
                      (parseInt(userData.employees)) *
                      8 *
                      220 *
                      ((parseFloat(userData.workFromHomePercentage)) / 100),
                  },
                };
               
                batchRequests.push({
                  ...homeworkingRequest,
                  originalKey: "workFromHomePercentage", 
                });
                
                // ✅ **Heating emissions calculation**
                if (
                  userData.heatingMethod &&
                  userData.heatingMethod !== "electricity" &&
                  userData.heatingMethod !== "No heating at site" &&
                  parseFloat(userData.heatingUsage) > 0
                ) {
                  const heatingActivityId = HEATING_EMISSION_FACTORS[userData.heatingMethod.toLowerCase()];

                  if (!heatingActivityId) {
                    console.warn(`⚠️ No emission factor found for heating method: "${userData.heatingMethod}"`);
                  } else {
                    console.log(`✅ Found heating mapping: ${userData.heatingMethod} → ${heatingActivityId}`);

                    const heatingRequest = {
                      emission_factor: {
                        activity_id: heatingActivityId,
                        region: "GB",
                        year: reportingYear,
                        data_version: "^20",
                        year_fallback: true,
                      },
                      parameters: {
                        energy: parseFloat(userData.heatingUsage),
                        energy_unit: "kWh",
                      },
                    };

                    batchRequests.push({
                      ...heatingRequest,
                      originalKey: "heating", // ✅ Store key to align with report logic
                    });

                    // ✅ Store category info mapped to heating
                    requestMappings["heating"] = {
                      scope: userData.heatingMethod.toLowerCase().includes("district") ? "2" : "1",
                      scopeCategory: "1",
                      scopeCategoryName: "Heating",
                    };
                  }
                }


                console.log("✅ Base requests added:", JSON.stringify(batchRequests, null, 2));

                // ✅ **Expense-based emissions**
                const validExpenseKeys = Object.keys(EXPENSE_EMISSION_FACTORS);
                const relevantKeys = ["electricity", "workFromHomePercentage", ...validExpenseKeys];

                requestMappings["electricity"] = { 
                  scope: "2",
                  scopeCategory: "0",
                  scopeCategoryName: "Electricity",
                };
                
                requestMappings["workFromHomePercentage"] = { 
                  scope: "3",
                  scopeCategory: "7",
                  scopeCategoryName: "Homeworking",
                };

                Object.entries(userData).forEach(([key, value]) => {
                  console.log(`🔍 Checking key from Firestore: "${key}"`);
                
                  if (
                    !key.startsWith("expensesBusiness") &&
                    !key.startsWith("expensesMaterials") &&
                    !key.startsWith("expensesTransport") &&
                    !key.startsWith("expensesCapital")
                  ) {
                    return;
                  }
                
                  const activityId = EXPENSE_EMISSION_FACTORS[key];
                
                  if (!activityId) {
                    console.warn(`⚠️ No activity ID found for key: "${key}"`);
                  } else {
                    console.log(`✅ Found mapping: ${key} → ${activityId}`);
                  }

                  if (parseFloat(value) > 0) {
                    console.log(`🔎 Adding Expense: ${key}, Value: ${value}, Activity ID: ${activityId}, Currency: ${expensesCurrency.toLowerCase()}`);

                    const request = {
                      emission_factor: {
                        activity_id: activityId,
                        region: regionCode,
                        year: reportingYear,
                        source_lca_activity: "unknown",
                        data_version: "^20",
                        year_fallback: true,
                      },
                      parameters: {
                        money: parseFloat(value),
                        money_unit: expensesCurrency.toLowerCase(),
                      },
                    };

                    batchRequests.push({
                      ...request,
                      originalKey: key, // ✅ Store key so we can retrieve it later
                    });
                    

                    // ✅ Store category info mapped to the activity ID
                    requestMappings[key] = {
                      scope: "3",
                      scopeCategory: key.startsWith("expensesCapital") ? "2" : "1",
                      scopeCategoryName: key.replace("expenses", "").replace(/([A-Z])/g, " $1").trim(),
                    };
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
                
                // ✅ Dynamically add categories based on valid expense keys
                Object.keys(EXPENSE_EMISSION_FACTORS).forEach((key) => {
                  const category = key.startsWith("expensesCapital") ? "2" : "1";
                  categories.push({
                    scope: "3",
                    scopeCategory: category,
                    scopeCategoryName: key.replace("expenses", "").replace(/([A-Z])/g, " $1").trim(),
                  });
                });

                const processed = batchRequests.map((request, index) => {
                  const response = apiData.results[index] || null;
                  const activityId = request.emission_factor.activity_id;
                  const originalKey = request.originalKey;
                
                  let categoryData = requestMappings[originalKey];
                
                  if (!categoryData) {
                    console.warn(`⚠️ No category data found for key: "${originalKey}". Using predefined mapping.`);
                    categoryData = requestMappings[originalKey] || { scope: "Unknown", scopeCategory: "N/A", scopeCategoryName: "Unknown" };
                  }
                
                  return {
                    scope: categoryData?.scope ?? "Unknown",
                    scopeCategory: categoryData?.scopeCategory ?? "N/A",
                    scopeCategoryName: (categoryData?.scopeCategoryName ?? "Unknown").replace(/,\s*$/, ""),
                    kgCO2e: response?.co2e ?? "N/A",
                    dataSource: response?.emission_factor?.source ?? "Unknown",
                    yearUsed: response?.emission_factor?.year ?? "N/A",
                    expensesCurrency: expensesCurrency ?? "Unknown",
                    error: response?.error?.message ?? "None",
                    activityId: activityId ?? "Unknown",
                  };
                });
                

                // ✅ Define the correct order
                const CATEGORY_ORDER = [
                  "Electricity",
                  "Homeworking",
                  "Transport Road",
                  "Transport Air",
                  "Transport Sea",
                  "Transport Rail",
                  "Transport Other",
                  "Materials Paper",
                  "Materials Textiles",
                  "Materials Plastic",
                  "Materials Metal",
                  "Materials Wood",
                  "Materials Books",
                  "Materials Chemicals",
                  "Materials Food",
                  "Materials Beverages",
                  "Materials Other",
                  "Capital Furniture",
                  "Capital Phones",
                  "Capital Computers",
                  "Capital Vehicles",
                  "Capital Other",
                  "Business Legal",
                  "Business Software",
                  "Business Insurance",
                  "Business Financial",
                  "Business Construction",
                  "Business Corporate",
                ];

                // Sort processed data based on CATEGORY_ORDER
                processed.sort((a, b) => {
                  const indexA = CATEGORY_ORDER.indexOf(a.scopeCategoryName);
                  const indexB = CATEGORY_ORDER.indexOf(b.scopeCategoryName);
                  return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
                });
                
                // Step 2: Log any errors
                const errors = processed
                  .filter(item => item.error)
                  .map(item => ({
                    category: item.scopeCategoryName,
                    message: item.error,
                  }));

                // Step 3: Set processed data & error messages
                setProcessedData(processed);
                setErrorMessages(errors);



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
            
                            {/* ✅ Show API errors in red if present */}
                            {item.error && <p style={{ color: "red" }}>⚠️ Error: {item.error}</p>}
            
                            <button onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                              {expandedIndex === index ? "🔽 Hide Debug Info" : "▶ Show Debug Info"}
                            </button>
                            {expandedIndex === index && (
                              <pre className="bg-gray-100 p-4 mt-2 text-sm overflow-auto">
                                {JSON.stringify(apiLogs.find(log => log.request.emission_factor.activity_id === item.activityId) || {}, null, 2)}
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No report data available.</p>
                    )}
            
                    {/* 🔍 Debugging UI - Displays Firestore keys & their matches */}
                    <div className="bg-gray-100 p-4 rounded-md mt-4">
                      <h2 className="text-lg font-bold">Debugging: Firestore Keys</h2>
                      {Object.keys(userData).length > 0 ? (
  <ul>
    {Object.keys(userData).map((key) => (
      <li key={key} className="text-sm">
        {key} → {EXPENSE_EMISSION_FACTORS[key] || <span className="text-red-500">❌ No Match</span>}
      </li>
    ))}
  </ul>
) : (
  <p>Loading Firestore data...</p>  // ✅ NEW: Prevents crash if `userData` is still empty
)}
                    </div>
            
                    <div className="bg-gray-100 p-4 rounded-md mt-4">
                      <h2 className="text-lg font-bold">Debugging: Available Mappings</h2>
                      <ul>
                        {Object.entries(EXPENSE_EMISSION_FACTORS).map(([key, value]) => (
                          <li key={key} className="text-sm">
                            {key} → {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            );
  }
