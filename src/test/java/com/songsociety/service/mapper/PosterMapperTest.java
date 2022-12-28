package com.songsociety.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PosterMapperTest {

    private PosterMapper posterMapper;

    @BeforeEach
    public void setUp() {
        posterMapper = new PosterMapperImpl();
    }
}
