package com.songsociety.service;

import com.songsociety.domain.Reply;
import com.songsociety.repository.ReplyRepository;
import com.songsociety.service.dto.ReplyDTO;
import com.songsociety.service.mapper.ReplyMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Reply}.
 */
@Service
@Transactional
public class ReplyService {

    private final Logger log = LoggerFactory.getLogger(ReplyService.class);

    private final ReplyRepository replyRepository;

    private final ReplyMapper replyMapper;

    public ReplyService(ReplyRepository replyRepository, ReplyMapper replyMapper) {
        this.replyRepository = replyRepository;
        this.replyMapper = replyMapper;
    }

    /**
     * Save a reply.
     *
     * @param replyDTO the entity to save.
     * @return the persisted entity.
     */
    public ReplyDTO save(ReplyDTO replyDTO) {
        log.debug("Request to save Reply : {}", replyDTO);
        Reply reply = replyMapper.toEntity(replyDTO);
        reply = replyRepository.save(reply);
        return replyMapper.toDto(reply);
    }

    /**
     * Update a reply.
     *
     * @param replyDTO the entity to save.
     * @return the persisted entity.
     */
    public ReplyDTO update(ReplyDTO replyDTO) {
        log.debug("Request to update Reply : {}", replyDTO);
        Reply reply = replyMapper.toEntity(replyDTO);
        reply = replyRepository.save(reply);
        return replyMapper.toDto(reply);
    }

    /**
     * Partially update a reply.
     *
     * @param replyDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ReplyDTO> partialUpdate(ReplyDTO replyDTO) {
        log.debug("Request to partially update Reply : {}", replyDTO);

        return replyRepository
            .findById(replyDTO.getId())
            .map(existingReply -> {
                replyMapper.partialUpdate(existingReply, replyDTO);

                return existingReply;
            })
            .map(replyRepository::save)
            .map(replyMapper::toDto);
    }

    /**
     * Get all the replies.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ReplyDTO> findAll() {
        log.debug("Request to get all Replies");
        return replyRepository.findAll().stream().map(replyMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one reply by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ReplyDTO> findOne(Long id) {
        log.debug("Request to get Reply : {}", id);
        return replyRepository.findById(id).map(replyMapper::toDto);
    }

    /**
     * Delete the reply by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Reply : {}", id);
        replyRepository.deleteById(id);
    }
}
