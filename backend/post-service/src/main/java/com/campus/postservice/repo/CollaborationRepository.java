package com.campus.postservice.repo;

import com.campus.postservice.entity.CollaborationOpportunity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationRepository extends JpaRepository<CollaborationOpportunity, Long> {
    
    Page<CollaborationOpportunity> findByCategory(String category, Pageable pageable);
    
    List<CollaborationOpportunity> findByAuthorId(Long authorId);
}
