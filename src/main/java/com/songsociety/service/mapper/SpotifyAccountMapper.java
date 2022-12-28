package com.songsociety.service.mapper;

import com.songsociety.domain.SpotifyAccount;
import com.songsociety.service.dto.SpotifyAccountDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link SpotifyAccount} and its DTO {@link SpotifyAccountDTO}.
 */
@Mapper(componentModel = "spring")
public interface SpotifyAccountMapper extends EntityMapper<SpotifyAccountDTO, SpotifyAccount> {}
