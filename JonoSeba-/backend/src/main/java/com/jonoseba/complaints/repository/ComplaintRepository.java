package com.jonoseba.complaints.repository;

import com.jonoseba.complaints.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
    List<Complaint> findByCitizenId(Long citizenId);
    
    List<Complaint> findByAssignedWorkerId(Long workerId);
    
    List<Complaint> findByStatus(Complaint.ComplaintStatus status);
}
