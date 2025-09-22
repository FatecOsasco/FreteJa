package com.freteja.security;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.freteja.repository.UserRepository;

@Configuration
public class SecurityConfig {

  @Bean
  BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
    return cfg.getAuthenticationManager();
  }

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http, JwtUtil jwt, UserRepository users) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
          .requestMatchers(
              "/auth/**",
              "/swagger-ui.html",
              "/swagger-ui/**",
              "/v3/api-docs/**"
          ).permitAll()
          .anyRequest().authenticated())
        .addFilterBefore(new JwtAuthFilter(jwt, users), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
        .httpBasic(Customizer.withDefaults());
    return http.build();
  }

  // util
  public static class SecurityUtils {
    public static Set<SimpleGrantedAuthority> toAuthorities(Set<com.freteja.model.Perfil> perfis) {
      return perfis.stream().map(p -> new SimpleGrantedAuthority("ROLE_" + p.name()))
          .collect(Collectors.toSet());
    }
  }
}

