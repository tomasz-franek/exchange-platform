import {selectUsersStatisticResponse, StatisticState} from "./statistic.selectors";
import {UsersStatisticResponse} from "../../api/model/usersStatisticResponse";

describe('Report Selectors', () => {
  const mockState: StatisticState = {
    usersStatisticResponse: {
      all: 4, active: 43, blocked: 41
    } as UsersStatisticResponse
  };
  it('should select the accounts report response', () => {
    const result = selectUsersStatisticResponse.projector(mockState);
    expect(result).toEqual(mockState.usersStatisticResponse);
  });
});
