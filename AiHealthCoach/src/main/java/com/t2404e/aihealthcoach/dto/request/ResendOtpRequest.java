package com.t2404e.aihealthcoach.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResendOtpRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;
}
