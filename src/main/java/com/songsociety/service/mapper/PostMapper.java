package com.songsociety.service.mapper;

import com.songsociety.domain.Post;
import com.songsociety.domain.Poster;
import com.songsociety.service.dto.PostDTO;
import com.songsociety.service.dto.PosterDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Post} and its DTO {@link PostDTO}.
 */
@Mapper(componentModel = "spring")
public interface PostMapper extends EntityMapper<PostDTO, Post> {
    @Mapping(target = "postAuthor", source = "postAuthor", qualifiedByName = "posterId")
    PostDTO toDto(Post s);

    @Named("posterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PosterDTO toDtoPosterId(Poster poster);
}
