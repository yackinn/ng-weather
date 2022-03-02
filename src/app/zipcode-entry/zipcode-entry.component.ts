import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup }                   from '@angular/forms';
import { BehaviorSubject }             from 'rxjs';
import { map }                         from 'rxjs/operators';
import countriesJson                   from '../../assets/countries.json';
import { Country, CountryName }        from '../weather.interface';
import { WeatherService }              from '../weather.service';

@Component({
  selector: 'app-zipcode-entry',
  styleUrls: ['./zipcode-entry.component.css'],
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {
  @ViewChild('form') form: FormGroup;

  countries: Country[]                                 = countriesJson;
  countriesDict: Record<CountryName, Country>          = createCountryDict(this.countries, 'name');
  zip: number;
  country: number;
  state$: BehaviorSubject<'ready' | 'adding' | 'done'> = new BehaviorSubject('ready');
  label$                                               = this.state$.pipe(
    map(state => {
      switch (state) {
        case 'ready':
          return 'Add Location';
        case 'adding':
          return 'Adding...';
        case 'done':
          return 'Done';
      }
    })
  );

  @Input() set isLoading(isLoading: boolean) {
    const state = this.state$.getValue();

    if (isLoading && state === 'ready') {
      this.state$.next('adding');
    } else if (!isLoading && state === 'adding') {
      this.state$.next('done');
      setTimeout(() => {
        this.state$.next('ready');
      }, 500);
    }
  }

  constructor(private service: WeatherService) {}

  addLocation() {
    const countryName = this.form.value['countryName'];
    const countryCode = this.countriesDict[countryName].countryCode;
    const zip         = this.form.value['zip'];

    this.service.addCurrentConditions({ zip, countryCode });
    this.form.reset();
  }

}

function createCountryDict(countries: Country[], key: keyof Country): Record<string, Country> {
  return countries.reduce((acc, country) => {
    acc[country[key]] = country;
    return acc;
  }, {});
}
