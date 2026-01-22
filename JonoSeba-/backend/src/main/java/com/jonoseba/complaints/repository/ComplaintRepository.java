package com.jonoseba.complaints.repository;

import com.jonoseba.complaints.model.Complaint;
import com.jonoseba.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
    List<Complaint> findByCitizen(User citizen);
    
    List<Complaint> findByCitizenId(Long citizenId);
    
    List<Complaint> findByAssignedTo(User assignedTo);
    
    List<Complaint> findByAssignedToId(Long assignedToId);
    
    List<Complaint> findByStatus(Complaint.ComplaintStatus status);
    
    List<Complaint> findByCategory(String category);
}
