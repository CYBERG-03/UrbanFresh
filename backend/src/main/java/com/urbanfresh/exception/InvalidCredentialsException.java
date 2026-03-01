package com.urbanfresh.exception;

/**
 * Exception Layer – Thrown when login credentials are invalid.
 * Handled globally by the exception handler to return a 401 Unauthorized response.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Invalid email or password");
    }
}
