import {Component, inject, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {BuildInfo} from '../api/model/buildInfo';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrl: './version.component.css'
})
export class VersionComponent implements OnInit {
  protected buildInfo: BuildInfo | undefined = undefined;
  private readonly apiService: ApiService = inject(ApiService);

  ngOnInit() {
    this.apiService.loadBuildInfo().subscribe(buildInfo => {
      this.buildInfo = buildInfo;
    })
  }
}
