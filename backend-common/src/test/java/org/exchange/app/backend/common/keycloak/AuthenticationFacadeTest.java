package org.exchange.app.backend.common.keycloak;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.exceptions.UserAccountException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

class AuthenticationFacadeTest {

  private AuthenticationFacade authenticationFacade;

  @Mock
  private SecurityContext securityContext;

  @Mock
  private OAuth2IntrospectionAuthenticatedPrincipal principal;

  @Mock
  private Authentication authentication;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    authenticationFacade = new AuthenticationFacade();

    SecurityContextHolder.setContext(securityContext);
  }

  @Test
  void testGetUserUuid_Success() {
    String userId = UUID.randomUUID().toString();
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("sub")).thenReturn(userId);

    UUID uuid = authenticationFacade.getUserUuid();
    assertNotNull(uuid);
    assertEquals(userId, uuid.toString());
  }

  @Test
  void testGetUserUuid_NoUserId() {
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("sub")).thenReturn(null);

    UserAccountException exception = assertThrows(UserAccountException.class, () -> {
      authenticationFacade.getUserUuid();
    });

    assertEquals("No user ID in security context", exception.getExceptionResponse().getMessage());
  }

  @Test
  void testGetCurrentUserName_Success() {
    String userName = "testUser";
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("USER_NAME")).thenReturn(userName);

    Optional<String> result = authenticationFacade.getCurrentUserName();
    assertTrue(result.isPresent());
    assertEquals(userName, result.get());
  }

  @Test
  void testGetCurrentUserName_NoUserName() {
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("USER_NAME")).thenReturn(null);

    Optional<String> result = authenticationFacade.getCurrentUserName();
    assertFalse(result.isPresent());
  }

  @Test
  void testCheckAccessForUser_MatchingUuid() {
    UUID userUuid = UUID.randomUUID();
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("sub")).thenReturn(userUuid.toString());

    assertTrue(authenticationFacade.checkAccessForUser(userUuid, "ROLE_USER"));
  }
}


