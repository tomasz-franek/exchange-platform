import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertiesRoutingModule } from './properties-routing-module';
import { PropertyMenu } from './property-menu/property-menu';
import { PropertiesComponent } from './properties.component';

@NgModule({
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    PropertyMenu,
    PropertiesComponent,
  ],
})
export class PropertiesModule {}
