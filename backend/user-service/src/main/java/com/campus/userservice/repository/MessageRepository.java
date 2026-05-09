package com.campus.userservice.repository;

import com.campus.userservice.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.senderId = :id1 AND m.recipientId = :id2) OR (m.senderId = :id2 AND m.recipientId = :id1) ORDER BY m.timestamp ASC")
    List<Message> findConversation(Long id1, Long id2);

    @Query("SELECT DISTINCT m.recipientId FROM Message m WHERE m.senderId = :userId UNION SELECT DISTINCT m.senderId FROM Message m WHERE m.recipientId = :userId")
    List<Long> findContactIds(Long userId);
}
