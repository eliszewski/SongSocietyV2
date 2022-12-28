package com.songsociety.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.songsociety.IntegrationTest;
import com.songsociety.domain.Reply;
import com.songsociety.repository.ReplyRepository;
import com.songsociety.service.dto.ReplyDTO;
import com.songsociety.service.mapper.ReplyMapper;
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
 * Integration tests for the {@link ReplyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReplyResourceIT {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/replies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private ReplyMapper replyMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReplyMockMvc;

    private Reply reply;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reply createEntity(EntityManager em) {
        Reply reply = new Reply().content(DEFAULT_CONTENT);
        return reply;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reply createUpdatedEntity(EntityManager em) {
        Reply reply = new Reply().content(UPDATED_CONTENT);
        return reply;
    }

    @BeforeEach
    public void initTest() {
        reply = createEntity(em);
    }

    @Test
    @Transactional
    void createReply() throws Exception {
        int databaseSizeBeforeCreate = replyRepository.findAll().size();
        // Create the Reply
        ReplyDTO replyDTO = replyMapper.toDto(reply);
        restReplyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(replyDTO)))
            .andExpect(status().isCreated());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeCreate + 1);
        Reply testReply = replyList.get(replyList.size() - 1);
        assertThat(testReply.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    void createReplyWithExistingId() throws Exception {
        // Create the Reply with an existing ID
        reply.setId(1L);
        ReplyDTO replyDTO = replyMapper.toDto(reply);

        int databaseSizeBeforeCreate = replyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReplyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(replyDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReplies() throws Exception {
        // Initialize the database
        replyRepository.saveAndFlush(reply);

        // Get all the replyList
        restReplyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reply.getId().intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())));
    }

    @Test
    @Transactional
    void getReply() throws Exception {
        // Initialize the database
        replyRepository.saveAndFlush(reply);

        // Get the reply
        restReplyMockMvc
            .perform(get(ENTITY_API_URL_ID, reply.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reply.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingReply() throws Exception {
        // Get the reply
        restReplyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReply() throws Exception {
        // Initialize the database
        replyRepository.saveAndFlush(reply);

        int databaseSizeBeforeUpdate = replyRepository.findAll().size();

        // Update the reply
        Reply updatedReply = replyRepository.findById(reply.getId()).get();
        // Disconnect from session so that the updates on updatedReply are not directly saved in db
        em.detach(updatedReply);
        updatedReply.content(UPDATED_CONTENT);
        ReplyDTO replyDTO = replyMapper.toDto(updatedReply);

        restReplyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, replyDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(replyDTO))
            )
            .andExpect(status().isOk());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
        Reply testReply = replyList.get(replyList.size() - 1);
        assertThat(testReply.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void putNonExistingReply() throws Exception {
        int databaseSizeBeforeUpdate = replyRepository.findAll().size();
        reply.setId(count.incrementAndGet());

        // Create the Reply
        ReplyDTO replyDTO = replyMapper.toDto(reply);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReplyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, replyDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(replyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReply() throws Exception {
        int databaseSizeBeforeUpdate = replyRepository.findAll().size();
        reply.setId(count.incrementAndGet());

        // Create the Reply
        ReplyDTO replyDTO = replyMapper.toDto(reply);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReplyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(replyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReply() throws Exception {
        int databaseSizeBeforeUpdate = replyRepository.findAll().size();
        reply.setId(count.incrementAndGet());

        // Create the Reply
        ReplyDTO replyDTO = replyMapper.toDto(reply);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReplyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(replyDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReplyWithPatch() throws Exception {
        // Initialize the database
        replyRepository.saveAndFlush(reply);

        int databaseSizeBeforeUpdate = replyRepository.findAll().size();

        // Update the reply using partial update
        Reply partialUpdatedReply = new Reply();
        partialUpdatedReply.setId(reply.getId());

        partialUpdatedReply.content(UPDATED_CONTENT);

        restReplyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReply.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReply))
            )
            .andExpect(status().isOk());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
        Reply testReply = replyList.get(replyList.size() - 1);
        assertThat(testReply.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void fullUpdateReplyWithPatch() throws Exception {
        // Initialize the database
        replyRepository.saveAndFlush(reply);

        int databaseSizeBeforeUpdate = replyRepository.findAll().size();

        // Update the reply using partial update
        Reply partialUpdatedReply = new Reply();
        partialUpdatedReply.setId(reply.getId());

        partialUpdatedReply.content(UPDATED_CONTENT);

        restReplyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReply.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReply))
            )
            .andExpect(status().isOk());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
        Reply testReply = replyList.get(replyList.size() - 1);
        assertThat(testReply.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void patchNonExistingReply() throws Exception {
        int databaseSizeBeforeUpdate = replyRepository.findAll().size();
        reply.setId(count.incrementAndGet());

        // Create the Reply
        ReplyDTO replyDTO = replyMapper.toDto(reply);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReplyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, replyDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(replyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReply() throws Exception {
        int databaseSizeBeforeUpdate = replyRepository.findAll().size();
        reply.setId(count.incrementAndGet());

        // Create the Reply
        ReplyDTO replyDTO = replyMapper.toDto(reply);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReplyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(replyDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReply() throws Exception {
        int databaseSizeBeforeUpdate = replyRepository.findAll().size();
        reply.setId(count.incrementAndGet());

        // Create the Reply
        ReplyDTO replyDTO = replyMapper.toDto(reply);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReplyMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(replyDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reply in the database
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReply() throws Exception {
        // Initialize the database
        replyRepository.saveAndFlush(reply);

        int databaseSizeBeforeDelete = replyRepository.findAll().size();

        // Delete the reply
        restReplyMockMvc
            .perform(delete(ENTITY_API_URL_ID, reply.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Reply> replyList = replyRepository.findAll();
        assertThat(replyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
