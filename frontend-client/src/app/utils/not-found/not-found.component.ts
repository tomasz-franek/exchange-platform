import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [TranslatePipe],
  templateUrl: './not-found.component.html',
  standalone: true,
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {}
