package com.japantravelplanner.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwards client-side routes to the bundled React application so direct links
 * and browser refreshes work in the production container.
 */
@Controller
public class SpaController {

    @GetMapping({
            "/",
            "/login",
            "/library",
            "/trips",
            "/trips/{tripId}",
            "/trips/{tripId}/{slug}",
            "/account"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
