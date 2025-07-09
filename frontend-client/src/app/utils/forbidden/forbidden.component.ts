import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forbidden',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css'],
  standalone: true,
})
export class ForbiddenComponent {}
