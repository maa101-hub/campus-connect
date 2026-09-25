package com.campus.userservice.service;

import static org.mockito.Mockito.mock;
import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.mail.javamail.JavaMailSender;

class EmailServiceTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withBean(JavaMailSender.class, () -> mock(JavaMailSender.class))
            .withBean(EmailService.class)
            .withPropertyValues("spring.mail.username=${MAIL_USERNAME}");

    @Test
    void contextLoadsWhenSpringMailUsernameReferencesMissingEnvVar() {
        contextRunner.run(context -> {
            assertThat(context).hasNotFailed();
            assertThat(context).hasSingleBean(EmailService.class);
        });
    }
}
