package com.songsociety.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.songsociety.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PosterTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Poster.class);
        Poster poster1 = new Poster();
        poster1.setId(1L);
        Poster poster2 = new Poster();
        poster2.setId(poster1.getId());
        assertThat(poster1).isEqualTo(poster2);
        poster2.setId(2L);
        assertThat(poster1).isNotEqualTo(poster2);
        poster1.setId(null);
        assertThat(poster1).isNotEqualTo(poster2);
    }
}
