package com.campus.postservice.service;

import com.campus.postservice.dto.CollabRequest;
import com.campus.postservice.entity.CollaborationOpportunity;
import com.campus.postservice.repo.CollaborationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollaborationServiceImpl implements CollaborationService {

    @Autowired
    private CollaborationRepository collabRepository;

    @Override
    public CollaborationOpportunity createOpportunity(CollabRequest request) {
        CollaborationOpportunity opp = CollaborationOpportunity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .role(request.getRole())
                .category(request.getCategory())
                .tags(request.getTags())
                .difficultyLevel(request.getDifficultyLevel())
                .authorId(request.getAuthorId())
                .authorName(request.getAuthorName())
                .build();
        return collabRepository.save(opp);
    }

    @Override
    public Page<CollaborationOpportunity> getAllOpportunities(Pageable pageable) {
        return collabRepository.findAll(pageable);
    }

    @Override
    public Page<CollaborationOpportunity> getByCategory(String category, Pageable pageable) {
        if ("all".equalsIgnoreCase(category)) {
            return collabRepository.findAll(pageable);
        }
        return collabRepository.findByCategory(category, pageable);
    }

    @Override
    public List<CollaborationOpportunity> getMyOpportunities(Long authorId) {
        return collabRepository.findByAuthorId(authorId);
    }

    @Override
    public void deleteOpportunity(Long id) {
        collabRepository.deleteById(id);
    }

    @Override
    public void incrementApplicants(Long id) {
        CollaborationOpportunity opp = collabRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        opp.setApplicantsCount(opp.getApplicantsCount() + 1);
        collabRepository.save(opp);
    }
}
