package org.exchange.app.backend.common.keycloak;


import java.lang.reflect.Type;
import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.exceptions.UnauthorizedAccessException;
import org.exchange.app.backend.common.exceptions.UserAccountException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFacade {

  public UUID getUserUuid() {
    Optional<String> optionalUserId = Optional.empty();
    if (SecurityContextHolder.getContext().getAuthentication()
        .getPrincipal() instanceof OAuth2IntrospectionAuthenticatedPrincipal principal) {
      optionalUserId = Optional.ofNullable(principal.getAttribute("sub"));
    }
    if (optionalUserId.isPresent()) {
      return UUID.fromString(optionalUserId.get());
    } else {
      throw new UserAccountException(AuthenticationFacade.class,
          "No user ID in security context");
    }
  }

  public Optional<String> getCurrentUserName() {
    if (SecurityContextHolder.getContext().getAuthentication()
        .getPrincipal() instanceof OAuth2IntrospectionAuthenticatedPrincipal principal) {
      return Optional.ofNullable(principal.getAttribute("USER_NAME"));
    }
    return Optional.empty();
  }

  public boolean checkAccessForUser(UUID uuid, String role) {
    return getUserUuid().equals(uuid) || hasAuthority(role);
  }

  public boolean isAdmin() {
    return hasAuthority("ADMIN");
  }

  public void checkIsAdmin(Type type) {
    if (isAdmin()) {
      throw new UnauthorizedAccessException(type, "");
    }
  }

  public boolean hasAuthority(String authority) {
    return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
        .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(authority));
  }
}
