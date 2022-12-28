package com.songsociety.service.mapper;

import com.songsociety.domain.Poster;
import com.songsociety.domain.Profile;
import com.songsociety.service.dto.PosterDTO;
import com.songsociety.service.dto.ProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Profile} and its DTO {@link ProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProfileMapper extends EntityMapper<ProfileDTO, Profile> {
    @Mapping(target = "poster", source = "poster", qualifiedByName = "posterId")
    ProfileDTO toDto(Profile s);

    @Named("posterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PosterDTO toDtoPosterId(Poster poster);
}
