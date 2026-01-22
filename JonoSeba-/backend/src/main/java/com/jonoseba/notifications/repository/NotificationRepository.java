package com.jonoseba.notifications.repository;

import com.jonoseba.notifications.model.Notification;
import com.jonoseba.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUser(User user);
    
    List<Notification> findByUserId(Long userId);
    
    List<Notification> findByUserAndReadFlagFalse(User user);
    
    List<Notification> findByUserIdAndReadFlagFalse(Long userId);
    
    List<Notification> findByType(String type);
}
