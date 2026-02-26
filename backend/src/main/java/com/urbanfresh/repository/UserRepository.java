package com.urbanfresh.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.urbanfresh.model.User;

/**
 * Repository Layer – Data access for User entities.
 * Spring Data JPA auto-implements standard CRUD + custom queries.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Find a user by email (used for login and duplicate checks). */
    Optional<User> findByEmail(String email);

    /** Check if an email is already registered. */
    boolean existsByEmail(String email);
}
