package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;
import com.t2404e.aihealthcoach.dto.response.HealthProfileResponse;
import com.t2404e.aihealthcoach.entity.HealthProfile;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.repository.HealthProfileRepository;
import com.t2404e.aihealthcoach.repository.UserRepository;
import com.t2404e.aihealthcoach.service.HealthProfileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HealthProfileServiceImpl implements HealthProfileService {

    private final HealthProfileRepository healthProfileRepository;
    private final UserRepository userRepository;

    public HealthProfileServiceImpl(HealthProfileRepository healthProfileRepository,
                                    UserRepository userRepository) {
        this.healthProfileRepository = healthProfileRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create or update health profile for a user
     * - Validate user existence
     * - One user has exactly one health profile
     */
    @Override
    @Transactional
    public void saveOrUpdate(Long userId, HealthProfileRequest request) {

        // Ensure user exists (avoid orphan health profile)
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Find existing profile (if any)
        HealthProfile profile = healthProfileRepository.findById(userId)
                .orElse(
                        HealthProfile.builder()
                                .userId(userId)
                                .build()
                );

        // Map DTO -> Entity (no validation here, already done in DTO)
        profile.setGender(request.getGender());
        profile.setAge(request.getAge());
        profile.setHeight(request.getHeight());
        profile.setWeight(request.getWeight());
        profile.setGoal(request.getGoal());
        profile.setActivityLevel(request.getActivityLevel());
        profile.setStressLevel(request.getStressLevel());
        profile.setSleepDuration(request.getSleepDuration());

        healthProfileRepository.save(profile);
    }

    @Override
    public HealthProfileResponse getByUserId(Long userId) {

        HealthProfile profile = healthProfileRepository
                .findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Health profile not found"));

        return HealthProfileResponse.builder()
                .userId(profile.getUserId())
                .gender(profile.getGender())
                .age(profile.getAge())
                .height(profile.getHeight())
                .weight(profile.getWeight())
                .goal(profile.getGoal())
                .activityLevel(profile.getActivityLevel())
                .stressLevel(profile.getStressLevel())
                .sleepDuration(profile.getSleepDuration())
                .build();
    }


}
