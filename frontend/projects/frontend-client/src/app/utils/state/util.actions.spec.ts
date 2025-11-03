import {loadBuildInfoAction, loadBuildInfoFailure, loadBuildInfoSuccess} from "./util.actions";
import {HttpErrorResponse} from '@angular/common/http';
import {BuildInfo} from '../../api/model/buildInfo';

describe('Util Actions', () => {
  describe('loadTransactionListAction', () => {
    it('should create an action to load build info', () => {
      const action = loadBuildInfoAction();
      expect(action.type).toBe('[Util] Load BuildInfo Action');
    });
  });

  describe('loadTransactionListSuccess', () => {
    it('should create an action to load build info', () => {
      const buildInfo: BuildInfo = {}
      const action = loadBuildInfoSuccess({buildInfo});
      expect(action.type).toBe('[Util] Load BuildInfo Success');
      expect(action.buildInfo).toEqual(buildInfo);
    });
  });

  describe('loadTransactionListFailure', () => {
    it('should create an action for failed loading of build info', () => {
      const errorResponse = new HttpErrorResponse({error: 'Error message', status: 404});
      const action = loadBuildInfoFailure({errorResponse});
      expect(action.type).toBe('[Util] Load BuildInfo Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });
});
