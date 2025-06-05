package org.exchange.app.backend.common.keycloak;


import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.server.resource.introspection.SpringOpaqueTokenIntrospector;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@ConditionalOnProperty(name = "exchange-portal.security.keycloak.active", havingValue = "true")
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class KeycloakConfiguration {

  @Value("${exchange-portal.allowed-origins}")
  private List<String> allowedOrigins;

  @Bean
  public SpringOpaqueTokenIntrospector customOpaqueTokenIntrospector(
      KeycloakProperties keycloakProperties) {
    return KeycloakOpaqueTokenIntrospector.withIntrospectionUri(
            keycloakProperties.getIntrospectionUri()).clientId(keycloakProperties.getClientId())
        .clientSecret(keycloakProperties.getClientSecret()).build();
  }

  @Bean

  public SecurityFilterChain filterChain(HttpSecurity http,
      KeycloakOpaqueTokenIntrospector introspector) throws Exception {
    http.cors().and()
        .authorizeRequests(authz -> authz
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
            .anyRequest().authenticated()
        ).oauth2ResourceServer(oauth2 ->
            oauth2.opaqueToken(configurer -> configurer.introspector(introspector))
                .authenticationEntryPoint(customAuthenticationEntryPoint())
        );
    return http.build();
  }

  @Bean
  public AuthenticationEntryPoint customAuthenticationEntryPoint() {
    return new KeycloakOAuth2AuthenticationEntryPoint();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(allowedOrigins);
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(
        List.of("authorization", "content-type", "x-auth-token"));
    configuration.setExposedHeaders(List.of("x-auth-token"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
