import { HttpClientModule }           from '@angular/common/http';
import { NgModule }                   from '@angular/core';
import { FormsModule }                from '@angular/forms';
import { BrowserModule }              from '@angular/platform-browser';
import { RouterModule }               from '@angular/router';
import { ServiceWorkerModule }        from '@angular/service-worker';
import { environment }                from '../environments/environment';
import { AppComponent }               from './app.component';
import { routing }                    from './app.routing';
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { ForecastsListComponent }     from './forecasts-list/forecasts-list.component';
import { LocationService }            from './location.service';
import { MainPageComponent }          from './main-page/main-page.component';
import { ArrayValidator }             from './shared/array-validator.directive';
import { HighlightPipe }             from './shared/highlight.pipe';
import { ThreeStateButtonComponent } from './shared/three-state-button.component';
import { SanitizeHtmlPipe }          from './shared/sanitize-html.pipe';
import { WeatherService }             from './weather.service';
import { AutocompleteInputComponent } from './zipcode-entry/autocomplete-input/autocomplete-input.component';
import { ZipcodeEntryComponent }      from './zipcode-entry/zipcode-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    AutocompleteInputComponent,
    HighlightPipe,
    SanitizeHtmlPipe,
    ArrayValidator,
    ThreeStateButtonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [LocationService, WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule {}
