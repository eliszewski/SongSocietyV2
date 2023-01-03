package com.songsociety.repository;

import com.songsociety.domain.Poster;
import com.songsociety.domain.User;
import com.songsociety.service.dto.PosterDTO;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Poster entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PosterRepository extends JpaRepository<Poster, Long> {
    Optional<PosterDTO> findOneByUser(User user);
}
