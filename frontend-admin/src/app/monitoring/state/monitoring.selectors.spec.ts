import {
  MonitoringState,
  selectAdminHealthCheck,
  selectExternalHealthCheck,
  selectInternalHealthCheck
} from "./monitoring.selectors";

describe('Monitoring Selectors', () => {
  const mockState: MonitoringState = {
    adminHealthCheck: {status: 'OK'},
    externalHealthCheck: {status: 'OK'},
    internalHealthCheck: {status: 'OK'}
  };
  it('should select the Admin Health Check', () => {
    const result = selectAdminHealthCheck.projector(mockState);
    expect(result).toEqual(mockState.adminHealthCheck);
  });

  it('should select the Internal Health Check', () => {
    const result = selectInternalHealthCheck.projector(mockState);
    expect(result).toEqual(mockState.internalHealthCheck);
  });

  it('should select the External Health Check', () => {
    const result = selectExternalHealthCheck.projector(mockState);
    expect(result).toEqual(mockState.externalHealthCheck);
  });
});
