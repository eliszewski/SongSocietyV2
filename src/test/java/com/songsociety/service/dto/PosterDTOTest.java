package com.songsociety.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.songsociety.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PosterDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PosterDTO.class);
        PosterDTO posterDTO1 = new PosterDTO();
        posterDTO1.setId(1L);
        PosterDTO posterDTO2 = new PosterDTO();
        assertThat(posterDTO1).isNotEqualTo(posterDTO2);
        posterDTO2.setId(posterDTO1.getId());
        assertThat(posterDTO1).isEqualTo(posterDTO2);
        posterDTO2.setId(2L);
        assertThat(posterDTO1).isNotEqualTo(posterDTO2);
        posterDTO1.setId(null);
        assertThat(posterDTO1).isNotEqualTo(posterDTO2);
    }
}
