import { KeycloakEvent, KeycloakEventType } from 'keycloak-angular';

export const MOCK_KEYCLOAK_EVENT_SIGNAL = (): KeycloakEvent => {
  return {
    type: KeycloakEventType.AuthSuccess,
    args: { isTrusted: true },
  } as KeycloakEvent;
};
