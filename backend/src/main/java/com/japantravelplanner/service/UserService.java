package com.japantravelplanner.service;

import com.japantravelplanner.model.User;
import com.japantravelplanner.repository.UserRepository;
import com.japantravelplanner.repository.TripItemRepository;
import com.japantravelplanner.repository.TripRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TripRepository tripRepository;
    private final TripItemRepository tripItemRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            TripRepository tripRepository,
            TripItemRepository tripItemRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tripRepository = tripRepository;
        this.tripItemRepository = tripItemRepository;
    }

    public User registerUser(String username, String password) {

        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username is already in use.");
        }

        String passwordHash = passwordEncoder.encode(password);
        User user = new User(username, passwordHash);

        return userRepository.save(user);

    }

    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = getVerifiedUser(username, currentPassword);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(String username, String currentPassword) {
        User user = getVerifiedUser(username, currentPassword);

        tripItemRepository.deleteByTrip_User_Username(username);
        tripRepository.deleteByUser_Username(username);
        userRepository.delete(user);
    }

    private User getVerifiedUser(String username, String currentPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User account could not be found."));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }

        return user;
    }

}
