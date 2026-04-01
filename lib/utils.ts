import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import countries from "i18n-iso-countries";

// Register French locale
countries.registerLocale(require("i18n-iso-countries/langs/fr.json"));

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to get list of countries for dropdown in French
export function getCountriesList() {
  const countryNames = countries.getNames("fr");

  const countriesList = Object.entries(countryNames).map(([code, name]) => ({
    code: code.toUpperCase(),
    name: name as string,
    native: name as string, // Keep for compatibility
  }));

  // Sort countries alphabetically by French name
  return countriesList.sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

// Function to get country code from country name (supports French names)
export function getCountryCode(countryName: string): string {
  if (!countryName) return "TG"; // Default to Togo

  const normalizedCountry = countryName.toLowerCase().trim();

  // Get all country names in French
  const countryNames = countries.getNames("fr");

  // Search through all countries
  for (const [code, name] of Object.entries(countryNames)) {
    if ((name as string).toLowerCase() === normalizedCountry) {
      return code.toUpperCase();
    }
  }

  return "TG"; // Default to Togo if not found
}
