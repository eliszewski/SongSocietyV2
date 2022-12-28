package com.songsociety.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the {@link com.songsociety.domain.Reply} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReplyDTO implements Serializable {

    private Long id;

    @Lob
    private String content;

    private PosterDTO author;

    private PostDTO post;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public PosterDTO getAuthor() {
        return author;
    }

    public void setAuthor(PosterDTO author) {
        this.author = author;
    }

    public PostDTO getPost() {
        return post;
    }

    public void setPost(PostDTO post) {
        this.post = post;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReplyDTO)) {
            return false;
        }

        ReplyDTO replyDTO = (ReplyDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, replyDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReplyDTO{" +
            "id=" + getId() +
            ", content='" + getContent() + "'" +
            ", author=" + getAuthor() +
            ", post=" + getPost() +
            "}";
    }
}
