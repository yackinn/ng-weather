export interface WeatherCondition {
  zip: string;
  countryCode: string;
  data: WeatherData;
}

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: Weather[];
}

export interface WeatherResponse {
  name: string;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: Weather[];
}

export interface Weather {
  description: string;
  icon: string;
  id: number;
  main: string;
}

export interface WeatherRequestParams {
  zip: Zip;
  countryCode: string;
}

export type Zip = string
export type CountryName = string
export type CountryCode = string
export type WeatherLocation = string // zip + country code

export interface Country extends StringRecord {
  name: string;
  countryCode: string;
}

export interface StringRecord {
  [key: string]: string;
}

export interface Forecast {
  list: ForecastListItem[];
  city: {
    name: string
  };
}

export interface ForecastListItem {
  weather: Weather[];
  dt: number;
  temp: {
    min: number;
    max: number
  };
}
