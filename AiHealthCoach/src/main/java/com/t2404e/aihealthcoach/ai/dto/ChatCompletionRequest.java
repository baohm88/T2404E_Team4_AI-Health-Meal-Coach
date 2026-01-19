package com.t2404e.aihealthcoach.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ChatCompletionRequest {

    private String model;

    private List<ChatMessage> messages;

    private double temperature;

    @JsonProperty("max_tokens")
    private int maxTokens;
}
