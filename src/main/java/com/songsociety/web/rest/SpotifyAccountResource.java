package com.songsociety.web.rest;

import com.songsociety.repository.SpotifyAccountRepository;
import com.songsociety.service.SpotifyAccountService;
import com.songsociety.service.dto.SpotifyAccountDTO;
import com.songsociety.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.songsociety.domain.SpotifyAccount}.
 */
@RestController
@RequestMapping("/api")
public class SpotifyAccountResource {

    private final Logger log = LoggerFactory.getLogger(SpotifyAccountResource.class);

    private static final String ENTITY_NAME = "spotifyAccount";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SpotifyAccountService spotifyAccountService;

    private final SpotifyAccountRepository spotifyAccountRepository;

    public SpotifyAccountResource(SpotifyAccountService spotifyAccountService, SpotifyAccountRepository spotifyAccountRepository) {
        this.spotifyAccountService = spotifyAccountService;
        this.spotifyAccountRepository = spotifyAccountRepository;
    }

    /**
     * {@code POST  /spotify-accounts} : Create a new spotifyAccount.
     *
     * @param spotifyAccountDTO the spotifyAccountDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new spotifyAccountDTO, or with status {@code 400 (Bad Request)} if the spotifyAccount has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/spotify-accounts")
    public ResponseEntity<SpotifyAccountDTO> createSpotifyAccount(@Valid @RequestBody SpotifyAccountDTO spotifyAccountDTO)
        throws URISyntaxException {
        log.debug("REST request to save SpotifyAccount : {}", spotifyAccountDTO);
        if (spotifyAccountDTO.getId() != null) {
            throw new BadRequestAlertException("A new spotifyAccount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SpotifyAccountDTO result = spotifyAccountService.save(spotifyAccountDTO);
        return ResponseEntity
            .created(new URI("/api/spotify-accounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /spotify-accounts/:id} : Updates an existing spotifyAccount.
     *
     * @param id the id of the spotifyAccountDTO to save.
     * @param spotifyAccountDTO the spotifyAccountDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated spotifyAccountDTO,
     * or with status {@code 400 (Bad Request)} if the spotifyAccountDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the spotifyAccountDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/spotify-accounts/{id}")
    public ResponseEntity<SpotifyAccountDTO> updateSpotifyAccount(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SpotifyAccountDTO spotifyAccountDTO
    ) throws URISyntaxException {
        log.debug("REST request to update SpotifyAccount : {}, {}", id, spotifyAccountDTO);
        if (spotifyAccountDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, spotifyAccountDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!spotifyAccountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SpotifyAccountDTO result = spotifyAccountService.update(spotifyAccountDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, spotifyAccountDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /spotify-accounts/:id} : Partial updates given fields of an existing spotifyAccount, field will ignore if it is null
     *
     * @param id the id of the spotifyAccountDTO to save.
     * @param spotifyAccountDTO the spotifyAccountDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated spotifyAccountDTO,
     * or with status {@code 400 (Bad Request)} if the spotifyAccountDTO is not valid,
     * or with status {@code 404 (Not Found)} if the spotifyAccountDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the spotifyAccountDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/spotify-accounts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SpotifyAccountDTO> partialUpdateSpotifyAccount(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SpotifyAccountDTO spotifyAccountDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update SpotifyAccount partially : {}, {}", id, spotifyAccountDTO);
        if (spotifyAccountDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, spotifyAccountDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!spotifyAccountRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SpotifyAccountDTO> result = spotifyAccountService.partialUpdate(spotifyAccountDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, spotifyAccountDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /spotify-accounts} : get all the spotifyAccounts.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of spotifyAccounts in body.
     */
    @GetMapping("/spotify-accounts")
    public List<SpotifyAccountDTO> getAllSpotifyAccounts(@RequestParam(required = false) String filter) {
        if ("poster-is-null".equals(filter)) {
            log.debug("REST request to get all SpotifyAccounts where poster is null");
            return spotifyAccountService.findAllWherePosterIsNull();
        }
        log.debug("REST request to get all SpotifyAccounts");
        return spotifyAccountService.findAll();
    }

    /**
     * {@code GET  /spotify-accounts/:id} : get the "id" spotifyAccount.
     *
     * @param id the id of the spotifyAccountDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the spotifyAccountDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/spotify-accounts/{id}")
    public ResponseEntity<SpotifyAccountDTO> getSpotifyAccount(@PathVariable Long id) {
        log.debug("REST request to get SpotifyAccount : {}", id);
        Optional<SpotifyAccountDTO> spotifyAccountDTO = spotifyAccountService.findOne(id);
        return ResponseUtil.wrapOrNotFound(spotifyAccountDTO);
    }

    /**
     * {@code DELETE  /spotify-accounts/:id} : delete the "id" spotifyAccount.
     *
     * @param id the id of the spotifyAccountDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/spotify-accounts/{id}")
    public ResponseEntity<Void> deleteSpotifyAccount(@PathVariable Long id) {
        log.debug("REST request to delete SpotifyAccount : {}", id);
        spotifyAccountService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
