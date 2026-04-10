package com.bnr.bondpurchase.repository;

import com.bnr.bondpurchase.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {    // JPA  writes the query for this based on the method name
    Optional<User> findByEmail(String email);
}