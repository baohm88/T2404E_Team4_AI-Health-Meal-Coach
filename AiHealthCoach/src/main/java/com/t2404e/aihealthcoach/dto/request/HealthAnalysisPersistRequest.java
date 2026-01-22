package com.t2404e.aihealthcoach.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HealthAnalysisPersistRequest {

    @NotBlank
    private String analysisJson;
}
