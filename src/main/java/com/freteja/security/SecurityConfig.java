package com.freteja.security;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

  private final JwtAuthFilter jwtAuthFilter;

  public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
    this.jwtAuthFilter = jwtAuthFilter;
  }

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        // estáticos (se tiver)
        .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()

        // raiz / index, se servir algo pelo backend
        .requestMatchers("/", "/index.html").permitAll()

        // rotas públicas
        .requestMatchers(
          "/auth/**",
          "/cep/**",
          "/swagger-ui.html",
          "/swagger-ui/**",
          "/v3/api-docs",
          "/v3/api-docs/**",
          "/v3/api-docs.yaml",
          "/swagger-resources/**",
          "/webjars/**"
        ).permitAll()

        // 💡 qualquer usuário AUTENTICADO pode acessar /cotacoes/**
        .requestMatchers("/cotacoes/**").authenticated()

        // qualquer outra coisa também exige estar logado
        .anyRequest().authenticated()
      )
      // usa o filtro JWT que a gente arrumou
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  // util para converter Perfil -> ROLE_DEMANDANTE / ROLE_TRANSPORTADORA etc.
  public static class SecurityUtils {
    public static Set<SimpleGrantedAuthority> toAuthorities(Set<com.freteja.model.Perfil> perfis) {
      if (perfis == null) return Set.of();
      return perfis.stream()
          .map(p -> new SimpleGrantedAuthority("ROLE_" + p.name()))
          .collect(Collectors.toSet());
    }
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}