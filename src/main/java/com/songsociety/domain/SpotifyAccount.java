package com.songsociety.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SpotifyAccount.
 */
@Entity
@Table(name = "spotify_account")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SpotifyAccount implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "spotify_id", unique = true)
    private String spotifyId;

    @JsonIgnoreProperties(value = { "user", "spotifyAccount", "profile", "like" }, allowSetters = true)
    @OneToOne(mappedBy = "spotifyAccount")
    private Poster poster;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SpotifyAccount id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSpotifyId() {
        return this.spotifyId;
    }

    public SpotifyAccount spotifyId(String spotifyId) {
        this.setSpotifyId(spotifyId);
        return this;
    }

    public void setSpotifyId(String spotifyId) {
        this.spotifyId = spotifyId;
    }

    public Poster getPoster() {
        return this.poster;
    }

    public void setPoster(Poster poster) {
        if (this.poster != null) {
            this.poster.setSpotifyAccount(null);
        }
        if (poster != null) {
            poster.setSpotifyAccount(this);
        }
        this.poster = poster;
    }

    public SpotifyAccount poster(Poster poster) {
        this.setPoster(poster);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SpotifyAccount)) {
            return false;
        }
        return id != null && id.equals(((SpotifyAccount) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SpotifyAccount{" +
            "id=" + getId() +
            ", spotifyId='" + getSpotifyId() + "'" +
            "}";
    }
}
