package com.arunabhdas.datasciencestack.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.arunabhdas.datasciencestack.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ScientistTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Scientist.class);
        Scientist scientist1 = new Scientist();
        scientist1.setId(1L);
        Scientist scientist2 = new Scientist();
        scientist2.setId(scientist1.getId());
        assertThat(scientist1).isEqualTo(scientist2);
        scientist2.setId(2L);
        assertThat(scientist1).isNotEqualTo(scientist2);
        scientist1.setId(null);
        assertThat(scientist1).isNotEqualTo(scientist2);
    }
}
