export interface Country {
  name: string;
  locode: string;
  exiobaseLocode: string;
  currencyCode: string;
  sourceCode: string;
  sourceName: string;
  feraSourceCode: string;
  feraSourceName: string;
}

export const COUNTRIES: Country[] = [
  { name: "Australia", locode: "AU", exiobaseLocode: "AU", currencyCode: "AUD", sourceCode: "DISER", sourceName: "Australian Government", feraSourceCode: "DISER", feraSourceName: "Australian Government" },
  { name: "Austria", locode: "AT", exiobaseLocode: "AT", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Belgium", locode: "BE", exiobaseLocode: "BE", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Brazil", locode: "BR", exiobaseLocode: "BR", currencyCode: "BRL", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Bulgaria", locode: "BG", exiobaseLocode: "BG", currencyCode: "BGN", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Canada", locode: "CA", exiobaseLocode: "CA", currencyCode: "CAD", sourceCode: "Government of Canada", sourceName: "Canadian Government", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "China", locode: "CN", exiobaseLocode: "CN", currencyCode: "CNY", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Croatia", locode: "HR", exiobaseLocode: "HR", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Cyprus", locode: "CY", exiobaseLocode: "CY", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Czech", locode: "CZ", exiobaseLocode: "CZ", currencyCode: "CZK", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Denmark", locode: "DK", exiobaseLocode: "DK", currencyCode: "DKK", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Estonia", locode: "EE", exiobaseLocode: "EE", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Finland", locode: "FI", exiobaseLocode: "FI", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "France", locode: "FR", exiobaseLocode: "FR", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Germany", locode: "DE", exiobaseLocode: "DE", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Greece", locode: "GR", exiobaseLocode: "GR", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Hong Kong", locode: "HK", exiobaseLocode: "ROW_WA", currencyCode: "HKD", sourceCode: "CLP Group", sourceName: "CLP Group", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Hungary", locode: "HU", exiobaseLocode: "HU", currencyCode: "HUF", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Iceland", locode: "IS", exiobaseLocode: "ROW_WE", currencyCode: "ISK", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "India", locode: "IN", exiobaseLocode: "IN", currencyCode: "INR", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Indonesia", locode: "ID", exiobaseLocode: "ID", currencyCode: "IDR", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Ireland", locode: "IE", exiobaseLocode: "IE", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Italy", locode: "IT", exiobaseLocode: "IT", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Japan", locode: "JP", exiobaseLocode: "JP", currencyCode: "JPY", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Latvia", locode: "LV", exiobaseLocode: "LV", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Lithuania", locode: "LT", exiobaseLocode: "LT", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Luxembourg", locode: "LU", exiobaseLocode: "LU", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Malta", locode: "MT", exiobaseLocode: "MT", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Mexico", locode: "MX", exiobaseLocode: "MX", currencyCode: "MXN", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Netherlands", locode: "NL", exiobaseLocode: "NL", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "New Zealand", locode: "NZ", exiobaseLocode: "ROW_WA", currencyCode: "NZD", sourceCode: "MfE", sourceName: "New Zealand Government", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Norway", locode: "NO", exiobaseLocode: "NO", currencyCode: "NOK", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Poland", locode: "PL", exiobaseLocode: "PL", currencyCode: "PLN", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Portugal", locode: "PT", exiobaseLocode: "PT", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Romania", locode: "RO", exiobaseLocode: "RO", currencyCode: "RON", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Russia", locode: "RU", exiobaseLocode: "RU", currencyCode: "RUB", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Saudi Arabia", locode: "SA", exiobaseLocode: "ROW_WM", currencyCode: "SAR", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Singapore", locode: "SG", exiobaseLocode: "ROW_WA", currencyCode: "SGD", sourceCode: "EMA", sourceName: "Singapore EMA", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Slovakia", locode: "SK", exiobaseLocode: "SK", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Slovenia", locode: "SI", exiobaseLocode: "SI", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "South Korea", locode: "KR", exiobaseLocode: "KR", currencyCode: "KRW", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "South Africa", locode: "ZA", exiobaseLocode: "ZA", currencyCode: "ZAR", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Spain", locode: "ES", exiobaseLocode: "ES", currencyCode: "EUR", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Sweden", locode: "SE", exiobaseLocode: "SE", currencyCode: "SEK", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Switzerland", locode: "CH", exiobaseLocode: "CH", currencyCode: "CHF", sourceCode: "AIB", sourceName: "EU AIB", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Thailand", locode: "TH", exiobaseLocode: "ROW_WA", currencyCode: "THB", sourceCode: "EPPO", sourceName: "Thailand EPPO", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "Türkiye", locode: "TR", exiobaseLocode: "TR", currencyCode: "TRY", sourceCode: "CT", sourceName: "Climate Transparency", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "United Kingdom", locode: "GB", exiobaseLocode: "GB", currencyCode: "GBP", sourceCode: "BEIS", sourceName: "UK Government", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
  { name: "United States", locode: "US", exiobaseLocode: "US", currencyCode: "USD", sourceCode: "EPA", sourceName: "US EPA", feraSourceCode: "BEIS", feraSourceName: "UK Government" },
 ];
