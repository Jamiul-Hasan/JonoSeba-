package com.jonoseba.complaints.repository;

import com.jonoseba.complaints.model.Complaint;
import com.jonoseba.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
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
    
    long countByCitizen(User citizen);
    
    long countByCitizenAndStatus(User citizen, Complaint.ComplaintStatus status);
    
    long countByStatus(Complaint.ComplaintStatus status);
    
    long countByAssignedTo(User assignedTo);
    
    long countByAssignedToAndStatus(User assignedTo, Complaint.ComplaintStatus status);
    
    List<Complaint> findByAssignedToOrderByCreatedAtDesc(User assignedTo, Pageable pageable);

    List<Complaint> findByStatusAndAssignedToIsNull(Complaint.ComplaintStatus status);
}
