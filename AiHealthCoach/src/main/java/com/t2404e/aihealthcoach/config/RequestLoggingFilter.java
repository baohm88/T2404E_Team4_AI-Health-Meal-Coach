package com.t2404e.aihealthcoach.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.stream.Collectors;

/**
 * Request Logging Filter
 * 
 * Logs all incoming HTTP requests and outgoing responses.
 * Helpful for debugging frontend-backend communication.
 * 
 * Log format:
 *   ➡️ [REQUEST] POST /api/auth/login (from 127.0.0.1)
 *   ⬅️ [RESPONSE] POST /api/auth/login → 200 OK (45ms)
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        // Skip logging for static resources and health checks
        String path = request.getRequestURI();
        if (shouldSkip(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Wrap request and response to cache body for logging
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String clientIp = getClientIp(request);
        String queryString = request.getQueryString();
        String fullPath = queryString != null ? path + "?" + queryString : path;

        // Log incoming request
        log.info("➡️ [REQUEST] {} {} (from {})", method, fullPath, clientIp);
        
        // Log headers if debug enabled
        if (log.isDebugEnabled()) {
            logHeaders(request);
        }

        try {
            // Process the request
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            // Calculate duration
            long duration = System.currentTimeMillis() - startTime;
            int status = wrappedResponse.getStatus();
            String statusText = getStatusText(status);

            // Log response
            if (status >= 400) {
                log.warn("⬅️ [RESPONSE] {} {} → {} {} ({}ms)", method, path, status, statusText, duration);
                
                // Log error response body
                String responseBody = getResponseBody(wrappedResponse);
                if (!responseBody.isEmpty()) {
                    log.warn("   Response body: {}", truncate(responseBody, 500));
                }
            } else {
                log.info("⬅️ [RESPONSE] {} {} → {} {} ({}ms)", method, path, status, statusText, duration);
            }

            // Copy body to response (IMPORTANT - otherwise response will be empty!)
            wrappedResponse.copyBodyToResponse();
        }
    }

    /**
     * Skip logging for static resources
     */
    private boolean shouldSkip(String path) {
        return path.startsWith("/favicon") ||
               path.startsWith("/static") ||
               path.startsWith("/actuator") ||
               path.startsWith("/swagger") ||
               path.startsWith("/v3/api-docs") ||
               path.endsWith(".js") ||
               path.endsWith(".css") ||
               path.endsWith(".ico");
    }

    /**
     * Get client IP address (handles proxy)
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Log request headers (debug mode only)
     */
    private void logHeaders(HttpServletRequest request) {
        String headers = Collections.list(request.getHeaderNames())
                .stream()
                .filter(name -> !name.equalsIgnoreCase("Authorization")) // Don't log auth header
                .map(name -> name + ": " + request.getHeader(name))
                .collect(Collectors.joining(", "));
        log.debug("   Headers: {}", headers);
    }

    /**
     * Get response body as string
     */
    private String getResponseBody(ContentCachingResponseWrapper response) {
        byte[] content = response.getContentAsByteArray();
        if (content.length > 0) {
            return new String(content, StandardCharsets.UTF_8);
        }
        return "";
    }

    /**
     * Truncate long strings
     */
    private String truncate(String text, int maxLength) {
        if (text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "... (truncated)";
    }

    /**
     * Get human-readable status text
     */
    private String getStatusText(int status) {
        return switch (status) {
            case 200 -> "OK";
            case 201 -> "Created";
            case 204 -> "No Content";
            case 400 -> "Bad Request";
            case 401 -> "Unauthorized";
            case 403 -> "Forbidden";
            case 404 -> "Not Found";
            case 409 -> "Conflict";
            case 500 -> "Internal Server Error";
            default -> "";
        };
    }
}
