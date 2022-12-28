package com.songsociety.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the {@link com.songsociety.domain.Profile} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProfileDTO implements Serializable {

    private Long id;

    @Lob
    private String aboutMe;

    private String favoriteSong;

    private String favoriteArtist;

    private String favoriteAlbum;

    private PosterDTO poster;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public String getFavoriteSong() {
        return favoriteSong;
    }

    public void setFavoriteSong(String favoriteSong) {
        this.favoriteSong = favoriteSong;
    }

    public String getFavoriteArtist() {
        return favoriteArtist;
    }

    public void setFavoriteArtist(String favoriteArtist) {
        this.favoriteArtist = favoriteArtist;
    }

    public String getFavoriteAlbum() {
        return favoriteAlbum;
    }

    public void setFavoriteAlbum(String favoriteAlbum) {
        this.favoriteAlbum = favoriteAlbum;
    }

    public PosterDTO getPoster() {
        return poster;
    }

    public void setPoster(PosterDTO poster) {
        this.poster = poster;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProfileDTO)) {
            return false;
        }

        ProfileDTO profileDTO = (ProfileDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, profileDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProfileDTO{" +
            "id=" + getId() +
            ", aboutMe='" + getAboutMe() + "'" +
            ", favoriteSong='" + getFavoriteSong() + "'" +
            ", favoriteArtist='" + getFavoriteArtist() + "'" +
            ", favoriteAlbum='" + getFavoriteAlbum() + "'" +
            ", poster=" + getPoster() +
            "}";
    }
}
