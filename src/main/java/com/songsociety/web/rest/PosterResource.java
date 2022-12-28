package com.songsociety.web.rest;

import com.songsociety.repository.PosterRepository;
import com.songsociety.service.PosterService;
import com.songsociety.service.dto.PosterDTO;
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
 * REST controller for managing {@link com.songsociety.domain.Poster}.
 */
@RestController
@RequestMapping("/api")
public class PosterResource {

    private final Logger log = LoggerFactory.getLogger(PosterResource.class);

    private static final String ENTITY_NAME = "poster";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PosterService posterService;

    private final PosterRepository posterRepository;

    public PosterResource(PosterService posterService, PosterRepository posterRepository) {
        this.posterService = posterService;
        this.posterRepository = posterRepository;
    }

    /**
     * {@code POST  /posters} : Create a new poster.
     *
     * @param posterDTO the posterDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new posterDTO, or with status {@code 400 (Bad Request)} if the poster has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/posters")
    public ResponseEntity<PosterDTO> createPoster(@Valid @RequestBody PosterDTO posterDTO) throws URISyntaxException {
        log.debug("REST request to save Poster : {}", posterDTO);
        if (posterDTO.getId() != null) {
            throw new BadRequestAlertException("A new poster cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PosterDTO result = posterService.save(posterDTO);
        return ResponseEntity
            .created(new URI("/api/posters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /posters/:id} : Updates an existing poster.
     *
     * @param id the id of the posterDTO to save.
     * @param posterDTO the posterDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated posterDTO,
     * or with status {@code 400 (Bad Request)} if the posterDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the posterDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/posters/{id}")
    public ResponseEntity<PosterDTO> updatePoster(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PosterDTO posterDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Poster : {}, {}", id, posterDTO);
        if (posterDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, posterDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!posterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PosterDTO result = posterService.update(posterDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, posterDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /posters/:id} : Partial updates given fields of an existing poster, field will ignore if it is null
     *
     * @param id the id of the posterDTO to save.
     * @param posterDTO the posterDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated posterDTO,
     * or with status {@code 400 (Bad Request)} if the posterDTO is not valid,
     * or with status {@code 404 (Not Found)} if the posterDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the posterDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/posters/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PosterDTO> partialUpdatePoster(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PosterDTO posterDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Poster partially : {}, {}", id, posterDTO);
        if (posterDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, posterDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!posterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PosterDTO> result = posterService.partialUpdate(posterDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, posterDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /posters} : get all the posters.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of posters in body.
     */
    @GetMapping("/posters")
    public List<PosterDTO> getAllPosters(@RequestParam(required = false) String filter) {
        if ("profile-is-null".equals(filter)) {
            log.debug("REST request to get all Posters where profile is null");
            return posterService.findAllWhereProfileIsNull();
        }

        if ("like-is-null".equals(filter)) {
            log.debug("REST request to get all Posters where like is null");
            return posterService.findAllWhereLikeIsNull();
        }
        log.debug("REST request to get all Posters");
        return posterService.findAll();
    }

    /**
     * {@code GET  /posters/:id} : get the "id" poster.
     *
     * @param id the id of the posterDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the posterDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/posters/{id}")
    public ResponseEntity<PosterDTO> getPoster(@PathVariable Long id) {
        log.debug("REST request to get Poster : {}", id);
        Optional<PosterDTO> posterDTO = posterService.findOne(id);
        return ResponseUtil.wrapOrNotFound(posterDTO);
    }

    /**
     * {@code DELETE  /posters/:id} : delete the "id" poster.
     *
     * @param id the id of the posterDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/posters/{id}")
    public ResponseEntity<Void> deletePoster(@PathVariable Long id) {
        log.debug("REST request to delete Poster : {}", id);
        posterService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
