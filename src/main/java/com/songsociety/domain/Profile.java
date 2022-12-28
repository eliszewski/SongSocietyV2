package com.songsociety.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Profile.
 */
@Entity
@Table(name = "profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Profile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "about_me")
    private String aboutMe;

    @Column(name = "favorite_song")
    private String favoriteSong;

    @Column(name = "favorite_artist")
    private String favoriteArtist;

    @Column(name = "favorite_album")
    private String favoriteAlbum;

    @JsonIgnoreProperties(value = { "user", "spotifyAccount", "profile", "like" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Poster poster;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Profile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAboutMe() {
        return this.aboutMe;
    }

    public Profile aboutMe(String aboutMe) {
        this.setAboutMe(aboutMe);
        return this;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public String getFavoriteSong() {
        return this.favoriteSong;
    }

    public Profile favoriteSong(String favoriteSong) {
        this.setFavoriteSong(favoriteSong);
        return this;
    }

    public void setFavoriteSong(String favoriteSong) {
        this.favoriteSong = favoriteSong;
    }

    public String getFavoriteArtist() {
        return this.favoriteArtist;
    }

    public Profile favoriteArtist(String favoriteArtist) {
        this.setFavoriteArtist(favoriteArtist);
        return this;
    }

    public void setFavoriteArtist(String favoriteArtist) {
        this.favoriteArtist = favoriteArtist;
    }

    public String getFavoriteAlbum() {
        return this.favoriteAlbum;
    }

    public Profile favoriteAlbum(String favoriteAlbum) {
        this.setFavoriteAlbum(favoriteAlbum);
        return this;
    }

    public void setFavoriteAlbum(String favoriteAlbum) {
        this.favoriteAlbum = favoriteAlbum;
    }

    public Poster getPoster() {
        return this.poster;
    }

    public void setPoster(Poster poster) {
        this.poster = poster;
    }

    public Profile poster(Poster poster) {
        this.setPoster(poster);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Profile)) {
            return false;
        }
        return id != null && id.equals(((Profile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Profile{" +
            "id=" + getId() +
            ", aboutMe='" + getAboutMe() + "'" +
            ", favoriteSong='" + getFavoriteSong() + "'" +
            ", favoriteArtist='" + getFavoriteArtist() + "'" +
            ", favoriteAlbum='" + getFavoriteAlbum() + "'" +
            "}";
    }
}
