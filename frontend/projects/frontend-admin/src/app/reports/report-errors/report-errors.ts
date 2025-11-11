import {Component, inject, OnInit} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {ReportMenu} from '../report-menu/report-menu';
import {TranslatePipe} from '@ngx-translate/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule,} from '@angular/forms';
import {ReportState, selectErrorMessageList} from '../state/report.selectors';
import {Store} from '@ngrx/store';
import {ErrorMessage} from '../../api/model/errorMessage';
import {deleteErrorAction, loadErrorListAction,} from '../state/report.actions';
import {ErrorListRequest} from '../../api/model/errorListRequest';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-report-errors',
  templateUrl: './report-errors.html',
  styleUrl: './report-errors.scss',
  imports: [MenuComponent, ReportMenu, TranslatePipe, ReactiveFormsModule, TableModule, Button],
})
export class ReportErrors implements OnInit {
  protected readonly formGroup: FormGroup;
  protected errorMessages: ErrorMessage[] = [];
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _storeReports$: Store<ReportState> = inject(Store);

  constructor() {
    this.formGroup = this.formBuilder.group({
      offset: new FormControl(0, []),
    });
  }

  ngOnInit() {
    this.loadErrorList();
  }

  loadErrorList() {
    this._storeReports$
    .select(selectErrorMessageList)
    .subscribe((errorMessages) => {
      this.errorMessages = errorMessages;
    });
    const errorListRequest: ErrorListRequest = {
      offset: this.formGroup.get('offset')?.value,
    };
    this._storeReports$.dispatch(loadErrorListAction({errorListRequest}));
  }

  getErrors(offset: number) {
    let newOffset: number;
    if (offset == 0) {
      newOffset = 0;
    } else {
      newOffset = offset + this.formGroup.get('offset')?.value;
    }
    this.formGroup.patchValue({offset: newOffset});
    this.loadErrorList();
  }

  delete(id: number) {
    this._storeReports$.dispatch(deleteErrorAction({id}));
    this.formGroup.patchValue({offset: 0});
  }

  getDate(timestamp: number | undefined) {
    if (timestamp == undefined) {
      return '';
    } else {
      return new Date(timestamp)
      .toISOString()
      .substring(0, 19)
      .replace('T', ' ');
    }
  }
}
