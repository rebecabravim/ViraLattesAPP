import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HomeModule } from './features/home/home.module';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { SharedModule } from './features/shared/shared.module';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth/auth.interceptor';
import { LoaderComponent } from './features/shared/components/loader/loader.component';

@NgModule({
  declarations: [AppComponent, LoaderComponent],
  imports: [
    CommonModule,
    BrowserModule,
    HomeModule,
    AuthenticationModule,
    SharedModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
