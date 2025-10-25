package com.freteja.web;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
      .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage, (a,b)->a));
    return ResponseEntity.badRequest().body(Map.of(
      "timestamp", Instant.now().toString(),
      "status", 400,
      "error", "Validation error",
      "fields", errors
    ));
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<?> handleRuntime(RuntimeException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
      "timestamp", Instant.now().toString(),
      "status", 400,
      "error", ex.getMessage()
    ));
  }
}
