export interface Country {
  name: string;
  locode: string;
  currencyCode: string;
  sourceCode: string;
  sourceName: string;
  feraSourceCode: string;
  feraSourceName: string;
}

export const COUNTRIES: Country[] = [
  { name: "Australia", locode: "AU", currencyCode: "AUD", sourceCode: "DISER", sourceName: "Australian Government", feraSourceCode: "DISER", feraSourceName: "Australian Government" },
  { name: "Austria", locode: "AT", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Belgium", locode: "BE", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Brazil", locode: "BR", currencyCode: "BRL", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Bulgaria", locode: "BG", currencyCode: "BGN", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Canada", locode: "CA", currencyCode: "CAD", sourceCode: "Government of Canada", sourceName: "Canadian Government", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "China", locode: "CN", currencyCode: "CNY", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Croatia", locode: "HR", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Cyprus", locode: "CY", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Czech", locode: "CZ", currencyCode: "CZK", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Denmark", locode: "DK", currencyCode: "DKK", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Estonia", locode: "EE", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Finland", locode: "FI", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "France", locode: "FR", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Germany", locode: "DE", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Greece", locode: "GR", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Hong Kong", locode: "HK", currencyCode: "HKD", sourceCode: "CLP Group", sourceName: "CLP Group", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Hungary", locode: "HU", currencyCode: "HUF", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Iceland", locode: "IS", currencyCode: "ISK", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "India", locode: "IN", currencyCode: "INR", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Indonesia", locode: "ID", currencyCode: "IDR", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Ireland", locode: "IE", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Italy", locode: "IT", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Japan", locode: "JP", currencyCode: "JPY", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Latvia", locode: "LV", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Lithuania", locode: "LT", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Luxembourg", locode: "LU", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Malta", locode: "MT", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Mexico", locode: "MX", currencyCode: "MXN", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Netherlands", locode: "NL", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "New Zealand", locode: "NZ", currencyCode: "NZD", sourceCode: "MfE", sourceName: "New Zealand Government", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Norway", locode: "NO", currencyCode: "NOK", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Poland", locode: "PL", currencyCode: "PLN", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Portugal", locode: "PT", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Romania", locode: "RO", currencyCode: "RON", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Russia", locode: "RU", currencyCode: "RUB", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Saudi Arabia", locode: "SA", currencyCode: "SAR", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Singapore", locode: "SG", currencyCode: "SGD", sourceCode: "EMA", sourceName: "Singapore EMA", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Slovakia", locode: "SK", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Slovenia", locode: "SI", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Thailand", locode: "TH", currencyCode: "THB", sourceCode: "EPPO", sourceName: "Thailand EPPO", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Türkiye", locode: "TR", currencyCode: "TRY", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "South Africa", locode: "ZA", currencyCode: "ZAR", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "South Korea", locode: "KR", currencyCode: "KRW", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Spain", locode: "ES", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Sweden", locode: "SE", currencyCode: "SEK", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Switzerland", locode: "CH", currencyCode: "CHF", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "United Kingdom", locode: "GB", currencyCode: "GBP", sourceCode: "BEIS", sourceName: "UK Government", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "United States", locode: "US", currencyCode: "USD", sourceCode: "EPA", sourceName: "US EPA", feraSourceCode: "BEIS", feraSourceName: "UK Government" }
];
