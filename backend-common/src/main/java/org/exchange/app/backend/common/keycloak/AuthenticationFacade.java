package org.exchange.app.backend.common.keycloak;


import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.exceptions.UserAccountException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationFacade {

  public UUID getUserUuid() {
    Optional<String> optionalUserId = Optional.empty();

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || authentication.getPrincipal() == null) {
      throw new UserAccountException(AuthenticationFacade.class,
          "No user ID in security context");
    }
    if (authentication.getPrincipal() instanceof OAuth2IntrospectionAuthenticatedPrincipal principal) {
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
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || authentication.getPrincipal() == null) {
      throw new UserAccountException(AuthenticationFacade.class,
          "No user ID in security context");
    }
    if (authentication.getPrincipal() instanceof OAuth2IntrospectionAuthenticatedPrincipal principal) {
      return Optional.ofNullable(principal.getAttribute("USER_NAME"));
    }
    return Optional.empty();
  }

  public boolean checkAccessForUser(UUID uuid, String role) {
    Authentication authentication = SecurityContextHolder.getContext()
        .getAuthentication();
    if (authentication == null) {
      throw new UserAccountException(AuthenticationFacade.class,
          "No user ID in security context");
    }
    return getUserUuid().equals(uuid) || hasAuthority(authentication, role);
  }

  public boolean isAdmin() {
    Authentication authentication = SecurityContextHolder.getContext()
        .getAuthentication();
    if (authentication == null) {
      throw new UserAccountException(AuthenticationFacade.class,
          "No user ID in security context");
    }
    return hasAuthority(authentication, "ADMIN");
  }

  public boolean hasAuthority(Authentication authentication, String authority) {
    if (authentication == null || authority == null) {
      return false;
    }
    return authentication.getAuthorities().stream()
        .anyMatch(grantedAuthority -> authority.equals(grantedAuthority.getAuthority()));
  }
}
