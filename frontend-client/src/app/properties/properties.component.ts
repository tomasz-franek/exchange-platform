import { Component } from '@angular/core';
import { PropertyMenu } from './property-menu/property-menu';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css',
  imports: [PropertyMenu],
  standalone: true,
})
export class PropertiesComponent {}
