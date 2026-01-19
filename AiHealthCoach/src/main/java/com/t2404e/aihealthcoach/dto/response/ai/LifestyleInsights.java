package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LifestyleInsights {

    private String activity;
    private String sleep;
    private String stress;
}
