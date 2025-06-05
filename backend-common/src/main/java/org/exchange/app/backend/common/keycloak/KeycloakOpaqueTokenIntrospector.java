package org.exchange.app.backend.common.keycloak;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.exceptions.UserAccountException;
import org.exchange.app.common.api.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.SpringOpaqueTokenIntrospector;
import org.springframework.web.client.RestOperations;

@Log4j2
public class KeycloakOpaqueTokenIntrospector extends SpringOpaqueTokenIntrospector {

  public static final String ADMIN = "admin";
  private final KeycloakProperties keycloakProperties;
  

  public KeycloakOpaqueTokenIntrospector(KeycloakProperties keycloakProperties,
      RestOperations restOperations) {
    super(keycloakProperties.getIntrospectionUri(), restOperations);
    this.keycloakProperties = keycloakProperties;
  }

  @Override
  public OAuth2AuthenticatedPrincipal introspect(String token) {
    OAuth2AuthenticatedPrincipal principal = super.introspect(token);
    if (principal == null) {
      throw new UserAccountException(KeycloakOpaqueTokenIntrospector.class, "Invalid token");
    }
    return addAuthorities(principal);
  }

  private OAuth2AuthenticatedPrincipal addAuthorities(OAuth2AuthenticatedPrincipal principal) {
    Collection<GrantedAuthority> authorities = new LinkedList<>(principal.getAuthorities());
    UUID userUUID = UUID.fromString(principal.getName());
    Map<String, Object> attributes = new HashMap<>(principal.getAttributes());
    User user = getOrCreateUser(userUUID, principal);
    if (user.getBlocked() != null && user.getBlocked()) {
      throw new UserAccountException(KeycloakOpaqueTokenIntrospector.class, "User is blocked");
    }
    attributes.put("userName", user.getUserName());
    List<String> tokenRoles = getTokenClientRoles(principal);
    log.info(tokenRoles);
    List<String> permissions = new LinkedList<>();
    addAdminPermissionName(principal, permissions);
    return new OAuth2IntrospectionAuthenticatedPrincipal(
        principal.getName(), attributes, authorities);
  }

  private void addAdminPermissionName(OAuth2AuthenticatedPrincipal principal,
      List<String> permissions) {
    if (principal.getAttribute("REALM_ACCESS")) {
      permissions.add(ADMIN);
    }

  }

  static boolean hasAdminRole(OAuth2AuthenticatedPrincipal principal) {
    Map<String, List> realmAccess = principal.getAttribute("REALM_ACCESS");
    if (realmAccess == null || !realmAccess.containsKey("ROLES")) {
      return false;
    }
    return realmAccess.get("ROLES").contains(ADMIN);
  }


  private boolean isNotAdmin(List<String> permissions) {
    return permissions.stream()
        .noneMatch(permission -> permission.equals(ADMIN));
  }


  private List<String> getTokenClientRoles(OAuth2AuthenticatedPrincipal principal) {
    return Optional.ofNullable(principal.getAttribute("resource_access"))
        .map(v -> ((Map<String, Object>) v).get(keycloakProperties.getPortalClientName()))
        .map(v -> (List<String>) ((Map<String, Object>) v).get("roles"))
        .orElse(Collections.emptyList());
  }

  private User getOrCreateUser(UUID userUUID, OAuth2AuthenticatedPrincipal principal) {
//    try {
//      return userService.findById(userUUID)
//          .orElseGet(() -> {
//            User user = toUser(principal);
//            return userService.createUser(userUUID, user);
//          });
//    } catch (DataIntegrityViolationException e) {
//      return userService.findById(userUUID).orElseThrow(() -> e);
//    }
    return new User();
  }

  private User toUser(OAuth2AuthenticatedPrincipal principal) {
    User user = new User();
    user.setUserName(principal.getAttribute("username"));
    user.setName(principal.getAttribute("firstName"));
    user.setLastName(principal.getAttribute("lastName"));
    user.setEmail(principal.getAttribute("email"));
    return user;
  }

}
