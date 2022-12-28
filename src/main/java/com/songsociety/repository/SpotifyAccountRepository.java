package com.songsociety.repository;

import com.songsociety.domain.SpotifyAccount;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SpotifyAccount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SpotifyAccountRepository extends JpaRepository<SpotifyAccount, Long> {}
