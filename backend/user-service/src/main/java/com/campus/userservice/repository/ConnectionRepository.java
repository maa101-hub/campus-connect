package com.campus.userservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.campus.userservice.entity.Connection;
import com.campus.userservice.entity.ConnectionStatus;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // Check if a connection already exists between two users (in either direction)
    @Query("SELECT c FROM Connection c WHERE " +
           "(c.requesterId = :userId1 AND c.receiverId = :userId2) OR " +
           "(c.requesterId = :userId2 AND c.receiverId = :userId1)")
    Optional<Connection> findConnectionBetween(Long userId1, Long userId2);

    // Get all pending requests received by a user
    List<Connection> findByReceiverIdAndStatus(Long receiverId, ConnectionStatus status);

    // Get all pending requests sent by a user
    List<Connection> findByRequesterIdAndStatus(Long requesterId, ConnectionStatus status);

    // Get all accepted connections for a user (either as requester or receiver)
    @Query("SELECT c FROM Connection c WHERE " +
           "(c.requesterId = :userId OR c.receiverId = :userId) AND c.status = 'ACCEPTED'")
    List<Connection> findAcceptedConnections(Long userId);

    // Count connections for a user
    @Query("SELECT COUNT(c) FROM Connection c WHERE " +
           "(c.requesterId = :userId OR c.receiverId = :userId) AND c.status = 'ACCEPTED'")
    long countAcceptedConnections(Long userId);
}
