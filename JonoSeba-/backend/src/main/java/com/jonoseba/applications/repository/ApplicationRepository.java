package com.jonoseba.applications.repository;

import com.jonoseba.applications.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    List<Application> findByUserId(Long userId);
    
    List<Application> findByStatus(Application.ApplicationStatus status);
}
