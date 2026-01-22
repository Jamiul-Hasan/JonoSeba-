package com.jonoseba.applications.repository;

import com.jonoseba.applications.model.Application;
import com.jonoseba.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    List<Application> findByCitizen(User citizen);
    
    List<Application> findByCitizenId(Long citizenId);
    
    List<Application> findByStatus(Application.ApplicationStatus status);
}
