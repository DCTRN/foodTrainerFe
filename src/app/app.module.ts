import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { UserEffects } from './core/stores/user/user.effects';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { DummyComponent } from './core/stores/user/dummy.component';

@NgModule({
  declarations: [AppComponent, DummyComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([UserEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
