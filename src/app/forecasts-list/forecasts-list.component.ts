import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute }       from '@angular/router';
import { Subscription }         from 'rxjs';
import { Forecast }             from '../weather.interface';
import { WeatherService }       from '../weather.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent implements OnDestroy {
  sub: Subscription;
  zip: string;
  forecast: Forecast;

  constructor(
    public weatherService: WeatherService,
    route: ActivatedRoute
  ) {
    this.weatherService.stopAutoRefresh();
    this.sub = route.params.subscribe(params => {
      const zip         = this.zip = params['zipcode'];
      const countryCode = params['countryCode'];

      weatherService.getForecast({ zip, countryCode }).subscribe(data =>
        this.forecast = data
      );
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
