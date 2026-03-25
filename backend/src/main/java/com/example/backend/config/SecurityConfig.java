package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // REST APIやH2アクセスではCSRF無効化
            .csrf(csrf -> csrf.disable())

            // パスごとのアクセス制御
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll()   // H2 Console 許可
                .requestMatchers("/api/auth/**").permitAll()     // ログイン・登録許可
                .anyRequest().authenticated()
            )

            // H2 Console の iframe 表示を許可
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))

            // JWT 前提のステートレス
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // JWTフィルターを UsernamePasswordAuthenticationFilter の前に追加
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}