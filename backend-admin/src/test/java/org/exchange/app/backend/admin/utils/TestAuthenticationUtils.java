package org.exchange.app.backend.admin.utils;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

public class TestAuthenticationUtils {

  public static SecurityMockMvcRequestPostProcessors.OpaqueTokenRequestPostProcessor authority(
      String authority) {
    return SecurityMockMvcRequestPostProcessors.opaqueToken()
        .authorities(new SimpleGrantedAuthority(authority));
  }
}
