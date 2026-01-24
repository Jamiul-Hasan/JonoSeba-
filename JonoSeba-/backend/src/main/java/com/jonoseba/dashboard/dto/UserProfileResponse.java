package com.jonoseba.dashboard.dto;

import com.jonoseba.users.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String location;
    private String role;
    private LocalDateTime createdAt;

    public static UserProfileResponse fromUser(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .location(user.getAddress())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
