package com.songsociety.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.songsociety.IntegrationTest;
import com.songsociety.domain.SpotifyAccount;
import com.songsociety.repository.SpotifyAccountRepository;
import com.songsociety.service.dto.SpotifyAccountDTO;
import com.songsociety.service.mapper.SpotifyAccountMapper;
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

/**
 * Integration tests for the {@link SpotifyAccountResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SpotifyAccountResourceIT {

    private static final String DEFAULT_SPOTIFY_ID = "AAAAAAAAAA";
    private static final String UPDATED_SPOTIFY_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/spotify-accounts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SpotifyAccountRepository spotifyAccountRepository;

    @Autowired
    private SpotifyAccountMapper spotifyAccountMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSpotifyAccountMockMvc;

    private SpotifyAccount spotifyAccount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SpotifyAccount createEntity(EntityManager em) {
        SpotifyAccount spotifyAccount = new SpotifyAccount().spotifyId(DEFAULT_SPOTIFY_ID);
        return spotifyAccount;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SpotifyAccount createUpdatedEntity(EntityManager em) {
        SpotifyAccount spotifyAccount = new SpotifyAccount().spotifyId(UPDATED_SPOTIFY_ID);
        return spotifyAccount;
    }

    @BeforeEach
    public void initTest() {
        spotifyAccount = createEntity(em);
    }

    @Test
    @Transactional
    void createSpotifyAccount() throws Exception {
        int databaseSizeBeforeCreate = spotifyAccountRepository.findAll().size();
        // Create the SpotifyAccount
        SpotifyAccountDTO spotifyAccountDTO = spotifyAccountMapper.toDto(spotifyAccount);
        restSpotifyAccountMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(spotifyAccountDTO))
            )
            .andExpect(status().isCreated());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeCreate + 1);
        SpotifyAccount testSpotifyAccount = spotifyAccountList.get(spotifyAccountList.size() - 1);
        assertThat(testSpotifyAccount.getSpotifyId()).isEqualTo(DEFAULT_SPOTIFY_ID);
    }

    @Test
    @Transactional
    void createSpotifyAccountWithExistingId() throws Exception {
        // Create the SpotifyAccount with an existing ID
        spotifyAccount.setId(1L);
        SpotifyAccountDTO spotifyAccountDTO = spotifyAccountMapper.toDto(spotifyAccount);

        int databaseSizeBeforeCreate = spotifyAccountRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSpotifyAccountMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(spotifyAccountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSpotifyAccounts() throws Exception {
        // Initialize the database
        spotifyAccountRepository.saveAndFlush(spotifyAccount);

        // Get all the spotifyAccountList
        restSpotifyAccountMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(spotifyAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].spotifyId").value(hasItem(DEFAULT_SPOTIFY_ID)));
    }

    @Test
    @Transactional
    void getSpotifyAccount() throws Exception {
        // Initialize the database
        spotifyAccountRepository.saveAndFlush(spotifyAccount);

        // Get the spotifyAccount
        restSpotifyAccountMockMvc
            .perform(get(ENTITY_API_URL_ID, spotifyAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(spotifyAccount.getId().intValue()))
            .andExpect(jsonPath("$.spotifyId").value(DEFAULT_SPOTIFY_ID));
    }

    @Test
    @Transactional
    void getNonExistingSpotifyAccount() throws Exception {
        // Get the spotifyAccount
        restSpotifyAccountMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSpotifyAccount() throws Exception {
        // Initialize the database
        spotifyAccountRepository.saveAndFlush(spotifyAccount);

        int databaseSizeBeforeUpdate = spotifyAccountRepository.findAll().size();

        // Update the spotifyAccount
        SpotifyAccount updatedSpotifyAccount = spotifyAccountRepository.findById(spotifyAccount.getId()).get();
        // Disconnect from session so that the updates on updatedSpotifyAccount are not directly saved in db
        em.detach(updatedSpotifyAccount);
        updatedSpotifyAccount.spotifyId(UPDATED_SPOTIFY_ID);
        SpotifyAccountDTO spotifyAccountDTO = spotifyAccountMapper.toDto(updatedSpotifyAccount);

        restSpotifyAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, spotifyAccountDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(spotifyAccountDTO))
            )
            .andExpect(status().isOk());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeUpdate);
        SpotifyAccount testSpotifyAccount = spotifyAccountList.get(spotifyAccountList.size() - 1);
        assertThat(testSpotifyAccount.getSpotifyId()).isEqualTo(UPDATED_SPOTIFY_ID);
    }

    @Test
    @Transactional
    void putNonExistingSpotifyAccount() throws Exception {
        int databaseSizeBeforeUpdate = spotifyAccountRepository.findAll().size();
        spotifyAccount.setId(count.incrementAndGet());

        // Create the SpotifyAccount
        SpotifyAccountDTO spotifyAccountDTO = spotifyAccountMapper.toDto(spotifyAccount);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSpotifyAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, spotifyAccountDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(spotifyAccountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSpotifyAccount() throws Exception {
        int databaseSizeBeforeUpdate = spotifyAccountRepository.findAll().size();
        spotifyAccount.setId(count.incrementAndGet());

        // Create the SpotifyAccount
        SpotifyAccountDTO spotifyAccountDTO = spotifyAccountMapper.toDto(spotifyAccount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpotifyAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(spotifyAccountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSpotifyAccount() throws Exception {
        int databaseSizeBeforeUpdate = spotifyAccountRepository.findAll().size();
        spotifyAccount.setId(count.incrementAndGet());

        // Create the SpotifyAccount
        SpotifyAccountDTO spotifyAccountDTO = spotifyAccountMapper.toDto(spotifyAccount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpotifyAccountMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(spotifyAccountDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSpotifyAccountWithPatch() throws Exception {
        // Initialize the database
        spotifyAccountRepository.saveAndFlush(spotifyAccount);

        int databaseSizeBeforeUpdate = spotifyAccountRepository.findAll().size();

        // Update the spotifyAccount using partial update
        SpotifyAccount partialUpdatedSpotifyAccount = new SpotifyAccount();
        partialUpdatedSpotifyAccount.setId(spotifyAccount.getId());

        restSpotifyAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSpotifyAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSpotifyAccount))
            )
            .andExpect(status().isOk());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeUpdate);
        SpotifyAccount testSpotifyAccount = spotifyAccountList.get(spotifyAccountList.size() - 1);
        assertThat(testSpotifyAccount.getSpotifyId()).isEqualTo(DEFAULT_SPOTIFY_ID);
    }

    @Test
    @Transactional
    void fullUpdateSpotifyAccountWithPatch() throws Exception {
        // Initialize the database
        spotifyAccountRepository.saveAndFlush(spotifyAccount);

        int databaseSizeBeforeUpdate = spotifyAccountRepository.findAll().size();

        // Update the spotifyAccount using partial update
        SpotifyAccount partialUpdatedSpotifyAccount = new SpotifyAccount();
        partialUpdatedSpotifyAccount.setId(spotifyAccount.getId());

        partialUpdatedSpotifyAccount.spotifyId(UPDATED_SPOTIFY_ID);

        restSpotifyAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSpotifyAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSpotifyAccount))
            )
            .andExpect(status().isOk());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeUpdate);
        SpotifyAccount testSpotifyAccount = spotifyAccountList.get(spotifyAccountList.size() - 1);
        assertThat(testSpotifyAccount.getSpotifyId()).isEqualTo(UPDATED_SPOTIFY_ID);
    }

    @Test
    @Transactional
    void patchNonExistingSpotifyAccount() throws Exception {
        int databaseSizeBeforeUpdate = spotifyAccountRepository.findAll().size();
        spotifyAccount.setId(count.incrementAndGet());

        // Create the SpotifyAccount
        SpotifyAccountDTO spotifyAccountDTO = spotifyAccountMapper.toDto(spotifyAccount);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSpotifyAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, spotifyAccountDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(spotifyAccountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSpotifyAccount() throws Exception {
        int databaseSizeBeforeUpdate = spotifyAccountRepository.findAll().size();
        spotifyAccount.setId(count.incrementAndGet());

        // Create the SpotifyAccount
        SpotifyAccountDTO spotifyAccountDTO = spotifyAccountMapper.toDto(spotifyAccount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpotifyAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(spotifyAccountDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSpotifyAccount() throws Exception {
        int databaseSizeBeforeUpdate = spotifyAccountRepository.findAll().size();
        spotifyAccount.setId(count.incrementAndGet());

        // Create the SpotifyAccount
        SpotifyAccountDTO spotifyAccountDTO = spotifyAccountMapper.toDto(spotifyAccount);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSpotifyAccountMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(spotifyAccountDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SpotifyAccount in the database
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSpotifyAccount() throws Exception {
        // Initialize the database
        spotifyAccountRepository.saveAndFlush(spotifyAccount);

        int databaseSizeBeforeDelete = spotifyAccountRepository.findAll().size();

        // Delete the spotifyAccount
        restSpotifyAccountMockMvc
            .perform(delete(ENTITY_API_URL_ID, spotifyAccount.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SpotifyAccount> spotifyAccountList = spotifyAccountRepository.findAll();
        assertThat(spotifyAccountList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
