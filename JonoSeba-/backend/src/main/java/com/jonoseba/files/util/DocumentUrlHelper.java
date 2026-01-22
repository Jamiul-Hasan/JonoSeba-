package com.jonoseba.files.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DocumentUrlHelper {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Convert a list of document URLs to JSON string
     */
    public static String toJsonString(List<String> urls) {
        if (urls == null || urls.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(urls);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting URLs to JSON", e);
        }
    }

    /**
     * Convert JSON string to list of document URLs
     */
    public static List<String> fromJsonString(String jsonString) {
        if (jsonString == null || jsonString.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            String[] urls = objectMapper.readValue(jsonString, String[].class);
            return Arrays.asList(urls);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON to URLs", e);
        }
    }

    /**
     * Add a single URL to existing document URLs JSON
     */
    public static String addUrl(String existingJson, String newUrl) {
        List<String> urls = fromJsonString(existingJson);
        urls.add(newUrl);
        return toJsonString(urls);
    }

    /**
     * Remove a URL from document URLs JSON
     */
    public static String removeUrl(String existingJson, String urlToRemove) {
        List<String> urls = fromJsonString(existingJson);
        urls.remove(urlToRemove);
        return urls.isEmpty() ? null : toJsonString(urls);
    }
}
