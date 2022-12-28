package com.songsociety.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SpotifyAccountMapperTest {

    private SpotifyAccountMapper spotifyAccountMapper;

    @BeforeEach
    public void setUp() {
        spotifyAccountMapper = new SpotifyAccountMapperImpl();
    }
}
