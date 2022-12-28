package com.songsociety.service.mapper;

import com.songsociety.domain.Poster;
import com.songsociety.domain.SpotifyAccount;
import com.songsociety.domain.User;
import com.songsociety.service.dto.PosterDTO;
import com.songsociety.service.dto.SpotifyAccountDTO;
import com.songsociety.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Poster} and its DTO {@link PosterDTO}.
 */
@Mapper(componentModel = "spring")
public interface PosterMapper extends EntityMapper<PosterDTO, Poster> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    @Mapping(target = "spotifyAccount", source = "spotifyAccount", qualifiedByName = "spotifyAccountId")
    PosterDTO toDto(Poster s);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("spotifyAccountId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    SpotifyAccountDTO toDtoSpotifyAccountId(SpotifyAccount spotifyAccount);
}
