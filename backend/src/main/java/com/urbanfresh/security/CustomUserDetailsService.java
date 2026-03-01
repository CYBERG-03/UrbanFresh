package com.urbanfresh.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.urbanfresh.model.User;
import com.urbanfresh.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Security Layer – Loads user details from the database for Spring Security.
 * Maps the User entity to a Spring Security UserDetails object.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Load a user by email (used as the "username" in this system).
     *
     * @param email the user's email address
     * @return Spring Security UserDetails with encoded password and role authority
     * @throws UsernameNotFoundException if no user found with the given email
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // Prefix role with ROLE_ for Spring Security authority convention
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
