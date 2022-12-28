package com.songsociety.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.songsociety.IntegrationTest;
import com.songsociety.domain.Poster;
import com.songsociety.repository.PosterRepository;
import com.songsociety.service.dto.PosterDTO;
import com.songsociety.service.mapper.PosterMapper;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link PosterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PosterResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SOCIETY_TAG = "AAAAAAAAAA";
    private static final String UPDATED_SOCIETY_TAG = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PROFILE_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_PICTURE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/posters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PosterRepository posterRepository;

    @Autowired
    private PosterMapper posterMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPosterMockMvc;

    private Poster poster;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Poster createEntity(EntityManager em) {
        Poster poster = new Poster()
            .name(DEFAULT_NAME)
            .societyTag(DEFAULT_SOCIETY_TAG)
            .profilePicture(DEFAULT_PROFILE_PICTURE)
            .profilePictureContentType(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE);
        return poster;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Poster createUpdatedEntity(EntityManager em) {
        Poster poster = new Poster()
            .name(UPDATED_NAME)
            .societyTag(UPDATED_SOCIETY_TAG)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
        return poster;
    }

    @BeforeEach
    public void initTest() {
        poster = createEntity(em);
    }

    @Test
    @Transactional
    void createPoster() throws Exception {
        int databaseSizeBeforeCreate = posterRepository.findAll().size();
        // Create the Poster
        PosterDTO posterDTO = posterMapper.toDto(poster);
        restPosterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posterDTO)))
            .andExpect(status().isCreated());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeCreate + 1);
        Poster testPoster = posterList.get(posterList.size() - 1);
        assertThat(testPoster.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPoster.getSocietyTag()).isEqualTo(DEFAULT_SOCIETY_TAG);
        assertThat(testPoster.getProfilePicture()).isEqualTo(DEFAULT_PROFILE_PICTURE);
        assertThat(testPoster.getProfilePictureContentType()).isEqualTo(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createPosterWithExistingId() throws Exception {
        // Create the Poster with an existing ID
        poster.setId(1L);
        PosterDTO posterDTO = posterMapper.toDto(poster);

        int databaseSizeBeforeCreate = posterRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPosterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posterDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = posterRepository.findAll().size();
        // set the field null
        poster.setName(null);

        // Create the Poster, which fails.
        PosterDTO posterDTO = posterMapper.toDto(poster);

        restPosterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posterDTO)))
            .andExpect(status().isBadRequest());

        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSocietyTagIsRequired() throws Exception {
        int databaseSizeBeforeTest = posterRepository.findAll().size();
        // set the field null
        poster.setSocietyTag(null);

        // Create the Poster, which fails.
        PosterDTO posterDTO = posterMapper.toDto(poster);

        restPosterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posterDTO)))
            .andExpect(status().isBadRequest());

        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPosters() throws Exception {
        // Initialize the database
        posterRepository.saveAndFlush(poster);

        // Get all the posterList
        restPosterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(poster.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].societyTag").value(hasItem(DEFAULT_SOCIETY_TAG)))
            .andExpect(jsonPath("$.[*].profilePictureContentType").value(hasItem(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profilePicture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_PICTURE))));
    }

    @Test
    @Transactional
    void getPoster() throws Exception {
        // Initialize the database
        posterRepository.saveAndFlush(poster);

        // Get the poster
        restPosterMockMvc
            .perform(get(ENTITY_API_URL_ID, poster.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(poster.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.societyTag").value(DEFAULT_SOCIETY_TAG))
            .andExpect(jsonPath("$.profilePictureContentType").value(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.profilePicture").value(Base64Utils.encodeToString(DEFAULT_PROFILE_PICTURE)));
    }

    @Test
    @Transactional
    void getNonExistingPoster() throws Exception {
        // Get the poster
        restPosterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPoster() throws Exception {
        // Initialize the database
        posterRepository.saveAndFlush(poster);

        int databaseSizeBeforeUpdate = posterRepository.findAll().size();

        // Update the poster
        Poster updatedPoster = posterRepository.findById(poster.getId()).get();
        // Disconnect from session so that the updates on updatedPoster are not directly saved in db
        em.detach(updatedPoster);
        updatedPoster
            .name(UPDATED_NAME)
            .societyTag(UPDATED_SOCIETY_TAG)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
        PosterDTO posterDTO = posterMapper.toDto(updatedPoster);

        restPosterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, posterDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(posterDTO))
            )
            .andExpect(status().isOk());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeUpdate);
        Poster testPoster = posterList.get(posterList.size() - 1);
        assertThat(testPoster.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPoster.getSocietyTag()).isEqualTo(UPDATED_SOCIETY_TAG);
        assertThat(testPoster.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testPoster.getProfilePictureContentType()).isEqualTo(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingPoster() throws Exception {
        int databaseSizeBeforeUpdate = posterRepository.findAll().size();
        poster.setId(count.incrementAndGet());

        // Create the Poster
        PosterDTO posterDTO = posterMapper.toDto(poster);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPosterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, posterDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(posterDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPoster() throws Exception {
        int databaseSizeBeforeUpdate = posterRepository.findAll().size();
        poster.setId(count.incrementAndGet());

        // Create the Poster
        PosterDTO posterDTO = posterMapper.toDto(poster);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(posterDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPoster() throws Exception {
        int databaseSizeBeforeUpdate = posterRepository.findAll().size();
        poster.setId(count.incrementAndGet());

        // Create the Poster
        PosterDTO posterDTO = posterMapper.toDto(poster);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosterMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(posterDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePosterWithPatch() throws Exception {
        // Initialize the database
        posterRepository.saveAndFlush(poster);

        int databaseSizeBeforeUpdate = posterRepository.findAll().size();

        // Update the poster using partial update
        Poster partialUpdatedPoster = new Poster();
        partialUpdatedPoster.setId(poster.getId());

        partialUpdatedPoster.profilePicture(UPDATED_PROFILE_PICTURE).profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);

        restPosterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoster.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoster))
            )
            .andExpect(status().isOk());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeUpdate);
        Poster testPoster = posterList.get(posterList.size() - 1);
        assertThat(testPoster.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPoster.getSocietyTag()).isEqualTo(DEFAULT_SOCIETY_TAG);
        assertThat(testPoster.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testPoster.getProfilePictureContentType()).isEqualTo(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdatePosterWithPatch() throws Exception {
        // Initialize the database
        posterRepository.saveAndFlush(poster);

        int databaseSizeBeforeUpdate = posterRepository.findAll().size();

        // Update the poster using partial update
        Poster partialUpdatedPoster = new Poster();
        partialUpdatedPoster.setId(poster.getId());

        partialUpdatedPoster
            .name(UPDATED_NAME)
            .societyTag(UPDATED_SOCIETY_TAG)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);

        restPosterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoster.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoster))
            )
            .andExpect(status().isOk());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeUpdate);
        Poster testPoster = posterList.get(posterList.size() - 1);
        assertThat(testPoster.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPoster.getSocietyTag()).isEqualTo(UPDATED_SOCIETY_TAG);
        assertThat(testPoster.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testPoster.getProfilePictureContentType()).isEqualTo(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingPoster() throws Exception {
        int databaseSizeBeforeUpdate = posterRepository.findAll().size();
        poster.setId(count.incrementAndGet());

        // Create the Poster
        PosterDTO posterDTO = posterMapper.toDto(poster);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPosterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, posterDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(posterDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPoster() throws Exception {
        int databaseSizeBeforeUpdate = posterRepository.findAll().size();
        poster.setId(count.incrementAndGet());

        // Create the Poster
        PosterDTO posterDTO = posterMapper.toDto(poster);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(posterDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPoster() throws Exception {
        int databaseSizeBeforeUpdate = posterRepository.findAll().size();
        poster.setId(count.incrementAndGet());

        // Create the Poster
        PosterDTO posterDTO = posterMapper.toDto(poster);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosterMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(posterDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Poster in the database
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePoster() throws Exception {
        // Initialize the database
        posterRepository.saveAndFlush(poster);

        int databaseSizeBeforeDelete = posterRepository.findAll().size();

        // Delete the poster
        restPosterMockMvc
            .perform(delete(ENTITY_API_URL_ID, poster.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Poster> posterList = posterRepository.findAll();
        assertThat(posterList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
