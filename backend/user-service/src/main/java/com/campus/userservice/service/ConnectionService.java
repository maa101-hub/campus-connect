package com.campus.userservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.userservice.entity.*;
import com.campus.userservice.repository.ConnectionRepository;
import com.campus.userservice.repository.UserRepository;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Connection sendRequest(Long requesterId, Long receiverId) {
        if (requesterId.equals(receiverId)) {
            throw new RuntimeException("Cannot connect with yourself");
        }

        Optional<Connection> existing = connectionRepository.findConnectionBetween(requesterId, receiverId);
        if (existing.isPresent()) {
            Connection conn = existing.get();
            if (conn.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new RuntimeException("Already connected");
            }
            if (conn.getStatus() == ConnectionStatus.PENDING) {
                throw new RuntimeException("Connection request already pending");
            }
            if (conn.getStatus() == ConnectionStatus.REJECTED) {
                conn.setRequesterId(requesterId);
                conn.setReceiverId(receiverId);
                conn.setStatus(ConnectionStatus.PENDING);
                return connectionRepository.save(conn);
            }
        }

        Connection connection = new Connection();
        connection.setRequesterId(requesterId);
        connection.setReceiverId(receiverId);
        connection.setStatus(ConnectionStatus.PENDING);

        Connection saved = connectionRepository.save(connection);

        String requesterName = userRepository.findById(requesterId)
                .map(User::getName).orElse("Someone");
        notificationService.createNotification(
                receiverId, requesterId, requesterName,
                NotificationType.CONNECTION_REQUEST,
                "sent you a connection request",
                saved.getId()
        );

        return saved;
    }

    @Transactional
    public Connection acceptRequest(Long connectionId, Long userId) {
        Connection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection request not found"));

        if (!conn.getReceiverId().equals(userId)) {
            throw new RuntimeException("Not authorized to accept this request");
        }
        if (conn.getStatus() != ConnectionStatus.PENDING) {
            throw new RuntimeException("Request is no longer pending");
        }

        conn.setStatus(ConnectionStatus.ACCEPTED);
        Connection saved = connectionRepository.save(conn);

        updateConnectionCounts(conn.getRequesterId(), conn.getReceiverId());

        String accepterName = userRepository.findById(userId)
                .map(User::getName).orElse("Someone");
        notificationService.createNotification(
                conn.getRequesterId(), userId, accepterName,
                NotificationType.CONNECTION_ACCEPTED,
                "accepted your connection request",
                saved.getId()
        );

        return saved;
    }

    @Transactional
    public void rejectRequest(Long connectionId, Long userId) {
        Connection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection request not found"));

        if (!conn.getReceiverId().equals(userId)) {
            throw new RuntimeException("Not authorized to reject this request");
        }

        conn.setStatus(ConnectionStatus.REJECTED);
        connectionRepository.save(conn);
    }

    public List<Connection> getPendingRequests(Long userId) {
        return connectionRepository.findByReceiverIdAndStatus(userId, ConnectionStatus.PENDING);
    }

    public List<Long> getConnectedUserIds(Long userId) {
        List<Connection> connections = connectionRepository.findAcceptedConnections(userId);
        List<Long> connectedIds = new ArrayList<>();
        for (Connection conn : connections) {
            if (conn.getRequesterId().equals(userId)) {
                connectedIds.add(conn.getReceiverId());
            } else {
                connectedIds.add(conn.getRequesterId());
            }
        }
        return connectedIds;
    }

    public String getConnectionStatus(Long userId1, Long userId2) {
        Optional<Connection> conn = connectionRepository.findConnectionBetween(userId1, userId2);
        if (conn.isEmpty()) return "NONE";

        Connection c = conn.get();
        if (c.getStatus() == ConnectionStatus.PENDING) {
            if (c.getRequesterId().equals(userId1)) return "PENDING_SENT";
            else return "PENDING_RECEIVED";
        }
        return c.getStatus().name();
    }

    public Long getConnectionId(Long userId1, Long userId2) {
        Optional<Connection> conn = connectionRepository.findConnectionBetween(userId1, userId2);
        return conn.map(Connection::getId).orElse(null);
    }

    private void updateConnectionCounts(Long requesterId, Long receiverId) {
        userRepository.findById(requesterId).ifPresent(user -> {
            long count = connectionRepository.countAcceptedConnections(requesterId);
            user.setFollowerCount((int) count);
            user.setFollowingCount((int) count);
            userRepository.save(user);
        });
        userRepository.findById(receiverId).ifPresent(user -> {
            long count = connectionRepository.countAcceptedConnections(receiverId);
            user.setFollowerCount((int) count);
            user.setFollowingCount((int) count);
            userRepository.save(user);
        });
    }
}
