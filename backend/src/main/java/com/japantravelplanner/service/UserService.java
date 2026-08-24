package com.japantravelplanner.service;

import com.japantravelplanner.model.User;
import com.japantravelplanner.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String username, String password) {

        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username is already in use.");
        }

        String passwordHash = passwordEncoder.encode(password);
        User user = new User(username, passwordHash);

        return userRepository.save(user);

    }

}
