import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app.routes';
import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
import {bootstrapApplication} from '@angular/platform-browser';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    AppComponent,
    StoreModule
  ],
})
export class AppModule {
}

bootstrapApplication(AppComponent);
