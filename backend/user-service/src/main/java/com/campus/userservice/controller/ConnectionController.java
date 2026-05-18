package com.campus.userservice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.campus.userservice.entity.Connection;
import com.campus.userservice.response.ApiResponse;
import com.campus.userservice.service.ConnectionService;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    /**
     * POST /api/connections/request
     * Send a connection request.
     * Body: { "requesterId": 1, "receiverId": 2 }
     */
    @PostMapping("/request")
    public ApiResponse<Connection> sendRequest(@RequestBody Map<String, Long> body) {
        Long requesterId = body.get("requesterId");
        Long receiverId = body.get("receiverId");

        if (requesterId == null || receiverId == null) {
            return ApiResponse.error(400, "requesterId and receiverId are required", null);
        }

        try {
            Connection conn = connectionService.sendRequest(requesterId, receiverId);
            return ApiResponse.success(conn, "Connection request sent successfully");
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage(), null);
        }
    }

    /**
     * POST /api/connections/{id}/accept?userId={userId}
     * Accept a connection request.
     */
    @PostMapping("/{id}/accept")
    public ApiResponse<Connection> acceptRequest(@PathVariable Long id, @RequestParam Long userId) {
        try {
            Connection conn = connectionService.acceptRequest(id, userId);
            return ApiResponse.success(conn, "Connection accepted");
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage(), null);
        }
    }

    /**
     * POST /api/connections/{id}/reject?userId={userId}
     * Reject a connection request.
     */
    @PostMapping("/{id}/reject")
    public ApiResponse<?> rejectRequest(@PathVariable Long id, @RequestParam Long userId) {
        try {
            connectionService.rejectRequest(id, userId);
            return ApiResponse.success(null, "Connection rejected");
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage(), null);
        }
    }

    /**
     * GET /api/connections/pending?userId={userId}
     * Get pending connection requests for a user.
     */
    @GetMapping("/pending")
    public ApiResponse<List<Connection>> getPendingRequests(@RequestParam Long userId) {
        List<Connection> pending = connectionService.getPendingRequests(userId);
        return ApiResponse.success(pending, "Pending requests fetched");
    }

    /**
     * GET /api/connections/friends?userId={userId}
     * Get connected user IDs.
     */
    @GetMapping("/friends")
    public ApiResponse<List<Long>> getFriends(@RequestParam Long userId) {
        List<Long> friendIds = connectionService.getConnectedUserIds(userId);
        return ApiResponse.success(friendIds, "Friends fetched");
    }

    /**
     * GET /api/connections/status?userId1={userId1}&userId2={userId2}
     * Check connection status between two users.
     */
    @GetMapping("/status")
    public ApiResponse<Map<String, Object>> getStatus(
            @RequestParam Long userId1, @RequestParam Long userId2) {
        String status = connectionService.getConnectionStatus(userId1, userId2);
        Long connectionId = connectionService.getConnectionId(userId1, userId2);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("status", status);
        result.put("connectionId", connectionId);
        return ApiResponse.success(result, "Status fetched");
    }
}
