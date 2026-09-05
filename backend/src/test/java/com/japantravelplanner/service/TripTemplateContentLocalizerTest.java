package com.japantravelplanner.service;

import org.junit.jupiter.api.Test;
import org.springframework.context.support.ResourceBundleMessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TripTemplateContentLocalizerTest {

    private final TripTemplateContentLocalizer localizer = createLocalizer();

    @Test
    void returnsJapanesePublicTemplateContent() {
        assertEquals(
                "東京ハイライト",
                localizer.localize(
                        "tokyo-highlights", "name", "Tokyo Highlights", Locale.JAPANESE)
        );
    }

    @Test
    void fallsBackForPersonalOrUntranslatedContent() {
        assertEquals(
                "My Trip",
                localizer.localize(null, "name", "My Trip", Locale.JAPANESE)
        );
        assertEquals(
                "Tokyo Highlights",
                localizer.localize(
                        "tokyo-highlights", "name", "Tokyo Highlights", Locale.ENGLISH)
        );
    }

    private static TripTemplateContentLocalizer createLocalizer() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("messages");
        messageSource.setDefaultEncoding("UTF-8");
        return new TripTemplateContentLocalizer(messageSource);
    }
}
