// src/lib/climatiq.ts
const CLIMATIQ_API_KEY = process.env.CLIMATIQ_API_KEY;
const API_URL = "https://api.climatiq.io/batch";

// LOCODE mapping
import { LOCODE_MAP } from "@/data/countries";

// 🌍 Function to determine LOCODE
const getLocode = (country: string) => LOCODE_MAP[country] || "GB"; // Fallback to GB

// 📊 Main Batch API Call
export async function calculateEmissions(userData: any) {
  const { country, electricityUsage, employees } = userData;
  const region = getLocode(country);
  const source = "BEIS"; // This may vary by country later

  // Request 1: Electricity Emissions
  const electricityRequest = {
    emission_factor: {
      activity_id: "electricity-supply_grid-source_supplier_mix",
      source,
      region,
      year: 2024,
      source_lca_activity: "electricity_generation",
      data_version: "^20",
    },
    parameters: {
      energy: electricityUsage,
      energy_unit: "kWh",
    },
  };

  // Request 2: Homeworking Emissions
  const workingHours = employees * 8 * 260 * 0.5; // 8 hours/day, 260 working days/year * 0.5 factor

  const homeworkingRequest = {
    emission_factor: {
      activity_id: "homeworking-type_office_equipment_and_heating",
      source,
      region,
      year: 2024,
      source_lca_activity: "unknown",
      data_version: "^20",
    },
    parameters: {
      time: workingHours,
      time_unit: "h",
    },
  };

  // 🚀 Batch Request
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([electricityRequest, homeworkingRequest]),
    });

    const data = await response.json();
    return formatResults(data.results);
  } catch (error) {
    console.error("Error fetching emissions data:", error);
    return null;
  }
}

// 🗃️ Format the API Response
function formatResults(results: any[]) {
  return [
    {
      scope: "Scope 2.0",
      category: "Electricity",
      categoryName: "Grid Electricity",
      kgCO2e: results[0]?.co2e || 0,
      dataSource: results[0]?.emission_factor?.source || "Unknown",
    },
    {
      scope: "Scope 3.7",
      category: "Homeworking",
      categoryName: "Office Equipment & Heating",
      kgCO2e: results[1]?.co2e || 0,
      dataSource: results[1]?.emission_factor?.source || "Unknown",
    },
  ];
}
