package com.songsociety.service;

import com.songsociety.domain.SpotifyAccount;
import com.songsociety.repository.SpotifyAccountRepository;
import com.songsociety.service.dto.SpotifyAccountDTO;
import com.songsociety.service.mapper.SpotifyAccountMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SpotifyAccount}.
 */
@Service
@Transactional
public class SpotifyAccountService {

    private final Logger log = LoggerFactory.getLogger(SpotifyAccountService.class);

    private final SpotifyAccountRepository spotifyAccountRepository;

    private final SpotifyAccountMapper spotifyAccountMapper;

    public SpotifyAccountService(SpotifyAccountRepository spotifyAccountRepository, SpotifyAccountMapper spotifyAccountMapper) {
        this.spotifyAccountRepository = spotifyAccountRepository;
        this.spotifyAccountMapper = spotifyAccountMapper;
    }

    /**
     * Save a spotifyAccount.
     *
     * @param spotifyAccountDTO the entity to save.
     * @return the persisted entity.
     */
    public SpotifyAccountDTO save(SpotifyAccountDTO spotifyAccountDTO) {
        log.debug("Request to save SpotifyAccount : {}", spotifyAccountDTO);
        SpotifyAccount spotifyAccount = spotifyAccountMapper.toEntity(spotifyAccountDTO);
        spotifyAccount = spotifyAccountRepository.save(spotifyAccount);
        return spotifyAccountMapper.toDto(spotifyAccount);
    }

    /**
     * Update a spotifyAccount.
     *
     * @param spotifyAccountDTO the entity to save.
     * @return the persisted entity.
     */
    public SpotifyAccountDTO update(SpotifyAccountDTO spotifyAccountDTO) {
        log.debug("Request to update SpotifyAccount : {}", spotifyAccountDTO);
        SpotifyAccount spotifyAccount = spotifyAccountMapper.toEntity(spotifyAccountDTO);
        spotifyAccount = spotifyAccountRepository.save(spotifyAccount);
        return spotifyAccountMapper.toDto(spotifyAccount);
    }

    /**
     * Partially update a spotifyAccount.
     *
     * @param spotifyAccountDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<SpotifyAccountDTO> partialUpdate(SpotifyAccountDTO spotifyAccountDTO) {
        log.debug("Request to partially update SpotifyAccount : {}", spotifyAccountDTO);

        return spotifyAccountRepository
            .findById(spotifyAccountDTO.getId())
            .map(existingSpotifyAccount -> {
                spotifyAccountMapper.partialUpdate(existingSpotifyAccount, spotifyAccountDTO);

                return existingSpotifyAccount;
            })
            .map(spotifyAccountRepository::save)
            .map(spotifyAccountMapper::toDto);
    }

    /**
     * Get all the spotifyAccounts.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<SpotifyAccountDTO> findAll() {
        log.debug("Request to get all SpotifyAccounts");
        return spotifyAccountRepository
            .findAll()
            .stream()
            .map(spotifyAccountMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the spotifyAccounts where Poster is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<SpotifyAccountDTO> findAllWherePosterIsNull() {
        log.debug("Request to get all spotifyAccounts where Poster is null");
        return StreamSupport
            .stream(spotifyAccountRepository.findAll().spliterator(), false)
            .filter(spotifyAccount -> spotifyAccount.getPoster() == null)
            .map(spotifyAccountMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one spotifyAccount by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<SpotifyAccountDTO> findOne(Long id) {
        log.debug("Request to get SpotifyAccount : {}", id);
        return spotifyAccountRepository.findById(id).map(spotifyAccountMapper::toDto);
    }

    /**
     * Delete the spotifyAccount by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete SpotifyAccount : {}", id);
        spotifyAccountRepository.deleteById(id);
    }
}
