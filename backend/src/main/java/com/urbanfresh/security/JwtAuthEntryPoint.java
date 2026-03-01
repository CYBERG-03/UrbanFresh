package com.urbanfresh.security;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Security Layer – Custom entry point for unauthenticated requests.
 * Returns a consistent JSON 401 response (matching ApiErrorResponse format)
 * instead of Spring Security's default HTML "Unauthorized" page.
 * Triggered when a request reaches a protected endpoint without a valid JWT.
 */
@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    /**
     * Write a 401 JSON body when an unauthenticated request hits a secured endpoint.
     * The frontend Axios interceptor reads this status to trigger session expiry.
     */
    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        // Build JSON manually to avoid hard dependency on ObjectMapper import
        String json = String.format(
                "{\"status\":401,\"message\":\"Session expired or invalid token. Please log in again.\",\"timestamp\":\"%s\"}",
                LocalDateTime.now()
        );
        response.getWriter().write(json);
    }
}
