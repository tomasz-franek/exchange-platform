import { createFeatureSelector } from '@ngrx/store';
import {Features} from '../../../../../shared-modules/src/lib/features';
export interface ReportState {

}

export const selectReportFutureState = createFeatureSelector<ReportState>(
  Features.reports
);
