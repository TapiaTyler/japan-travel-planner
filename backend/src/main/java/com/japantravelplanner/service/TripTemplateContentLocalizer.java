package com.japantravelplanner.service;

import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class TripTemplateContentLocalizer {

    private final MessageSource messageSource;

    public TripTemplateContentLocalizer(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public String localize(String localizationKey, String field, String fallback, Locale locale) {
        if (localizationKey == null || localizationKey.isBlank() || fallback == null) {
            return fallback;
        }

        return messageSource.getMessage(
                "templates." + localizationKey + "." + field,
                null,
                fallback,
                locale
        );
    }
}
