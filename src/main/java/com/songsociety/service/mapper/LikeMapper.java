package com.songsociety.service.mapper;

import com.songsociety.domain.Like;
import com.songsociety.domain.Post;
import com.songsociety.domain.Poster;
import com.songsociety.service.dto.LikeDTO;
import com.songsociety.service.dto.PostDTO;
import com.songsociety.service.dto.PosterDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Like} and its DTO {@link LikeDTO}.
 */
@Mapper(componentModel = "spring")
public interface LikeMapper extends EntityMapper<LikeDTO, Like> {
    @Mapping(target = "poster", source = "poster", qualifiedByName = "posterId")
    @Mapping(target = "post", source = "post", qualifiedByName = "postId")
    LikeDTO toDto(Like s);

    @Named("posterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PosterDTO toDtoPosterId(Poster poster);

    @Named("postId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PostDTO toDtoPostId(Post post);
}
