package com.t2404e.aihealthcoach.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.t2404e.aihealthcoach.entity.User;
import com.t2404e.aihealthcoach.enums.UserRole;
import com.t2404e.aihealthcoach.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@aihealth.com").isPresent()) {
            return;
        }

        User admin = User.builder()
                .fullName("System Admin")
                .email("admin@aihealth.com")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(UserRole.ADMIN)
                .status(1)
                .isPremium(true)
                .build();

        userRepository.save(admin);
        System.out.println("✅ Admin account seeded: admin@aihealth.com / Admin@123");
    }
}
