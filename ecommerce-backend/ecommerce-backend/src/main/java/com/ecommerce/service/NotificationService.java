package com.ecommerce.service;

import com.ecommerce.config.NotificationConfig;
import com.ecommerce.model.Notification;
import com.ecommerce.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;
    private final NotificationConfig config;

    // ===========================
    // Gửi email
    // ===========================
    public void sendEmail(String to, String subject, String text) {

        if (!config.isEmailEnabled()) {
            System.out.println("❌ ADMIN đã tắt chức năng gửi Email");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            System.out.println("📩 Email đã gửi: " + to);

        } catch (Exception e) {
            System.out.println("❌ Lỗi gửi email: " + e.getMessage());
        }
    }

    // ===========================
    // Gửi thông báo in-app
    // ===========================
    public void sendInApp(Long userId, String title, String message) {

        if (!config.isInappEnabled()) {
            System.out.println("❌ ADMIN đã tắt thông báo in-app");
            return;
        }

        Notification n = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .seen(false)
                .build();

        notificationRepository.save(n);
    }
}
