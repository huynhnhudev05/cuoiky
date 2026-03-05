package com.ecommerce.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dto.AdminUpdateUserRequest;
import com.ecommerce.dto.AdminUserResponse;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

    // ==========================
    // LIST ALL USERS
    // ==========================
    @GetMapping
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ==========================
    // UPDATE ROLE / ENABLED
    // ==========================
    @PutMapping("/{id}")
    public AdminUserResponse updateUser(
            @PathVariable Long id,
            @RequestBody AdminUpdateUserRequest req) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (req.getRole() != null && !req.getRole().isBlank()) {
            String role = req.getRole().toUpperCase();

            // Chuẩn hóa ROLE_
            if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }

            if (!role.equals("ROLE_USER") && !role.equals("ROLE_ADMIN")) {
                throw new RuntimeException("Role không hợp lệ. Chỉ chấp nhận USER hoặc ADMIN");
            }

            user.setRole(role);
        }

        if (req.getEnabled() != null) {
            user.setEnabled(req.getEnabled());
        }

        userRepository.save(user);

        return toDto(user);
    }

    private AdminUserResponse toDto(User u) {
        return AdminUserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole())
                .enabled(u.isEnabled())
                .build();
    }
}


