package com.songsociety.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.songsociety.domain.SpotifyAccount} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SpotifyAccountDTO implements Serializable {

    private Long id;

    private String spotifyId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSpotifyId() {
        return spotifyId;
    }

    public void setSpotifyId(String spotifyId) {
        this.spotifyId = spotifyId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SpotifyAccountDTO)) {
            return false;
        }

        SpotifyAccountDTO spotifyAccountDTO = (SpotifyAccountDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, spotifyAccountDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SpotifyAccountDTO{" +
            "id=" + getId() +
            ", spotifyId='" + getSpotifyId() + "'" +
            "}";
    }
}
