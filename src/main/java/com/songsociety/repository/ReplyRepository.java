package com.songsociety.repository;

import com.songsociety.domain.Reply;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Reply entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {}
