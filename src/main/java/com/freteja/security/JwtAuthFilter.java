package com.freteja.security;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.freteja.model.User;
import com.freteja.repository.UserRepository;
import com.freteja.security.SecurityConfig;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtUtil jwt;
  private final UserRepository users;

  public JwtAuthFilter(JwtUtil jwt, UserRepository users) {
    this.jwt = jwt;
    this.users = users;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {

    String header = req.getHeader(HttpHeaders.AUTHORIZATION);
    if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
      String token = header.substring(7);
      try {
        String email = jwt.getSubject(token);
        User u = users.findByEmail(email).orElse(null);
        if (u != null && u.isAtivo()) {
          var auth = new UsernamePasswordAuthenticationToken(
            email, null, SecurityConfig.SecurityUtils.toAuthorities(u.getPerfis()));
        }
      } catch (Exception ignored) {}
    }
    chain.doFilter(req, res);
  }
}

