package com.songsociety.service.mapper;

import com.songsociety.domain.Post;
import com.songsociety.domain.Poster;
import com.songsociety.domain.Reply;
import com.songsociety.service.dto.PostDTO;
import com.songsociety.service.dto.PosterDTO;
import com.songsociety.service.dto.ReplyDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Reply} and its DTO {@link ReplyDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReplyMapper extends EntityMapper<ReplyDTO, Reply> {
    @Mapping(target = "author", source = "author", qualifiedByName = "posterId")
    @Mapping(target = "post", source = "post", qualifiedByName = "postId")
    ReplyDTO toDto(Reply s);

    @Named("posterId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PosterDTO toDtoPosterId(Poster poster);

    @Named("postId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PostDTO toDtoPostId(Post post);
}
