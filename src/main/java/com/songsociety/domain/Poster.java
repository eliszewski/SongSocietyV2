package com.songsociety.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Poster.
 */
@Entity
@Table(name = "poster")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Poster implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "society_tag", nullable = false, unique = true)
    private String societyTag;

    @Lob
    @Column(name = "profile_picture")
    private byte[] profilePicture;

    @Column(name = "profile_picture_content_type")
    private String profilePictureContentType;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @JsonIgnoreProperties(value = { "poster" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private SpotifyAccount spotifyAccount;

    @JsonIgnoreProperties(value = { "poster" }, allowSetters = true)
    @OneToOne(mappedBy = "poster")
    private Profile profile;

    @JsonIgnoreProperties(value = { "poster", "post" }, allowSetters = true)
    @OneToOne(mappedBy = "poster")
    private Like like;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Poster id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Poster name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSocietyTag() {
        return this.societyTag;
    }

    public Poster societyTag(String societyTag) {
        this.setSocietyTag(societyTag);
        return this;
    }

    public void setSocietyTag(String societyTag) {
        this.societyTag = societyTag;
    }

    public byte[] getProfilePicture() {
        return this.profilePicture;
    }

    public Poster profilePicture(byte[] profilePicture) {
        this.setProfilePicture(profilePicture);
        return this;
    }

    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getProfilePictureContentType() {
        return this.profilePictureContentType;
    }

    public Poster profilePictureContentType(String profilePictureContentType) {
        this.profilePictureContentType = profilePictureContentType;
        return this;
    }

    public void setProfilePictureContentType(String profilePictureContentType) {
        this.profilePictureContentType = profilePictureContentType;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Poster user(User user) {
        this.setUser(user);
        return this;
    }

    public SpotifyAccount getSpotifyAccount() {
        return this.spotifyAccount;
    }

    public void setSpotifyAccount(SpotifyAccount spotifyAccount) {
        this.spotifyAccount = spotifyAccount;
    }

    public Poster spotifyAccount(SpotifyAccount spotifyAccount) {
        this.setSpotifyAccount(spotifyAccount);
        return this;
    }

    public Profile getProfile() {
        return this.profile;
    }

    public void setProfile(Profile profile) {
        if (this.profile != null) {
            this.profile.setPoster(null);
        }
        if (profile != null) {
            profile.setPoster(this);
        }
        this.profile = profile;
    }

    public Poster profile(Profile profile) {
        this.setProfile(profile);
        return this;
    }

    public Like getLike() {
        return this.like;
    }

    public void setLike(Like like) {
        if (this.like != null) {
            this.like.setPoster(null);
        }
        if (like != null) {
            like.setPoster(this);
        }
        this.like = like;
    }

    public Poster like(Like like) {
        this.setLike(like);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Poster)) {
            return false;
        }
        return id != null && id.equals(((Poster) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Poster{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", societyTag='" + getSocietyTag() + "'" +
            ", profilePicture='" + getProfilePicture() + "'" +
            ", profilePictureContentType='" + getProfilePictureContentType() + "'" +
            "}";
    }
}
