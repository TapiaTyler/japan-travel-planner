package com.japantravelplanner.controller;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SpaControllerTest {

    private final SpaController controller = new SpaController();

    @Test
    void forwardsClientRoutesToReactEntryPoint() {
        assertThat(controller.forwardToIndex()).isEqualTo("forward:/index.html");
    }
}
