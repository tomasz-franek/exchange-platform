import { Component } from '@angular/core';
import { UserPropertyComponent } from '../user-property/user-property.component';

@Component({
  selector: 'app-dashboard',
  imports: [UserPropertyComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
