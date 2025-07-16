import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { BuildInfo } from '../api/model/buildInfo';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  selectBuildInfo,
  selectSystemMessageList,
  SystemState,
} from '../state/system/system.selectors';
import { SystemMessage } from '../api/model/systemMessage';
import {
  loadBuildInfoAction,
  loadSystemMessageListAction,
} from '../state/system/system.actions';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrl: './version.component.css',
  imports: [TranslatePipe],
  standalone: true,
})
export class VersionComponent implements OnInit {
  buildInfo: BuildInfo | undefined = undefined;
  private readonly apiService: ApiService = inject(ApiService);

  ngOnInit() {
    this.apiService.loadBuildInfo().subscribe((buildInfo) => {
      this.buildInfo = buildInfo;
    });
  }
}
