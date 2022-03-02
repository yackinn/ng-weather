import { HttpClient }                                                                         from '@angular/common/http';
import { Injectable }                                                                         from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject }                                     from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil, withLatestFrom }                       from 'rxjs/operators';
import { LOCATIONS, LocationService }                                                         from './location.service';
import { coerceArray, getWeatherLocation }                                                    from './utils';
import { Forecast, WeatherCondition, WeatherLocation, WeatherRequestParams, WeatherResponse } from './weather.interface';

@Injectable()
export class WeatherService {
  static REFRESH_TIME = 30000;
  static URL          = 'http://api.openweathermap.org/data/2.5';
  static APPID        = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL     = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private conditions$ = new BehaviorSubject<Record<WeatherLocation, WeatherCondition>>(null);
  private _isLoading$ = new BehaviorSubject<boolean>(false);

  isLoading$               = this._isLoading$.pipe(distinctUntilChanged());
  currentConditions        = this.conditions$.pipe(
    filter(Boolean),
    map(conditions => Object.values(conditions)),
    distinctUntilChanged()
  );
  private stopAutoRefresh$ = new Subject();

  constructor(
    private http: HttpClient,
    private locationService: LocationService
  ) {
    this.restoreConditions();
  }

  setLoading() {
    this._isLoading$.next(true);
  }

  addCurrentConditions(params: WeatherRequestParams | WeatherRequestParams[]): void {
    const weatherParams = coerceArray(params);

    weatherParams.forEach(item => {
      this.http.get<WeatherResponse>(
        `${WeatherService.URL}/weather?zip=${item.zip},${item.countryCode}&units=imperial&APPID=${WeatherService.APPID}`
      ).subscribe({
        next: data => {
          this.addCondition({ zip: item.zip, countryCode: item.countryCode, data });
          this.locationService.addLocation(getWeatherLocation(item.zip, item.countryCode));
        },
        error: (err) => {
          this._isLoading$.next(false);
          alert(err?.error?.message || 'Something went wrong.');
        },
        complete: () => this._isLoading$.next(false)
      });
    });
  }

  removeCurrentConditions(params: WeatherRequestParams | WeatherRequestParams[]) {
    const weatherParams = coerceArray(params);

    weatherParams.forEach(item => {
      this.removeCondition({ zip: item.zip, countryCode: item.countryCode });
      this.locationService.removeLocation(getWeatherLocation(item.zip, item.countryCode));
    });
  }

  getForecast(params: WeatherRequestParams): Observable<Forecast> {
    return this.http.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${params.zip},${params.countryCode}&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }

  getWeatherIcon(id) {
    if (id >= 200 && id <= 232) {
      return WeatherService.ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return WeatherService.ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return WeatherService.ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return WeatherService.ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return WeatherService.ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return WeatherService.ICON_URL + 'art_fog.png';
    } else {
      return WeatherService.ICON_URL + 'art_clear.png';
    }
  }

  autoRefresh() {
    interval(WeatherService.REFRESH_TIME).pipe(
      takeUntil(this.stopAutoRefresh$),
      withLatestFrom(this.conditions$),
      map(([_, conditions]) => Object.values(conditions || {})),
      filter((paramsList) => paramsList.length > 0)
    ).subscribe((paramsList) => {
      this.addCurrentConditions(paramsList);
    });
  }

  stopAutoRefresh() {
    this.stopAutoRefresh$.next();
  }

  private addCondition(condition: WeatherCondition) {
    const location          = getWeatherLocation(condition.zip, condition.countryCode);
    const currentConditions = this.conditions$.getValue();

    this.conditions$.next({
      ...currentConditions,
      [location]: condition
    });
  }

  private removeCondition(params: WeatherRequestParams) {
    const location = getWeatherLocation(params.zip, params.countryCode);

    const { [location]: removed, ...rest } = this.conditions$.getValue();
    this.conditions$.next(rest);
  }

  private restoreConditions() {
    let locString = localStorage.getItem(LOCATIONS);

    JSON.parse(locString)?.forEach(locationString => {
      const [zip, countryCode] = locationString.split('-');
      this.addCurrentConditions({ zip, countryCode });
    });
  }
}
