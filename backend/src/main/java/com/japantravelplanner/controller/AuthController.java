package com.japantravelplanner.controller;

import com.japantravelplanner.dto.LoginRequest;
import com.japantravelplanner.dto.RegisterRequest;
import com.japantravelplanner.model.User;
import com.japantravelplanner.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {

        User user = userService.registerUser(registerRequest.getUsername(),  registerRequest.getPassword());

        Map<String, String> response = Map.of(
                "message", "User registered successfully.",
                "username", user.getUsername()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        SecurityContext securityContext =
                SecurityContextHolder.createEmptyContext();

        securityContext.setAuthentication(authentication);

        SecurityContextHolder.setContext(securityContext);

        HttpSession session = httpRequest.getSession(true);

        session.setAttribute(
                "SPRING_SECURITY_CONTEXT",
                securityContext
        );

        Map<String, String> response = Map.of(
                "message", "Login successful.",
                "username", authentication.getName()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {

        new SecurityContextLogoutHandler()
                .logout(request, response, authentication);

        return ResponseEntity.ok(
                Map.of("message", "Logout successful.")
        );
    }

}
