package com.songsociety.repository;

import com.songsociety.domain.Poster;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Poster entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PosterRepository extends JpaRepository<Poster, Long> {}
