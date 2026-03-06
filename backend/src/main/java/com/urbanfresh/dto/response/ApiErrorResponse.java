package com.urbanfresh.dto.response;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO Layer – Standard error response returned by the global exception handler.
 * Provides a consistent error structure across all API endpoints.
 */
@Getter
@Setter
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    private int status;
    private String message;

    /** Field-level validation errors (populated for @Valid failures). */
    private Map<String, String> errors;

    private LocalDateTime timestamp;
}
