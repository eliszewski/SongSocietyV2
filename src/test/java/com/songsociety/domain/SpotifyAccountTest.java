package com.songsociety.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.songsociety.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SpotifyAccountTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SpotifyAccount.class);
        SpotifyAccount spotifyAccount1 = new SpotifyAccount();
        spotifyAccount1.setId(1L);
        SpotifyAccount spotifyAccount2 = new SpotifyAccount();
        spotifyAccount2.setId(spotifyAccount1.getId());
        assertThat(spotifyAccount1).isEqualTo(spotifyAccount2);
        spotifyAccount2.setId(2L);
        assertThat(spotifyAccount1).isNotEqualTo(spotifyAccount2);
        spotifyAccount1.setId(null);
        assertThat(spotifyAccount1).isNotEqualTo(spotifyAccount2);
    }
}
