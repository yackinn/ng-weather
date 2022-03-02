import { Injectable }      from '@angular/core';
import { WeatherLocation } from './weather.interface';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {
  locations: string[] = [];

  addLocation(location: WeatherLocation) {
    if (this.locations.find(loc => loc === location)?.length > 0) {
      return;
    }

    this.locations.push(location);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
  }

  removeLocation(location: WeatherLocation) {
    let index = this.locations.indexOf(location);

    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }
}
