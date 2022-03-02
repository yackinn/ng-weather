import { Component }                          from '@angular/core';
import { Router }                             from '@angular/router';
import { Observable }                         from 'rxjs';
import { CountryCode, WeatherCondition, Zip } from '../weather.interface';
import { WeatherService }                     from '../weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {
  currentConditions$: Observable<WeatherCondition[]>;

  constructor(
    public weatherService: WeatherService,
    private router: Router
  ) {
    this.currentConditions$ = this.weatherService.currentConditions;
    this.weatherService.autoRefresh();
  }

  showForecast(zip: Zip, countryCode: CountryCode) {
    this.router.navigate(['/forecast', zip, countryCode]);
  }

  trackByFn(index: number, item: WeatherCondition) {
    return item.zip;
  }

  onClickRemoveCondition(event: Event, zip: Zip, countryCode: CountryCode) {
    event.stopImmediatePropagation();
    this.weatherService.removeCurrentConditions({ zip, countryCode });
  }
}
