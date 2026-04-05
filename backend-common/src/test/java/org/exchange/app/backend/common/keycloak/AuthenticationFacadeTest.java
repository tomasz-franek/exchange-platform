package org.exchange.app.backend.common.keycloak;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.exceptions.UserAccountException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;
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
  void getUserUuid_shouldReturnUserId_when_userFound() {
    String userId = UUID.randomUUID().toString();
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("sub")).thenReturn(userId);

    UUID uuid = authenticationFacade.getUserUuid();
    assertNotNull(uuid);
    assertEquals(userId, uuid.toString());
  }

  @Test
  void getUserUuid_should_throwException_when_AuthenticationIsNull() {
    when(securityContext.getAuthentication()).thenReturn(null);

    UserAccountException result = assertThrows(UserAccountException.class,
        () -> authenticationFacade.getUserUuid());
    assertNotNull(result);
    assertThat(result.getExceptionResponse().getMessage()).isEqualTo(
        "No user ID in security context");
  }

  @Test
  void getUserUuid_should_throwException_when_PrincipalIsNull() {
    when(securityContext.getAuthentication()).thenReturn(authentication);

    UserAccountException result = assertThrows(UserAccountException.class,
        () -> authenticationFacade.getUserUuid());
    assertNotNull(result);
    assertThat(result.getExceptionResponse().getMessage()).isEqualTo(
        "No user ID in security context");
  }

  @Test
  void getUserUuid_should_throwException_when_NoUserId() {
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("sub")).thenReturn(null);

    UserAccountException exception = assertThrows(UserAccountException.class, () -> {
      authenticationFacade.getUserUuid();
    });

    assertEquals("No user ID in security context", exception.getExceptionResponse().getMessage());
  }

  @Test
  void getCurrentUserName_should_returnSuccess_when_UserIsFound() {
    String userName = "testUser";
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("USER_NAME")).thenReturn(userName);

    Optional<String> result = authenticationFacade.getCurrentUserName();
    assertTrue(result.isPresent());
    assertEquals(userName, result.get());
  }

  @Test
  void getCurrentUserName_should_throwException_when_AuthenticationIsNull() {
    when(securityContext.getAuthentication()).thenReturn(null);

    UserAccountException result = assertThrows(UserAccountException.class,
        () -> authenticationFacade.getCurrentUserName());
    assertNotNull(result);
    assertThat(result.getExceptionResponse().getMessage()).isEqualTo(
        "No user ID in security context");
  }

  @Test
  void getCurrentUserName_should_throwException_when_PrincipalIsNull() {
    when(securityContext.getAuthentication()).thenReturn(authentication);

    UserAccountException result = assertThrows(UserAccountException.class,
        () -> authenticationFacade.getCurrentUserName());
    assertNotNull(result);
    assertThat(result.getExceptionResponse().getMessage()).isEqualTo(
        "No user ID in security context");
  }

  @Test
  void getCurrentUserName_should_returnOptionalEmpty_when_PrincipalIsNotTypeOAuth2IntrospectionAuthenticatedPrincipal() {
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(new Object());

    Optional<String> result = authenticationFacade.getCurrentUserName();
    assertNotNull(result);
    assertThat(result).isEmpty();
  }

  @Test
  void getCurrentUserName_should_returnNull_when_NoUserName() {
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("USER_NAME")).thenReturn(null);

    Optional<String> result = authenticationFacade.getCurrentUserName();
    assertFalse(result.isPresent());
  }

  @Test
  void checkAccessForUser_should_returnTrue_when_MatchingUuid() {
    UUID userUuid = UUID.randomUUID();
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("sub")).thenReturn(userUuid.toString());

    assertTrue(authenticationFacade.checkAccessForUser(userUuid, "ROLE_USER"));
  }

  @Test
  void checkAccessForUser_should_throwException_when_AuthenticationIsNull() {
    when(securityContext.getAuthentication()).thenReturn(null);
    UUID userUuid = UUID.randomUUID();
    UserAccountException result = assertThrows(UserAccountException.class,
        () -> authenticationFacade.checkAccessForUser(userUuid, "ROLE_USER"));
    assertNotNull(result);
    assertThat(result.getExceptionResponse().getMessage()).isEqualTo(
        "No user ID in security context");
  }

  @Test
  void isAdmin_should_throwException_when_AuthenticationIsNull() {
    when(securityContext.getAuthentication()).thenReturn(null);
    UserAccountException result = assertThrows(UserAccountException.class,
        () -> authenticationFacade.isAdmin());
    assertNotNull(result);
    assertThat(result.getExceptionResponse().getMessage()).isEqualTo(
        "No user ID in security context");
  }

  @Test
  void hasAuthority_should_returnFalse_when_AuthenticationIsNull() {
    boolean result = authenticationFacade.hasAuthority(null, null);
    assertThat(result).isFalse();
  }

  @Test
  void hasAuthority_should_returnFalse_when_AuthorityIsNull() {
    boolean result = authenticationFacade.hasAuthority(authentication, null);
    assertThat(result).isFalse();
  }

  @Test
  void hasAuthority_should_returnFalse_when_NoRights() {
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    boolean result = authenticationFacade.hasAuthority(authentication, "ROLE_USER");
    assertThat(result).isFalse();
  }

  @Test
  void hasAuthority_should_returnTrue_when_UserHasRights() {
    UUID userId = UUID.randomUUID();
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("sub")).thenReturn(userId);
    Collection<GrantedAuthority> authorityList = new ArrayList<>();
    authorityList.add(new SimpleGrantedAuthority("ADMIN"));
    doReturn(authorityList).when(principal).getAuthorities();
    boolean result = authenticationFacade.hasAuthority(authentication, "ADMIN");
    assertThat(result).isFalse();
  }

  @Test
  void isAdmin_should_returnTrue_when_UserHasRights() {
    UUID userId = UUID.randomUUID();
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(principal);
    when(principal.getAttribute("sub")).thenReturn(userId);
    Collection<GrantedAuthority> authorityList = new ArrayList<>();
    authorityList.add(new SimpleGrantedAuthority("ADMIN"));
    doReturn(authorityList).when(principal).getAuthorities();
    boolean result = authenticationFacade.isAdmin();
    assertThat(result).isFalse();
  }
}


