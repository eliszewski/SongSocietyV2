package com.songsociety.service;

import com.songsociety.domain.Poster;
import com.songsociety.domain.Profile;
import com.songsociety.repository.ProfileRepository;
import com.songsociety.service.dto.ProfileDTO;
import com.songsociety.service.mapper.ProfileMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Profile}.
 */
@Service
@Transactional
public class ProfileService {

    private final Logger log = LoggerFactory.getLogger(ProfileService.class);

    private final ProfileRepository profileRepository;

    private final ProfileMapper profileMapper;

    public ProfileService(ProfileRepository profileRepository, ProfileMapper profileMapper) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
    }

    /**
     * Save a profile.
     *
     * @param profileDTO the entity to save.
     * @return the persisted entity.
     */
    public ProfileDTO save(ProfileDTO profileDTO) {
        log.debug("Request to save Profile : {}", profileDTO);
        Profile profile = profileMapper.toEntity(profileDTO);
        profile = profileRepository.save(profile);
        return profileMapper.toDto(profile);
    }

    /**
     * Update a profile.
     *
     * @param profileDTO the entity to save.
     * @return the persisted entity.
     */
    public ProfileDTO update(ProfileDTO profileDTO) {
        log.debug("Request to update Profile : {}", profileDTO);
        Profile profile = profileMapper.toEntity(profileDTO);
        profile = profileRepository.save(profile);
        return profileMapper.toDto(profile);
    }

    /**
     * Partially update a profile.
     *
     * @param profileDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProfileDTO> partialUpdate(ProfileDTO profileDTO) {
        log.debug("Request to partially update Profile : {}", profileDTO);

        return profileRepository
            .findById(profileDTO.getId())
            .map(existingProfile -> {
                profileMapper.partialUpdate(existingProfile, profileDTO);

                return existingProfile;
            })
            .map(profileRepository::save)
            .map(profileMapper::toDto);
    }

    /**
     * Get all the profiles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProfileDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Profiles");
        return profileRepository.findAll(pageable).map(profileMapper::toDto);
    }

    /**
     * Get one profile by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProfileDTO> findOne(Long id) {
        log.debug("Request to get Profile : {}", id);
        return profileRepository.findById(id).map(profileMapper::toDto);
    }

    @Transactional
    public void createProfileForPoster(Poster poster) {
        if (poster.getProfile() != null) {
            throw new IllegalArgumentException("Poster has a profile already");
        }
        Profile profile = new Profile();
        profile.setPoster(poster);
        profileRepository.save(profile);
    }

    /**
     * Delete the profile by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Profile : {}", id);
        profileRepository.deleteById(id);
    }
}
