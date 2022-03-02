import { CountryCode, Zip, WeatherLocation } from './weather.interface';

export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function getWeatherLocation(zip: Zip, countryCode: CountryCode): WeatherLocation {
  return `${zip}-${countryCode}`;
}
