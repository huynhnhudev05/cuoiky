package com.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ecommerce.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowCredentials(true);
                config.addAllowedOriginPattern("*");
                config.addAllowedHeader("*");
                config.addAllowedMethod("*");
                return config;
            }))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                // PUBLIC
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/categories/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/cart/**").permitAll()
                .requestMatchers("/coupons/**").permitAll()  // Public voucher API
                .requestMatchers("/api/sepay/webhook").permitAll()  // Webhook từ SePay
                .requestMatchers("/api/sepay/webhook/test").permitAll()  // Test webhook endpoint

                // ADMIN ZONE (phải đặt trước /products/**)
                .requestMatchers("/products/admin/**").hasRole("ADMIN")
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")   // ★★★ FIX QUAN TRỌNG

                // PUBLIC PRODUCTS (sau admin)
                .requestMatchers("/products/**").permitAll()

                // ORDER APIs (user + admin)
                .requestMatchers("/api/orders/**")
                    .hasAnyRole("USER", "ADMIN")
                
                // SEPAY APIs (user + admin)
                .requestMatchers("/api/sepay/**")
                    .hasAnyRole("USER", "ADMIN")

                // others
                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
