package com.songsociety.service;

import com.songsociety.domain.Poster;
import com.songsociety.domain.User;
import com.songsociety.repository.PosterRepository;
import com.songsociety.service.dto.PosterDTO;
import com.songsociety.service.mapper.PosterMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Poster}.
 */
@Service
@Transactional
public class PosterService {

    private final Logger log = LoggerFactory.getLogger(PosterService.class);

    private final PosterRepository posterRepository;

    private final PosterMapper posterMapper;

    @Autowired
    private ProfileService profileService;

    public PosterService(PosterRepository posterRepository, PosterMapper posterMapper) {
        this.posterRepository = posterRepository;
        this.posterMapper = posterMapper;
    }

    /**
     * Save a poster.
     *
     * @param posterDTO the entity to save.
     * @return the persisted entity.
     */
    public PosterDTO save(PosterDTO posterDTO) {
        log.debug("Request to save Poster : {}", posterDTO);
        Poster poster = posterMapper.toEntity(posterDTO);
        poster = posterRepository.save(poster);
        return posterMapper.toDto(poster);
    }

    /**
     * Update a poster.
     *
     * @param posterDTO the entity to save.
     * @return the persisted entity.
     */
    public PosterDTO update(PosterDTO posterDTO) {
        log.debug("Request to update Poster : {}", posterDTO);
        Poster poster = posterMapper.toEntity(posterDTO);
        poster = posterRepository.save(poster);
        return posterMapper.toDto(poster);
    }

    /**
     * Partially update a poster.
     *
     * @param posterDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PosterDTO> partialUpdate(PosterDTO posterDTO) {
        log.debug("Request to partially update Poster : {}", posterDTO);

        return posterRepository
            .findById(posterDTO.getId())
            .map(existingPoster -> {
                posterMapper.partialUpdate(existingPoster, posterDTO);

                return existingPoster;
            })
            .map(posterRepository::save)
            .map(posterMapper::toDto);
    }

    /**
     * Get all the posters.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<PosterDTO> findAll() {
        log.debug("Request to get all Posters");
        return posterRepository.findAll().stream().map(posterMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the posters where Profile is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<PosterDTO> findAllWhereProfileIsNull() {
        log.debug("Request to get all posters where Profile is null");
        return StreamSupport
            .stream(posterRepository.findAll().spliterator(), false)
            .filter(poster -> poster.getProfile() == null)
            .map(posterMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the posters where Like is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<PosterDTO> findAllWhereLikeIsNull() {
        log.debug("Request to get all posters where Like is null");
        return StreamSupport
            .stream(posterRepository.findAll().spliterator(), false)
            .filter(poster -> poster.getLike() == null)
            .map(posterMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one poster by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PosterDTO> findOne(Long id) {
        log.debug("Request to get Poster : {}", id);
        return posterRepository.findById(id).map(posterMapper::toDto);
    }

    /**
     * Delete the poster by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Poster : {}", id);
        posterRepository.deleteById(id);
    }

    /**
     * Create a poster for a new user.
     * @param user to create a poster for.
     */
    @Transactional
    public void createPosterForUser(User user) {
        Poster poster = new Poster();
        poster.setSocietyTag(user.getLogin());
        poster.setUser(user);
        poster.setName(user.getLogin());
        profileService.createProfileForPoster(poster);
        posterRepository.save(poster);
    }
}
