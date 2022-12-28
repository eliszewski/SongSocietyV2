package com.songsociety.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Lob;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.songsociety.domain.Poster} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PosterDTO implements Serializable {

    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String societyTag;

    @Lob
    private byte[] profilePicture;

    private String profilePictureContentType;
    private UserDTO user;

    private SpotifyAccountDTO spotifyAccount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSocietyTag() {
        return societyTag;
    }

    public void setSocietyTag(String societyTag) {
        this.societyTag = societyTag;
    }

    public byte[] getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getProfilePictureContentType() {
        return profilePictureContentType;
    }

    public void setProfilePictureContentType(String profilePictureContentType) {
        this.profilePictureContentType = profilePictureContentType;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public SpotifyAccountDTO getSpotifyAccount() {
        return spotifyAccount;
    }

    public void setSpotifyAccount(SpotifyAccountDTO spotifyAccount) {
        this.spotifyAccount = spotifyAccount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PosterDTO)) {
            return false;
        }

        PosterDTO posterDTO = (PosterDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, posterDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PosterDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", societyTag='" + getSocietyTag() + "'" +
            ", profilePicture='" + getProfilePicture() + "'" +
            ", user=" + getUser() +
            ", spotifyAccount=" + getSpotifyAccount() +
            "}";
    }
}
