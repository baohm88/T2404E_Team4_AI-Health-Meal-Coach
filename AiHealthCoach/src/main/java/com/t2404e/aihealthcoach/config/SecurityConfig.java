package com.t2404e.aihealthcoach.config;

//import com.t2404e.aihealthcoach.config.CustomAccessDeniedHandler;
//import com.t2404e.aihealthcoach.config.CustomAuthenticationEntryPoint;
//import com.t2404e.aihealthcoach.config.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private static final String[] SWAGGER_WHITELIST = {
                        "/swagger-ui.html",
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/v3/api-docs.yaml"
        };

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CustomAuthenticationEntryPoint authenticationEntryPoint;
        private final CustomAccessDeniedHandler accessDeniedHandler;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                        CustomAuthenticationEntryPoint authenticationEntryPoint,
                        CustomAccessDeniedHandler accessDeniedHandler) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.authenticationEntryPoint = authenticationEntryPoint;
                this.accessDeniedHandler = accessDeniedHandler;
        }

        /**
         * Main Security Filter Chain
         */
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                // Disable CSRF (REST API + JWT)
                                .csrf(csrf -> csrf.disable())

                                // Enable CORS with custom configuration
                                .cors(Customizer.withDefaults())

                                // Exception handling
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint(authenticationEntryPoint)
                                                .accessDeniedHandler(accessDeniedHandler))

                                // Authorization rules
                                .authorizeHttpRequests(auth -> auth
                                                // Cho phép OPTIONS (Preflight request) đi qua mà không cần token - ƯU
                                                // TIÊN
                                                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**")
                                                .permitAll()
                                                .requestMatchers(SWAGGER_WHITELIST).permitAll()
                                                .requestMatchers("/auth/**").permitAll()
                                                .requestMatchers("/ai/**").permitAll()
                                                .requestMatchers("/payment/**").permitAll() // Cho phép tạo link và
                                                                                            // callback
                                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                                .anyRequest().authenticated())

                                // Disable default auth mechanisms
                                .httpBasic(basic -> basic.disable())
                                .formLogin(form -> form.disable())

                                // JWT filter
                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        /**
         * CORS Configuration for Spring Security
         */
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration config = new CorsConfiguration();

                // Frontend origin (Next.js) - Sử dụng pattern để chấp nhận localhost và
                // 127.0.0.1
                config.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));

                // Allowed HTTP methods - Bao gồm PATCH
                config.setAllowedMethods(List.of(
                                "GET",
                                "POST",
                                "PUT",
                                "PATCH",
                                "DELETE",
                                "OPTIONS"));

                // Allowed headers
                config.setAllowedHeaders(List.of("*"));

                // Allow cookies / Authorization header
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", config);

                return source;
        }
}
