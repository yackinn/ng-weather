import { Component, Input, ViewChild }                  from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { BehaviorSubject }                              from 'rxjs';
import countriesJson                                    from '../../assets/countries.json';
import { Country, CountryName }                         from '../weather.interface';
import { WeatherService }                               from '../weather.service';

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

  validateCountry(control: AbstractControl, countries: Country[]): ValidationErrors {
    const isValid = countries.some(country => country.name === control.value);
    const error   = { invalid: 'value not available' };

    return isValid ? null : error;
  }

  addLocation() {
    const countryName = this.form.value['countryName'];
    const countryCode = this.countriesDict[countryName]?.countryCode;
    const zip         = this.form.value['zip'];
    this.service.addCurrentConditions({ zip, countryCode });
    this.service.setLoading();
    this.form.reset();
  }

}

function createCountryDict(countries: Country[], key: keyof Country): Record<string, Country> {
  return countries.reduce((acc, country) => {
    acc[country[key]] = country;
    return acc;
  }, {});
}
