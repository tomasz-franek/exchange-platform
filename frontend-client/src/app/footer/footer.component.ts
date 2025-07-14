import { Component } from '@angular/core';
import { VersionComponent } from '../version/version.component';

@Component({
  selector: 'app-footer',
  imports: [VersionComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
