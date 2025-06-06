import { Component } from '@angular/core';
import { UserPropertyComponent } from '../user-property/user-property.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-dashboard',
  imports: [UserPropertyComponent, MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
