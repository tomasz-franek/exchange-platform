import { createReducer } from '@ngrx/store';
import { ReportState } from './report.selectors';

export const initialReportState: ReportState = {};

export const reportsReducers = createReducer(
  initialReportState
);
