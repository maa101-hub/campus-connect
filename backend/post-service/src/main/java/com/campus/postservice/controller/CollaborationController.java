package com.campus.postservice.controller;

import com.campus.postservice.dto.CollabRequest;
import com.campus.postservice.entity.CollaborationOpportunity;
import com.campus.postservice.response.ApiResponse;
import com.campus.postservice.service.CollaborationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/collab")
public class CollaborationController {

    @Autowired
    private CollaborationService collabService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createOpportunity(@RequestBody CollabRequest request) {
        CollaborationOpportunity opp = collabService.createOpportunity(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(opp, "Collaboration opportunity created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getOpportunities(
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CollaborationOpportunity> opps = collabService.getByCategory(category, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(opps, "Opportunities fetched successfully"));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<ApiResponse<?>> apply(@PathVariable Long id) {
        collabService.incrementApplicants(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Applied successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> delete(@PathVariable Long id) {
        collabService.deleteOpportunity(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Deleted successfully"));
    }
}
