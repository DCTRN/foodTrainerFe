import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationInterceptor } from '@core/authentication/authentication.interceptor';
import { LoggerInterceptor } from '@core/logs/logger.interceptor';
import { ModalModule } from '@core/modal-service/modal.module';
import { NotificationModule } from '@core/notifications/notification.module';
import { NotificationService } from '@core/notifications/service/notification.service';
import { ProductsEffects } from '@core/stores/products/products.effects';
import { UserProductsEffects } from '@core/stores/user-products/user-products.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FriendsEffects } from '@stores/friends/friends.effects';
import { TokenEffects } from '@stores/tokens/tokens.effects';
import { UserEffects } from '@stores/user/user.effects';
import { ChartsModule } from 'ng2-charts';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HostDirective } from './core/directives/host/host.directive';
import { metaReducers, reducers } from './reducers';

@NgModule({
  declarations: [AppComponent, HostDirective],
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
    EffectsModule.forRoot([
      UserEffects,
      TokenEffects,
      FriendsEffects,
      ProductsEffects,
      UserProductsEffects,
    ]),
    MatSnackBarModule,
    NgxWebstorageModule.forRoot(),
    MatProgressSpinnerModule,
    ModalModule,
    NotificationModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
