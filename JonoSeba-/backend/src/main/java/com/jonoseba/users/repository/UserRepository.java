package com.jonoseba.users.repository;

import com.jonoseba.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndActiveTrue(String email);
    
    boolean existsByEmail(String email);
    
    long countByRole(User.UserRole role);

    List<User> findByRole(User.UserRole role);
}
