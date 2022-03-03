import { Component, forwardRef, Input, OnInit }    from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, Observable, of }         from 'rxjs';
import { map, withLatestFrom }                     from 'rxjs/operators';
import { Country }                                 from '../../weather.interface';

const noop = () => {
};

@Component({
  selector: 'app-autocomplete-input',
  styleUrls: ['./autocomplete-input.component.css'],
  templateUrl: './autocomplete-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteInputComponent),
      multi: true
    }
  ]
})
export class AutocompleteInputComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder          = '';
  @Input() required             = false;
  @Input() countries: Country[] = [];

  private innerValue: any = '';

  isFocused = false;
  _input    = new BehaviorSubject('');
  filteredCountries: Observable<Country[]>;

  private onTouchedCallback: () => void      = noop;
  private onChangeCallback: (_: any) => void = noop;

  get value(): any {
    return this.innerValue;
  };

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
      this._input.next(v);
    }
  }

  ngOnInit() {
    this.setupFilteredCountries();
  }

  writeValue(value: any) {
    this._input.next(value);
    this.innerValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  onClickCountry(country: Country) {
    this.value     = country.name;
    this.isFocused = false;
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    setTimeout(() => {
      this.isFocused = false;
    }, 100);
  }

  private setupFilteredCountries() {
    this.filteredCountries = this._input.pipe(
      withLatestFrom(of(this.countries)),
      map(([input, countries]: [string, Country[]]) => {
        if (!input || input.length === 0) {
          return [];
        }
        return countries.filter(country => country.name.toLowerCase().includes(input.toLowerCase()));
      })
    );
  }
}
