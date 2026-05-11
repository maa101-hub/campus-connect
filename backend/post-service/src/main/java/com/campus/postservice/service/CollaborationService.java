package com.campus.postservice.service;

import com.campus.postservice.dto.CollabRequest;
import com.campus.postservice.entity.CollaborationOpportunity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CollaborationService {
    CollaborationOpportunity createOpportunity(CollabRequest request);
    Page<CollaborationOpportunity> getAllOpportunities(Pageable pageable);
    Page<CollaborationOpportunity> getByCategory(String category, Pageable pageable);
    List<CollaborationOpportunity> getMyOpportunities(Long authorId);
    void deleteOpportunity(Long id);
    void incrementApplicants(Long id);
}
