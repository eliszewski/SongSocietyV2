package com.songsociety.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.songsociety.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SpotifyAccountDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SpotifyAccountDTO.class);
        SpotifyAccountDTO spotifyAccountDTO1 = new SpotifyAccountDTO();
        spotifyAccountDTO1.setId(1L);
        SpotifyAccountDTO spotifyAccountDTO2 = new SpotifyAccountDTO();
        assertThat(spotifyAccountDTO1).isNotEqualTo(spotifyAccountDTO2);
        spotifyAccountDTO2.setId(spotifyAccountDTO1.getId());
        assertThat(spotifyAccountDTO1).isEqualTo(spotifyAccountDTO2);
        spotifyAccountDTO2.setId(2L);
        assertThat(spotifyAccountDTO1).isNotEqualTo(spotifyAccountDTO2);
        spotifyAccountDTO1.setId(null);
        assertThat(spotifyAccountDTO1).isNotEqualTo(spotifyAccountDTO2);
    }
}
