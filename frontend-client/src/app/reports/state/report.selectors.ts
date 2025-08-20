import { createFeatureSelector } from '@ngrx/store';
import { Features } from '../../features';

export interface ReportState {

}

export const selectReportFutureState = createFeatureSelector<ReportState>(
  Features.reports
);
