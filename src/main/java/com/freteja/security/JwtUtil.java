package com.freteja.security;

import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
  @Value("${app.jwt.secret}")
  private String secret;

  @Value("${app.jwt.expiration}")
  private long expirationMs;

  public String generate(String subject, Map<String, Object> claims) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + expirationMs);
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)
        .setIssuedAt(now)
        .setExpiration(exp)
        .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
        .compact();
  }

  public String getSubject(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }
}

