import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PropertiesRoutingModule} from './properties-routing.module';
import {PropertiesComponent} from './properties.component';
import {TranslatePipe} from "@ngx-translate/core";
import {MenuComponent} from '../menu/menu.component';
import {PropertyMenu} from './property-menu/property-menu';
import { PropertySystem } from './property-system/property-system';


@NgModule({
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    PropertiesComponent,
    PropertyMenu,
    TranslatePipe,
    MenuComponent,
    PropertySystem
  ]
})
export class PropertiesModule {
}
