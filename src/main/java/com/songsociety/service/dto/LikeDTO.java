package com.songsociety.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.songsociety.domain.Like} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LikeDTO implements Serializable {

    private Long id;

    private PosterDTO poster;

    private PostDTO post;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PosterDTO getPoster() {
        return poster;
    }

    public void setPoster(PosterDTO poster) {
        this.poster = poster;
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
        if (!(o instanceof LikeDTO)) {
            return false;
        }

        LikeDTO likeDTO = (LikeDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, likeDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LikeDTO{" +
            "id=" + getId() +
            ", poster=" + getPoster() +
            ", post=" + getPost() +
            "}";
    }
}
