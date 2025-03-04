// Maps app-specific expense categories to Climatiq activity IDs
export const EXPENSE_EMISSION_FACTORS: Record<string, string> = {
    // Transport & Freight
    expensesTransportRoad: "transport_services-type_other_land_transportation_services",
    expensesTransportAir: "transport_services-type_air_transport_services",
    expensesTransportSea: "transport_services-type_sea_coastal_water_transportation_services",
    expensesTransportRail: "transport_services-type_railway_transportation_services",
    expensesTransportOther: "transport_services-type_supporting_auxiliary_and_travel_agency_services",
  
    // Materials & Inventory
    expensesMaterialsPaper: "paper_products-type_paper_paper_products",
    expensesMaterialsTextiles: "textiles-type_textiles",
    expensesMaterialsPlastic: "plastics_rubber-type_rubber_plastic_products",
    expensesMaterialsMetal: "metal_products-type_fabricated_metal_products_except_machinery_equipment",
    expensesMaterialsWood: "timber_forestry-type_products_of_wood_cork_straw_plaiting_materials",
    expensesMaterialsBooks: "paper_products-type_printed_matter_recorded_media",
    expensesMaterialsChemicals: "chemicals-type_chemicals_not_elsewhere_specified",
    expensesMaterialsFood: "consumer_goods-type_food_products_not_elsewhere_specified",
    expensesMaterialsBeverages: "consumer_goods-type_beverages",
    expensesMaterialsOther: "consumer_goods-type_furniture_other_manufactured_goods_not_elsewhere_specified",
  
    // Capital Goods (assigned scopeCategory = 2 in `page.tsx`)
    expensesCapitalFurniture: "consumer_goods-type_furniture_other_manufactured_goods_not_elsewhere_specified",
    expensesCapitalPhones: "electrical_equipment-type_radio_television_communication_equipment_apparatus",
    expensesCapitalComputers: "office_equipment-type_office_machinery_computers",
    expensesCapitalVehicles: "passenger_vehicle-vehicle_type_motor_vehicles_trailers_semitrailers-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na",
    expensesCapitalOther: "machinery-type_machinery_equipment_not_elsewhere_specified",
  
    // Business Services
    expensesBusinessLegal: "professional_services-type_other_business_services",
    expensesBusinessSoftware: "professional_services-type_computer_related_services",
    expensesBusinessInsurance: "insurance-type_insurance_pension_funding_services_except_compulsory_social_security_services",
    expensesBusinessFinancial: "financial_services-type_financial_intermediation_services_except_insurance_pension_funding_services",
    expensesBusinessConstruction: "construction-type_construction_work",
    expensesBusinessCorporate: "restaurants_accommodation-type_hotel_restaurant_services",
  };
  
  // Capital Goods Categories for assigning scopeCategory = "2" in `page.tsx`
  export const CAPITAL_GOODS_CATEGORIES: string[] = [
    "expensesCapitalFurniture",
    "expensesCapitalElectronics",
    "expensesCapitalComputers",
    "expensesCapitalVehicles",
    "expensesCapitalMachinery",
  ];
  
  //Heating EFs
  export const HEATING_EMISSION_FACTORS: Record<string, string> = {
    "natural gas": "fuel-type_natural_gas_bio_average_net-fuel_use_na",
    "district heating": "heat_and_steam-type_district",
    "oil": "fuel-type_burning_oil-fuel_use_na",
    "biomass": "fuel-type_wood_logs_bio_100_net-fuel_use_na",
};