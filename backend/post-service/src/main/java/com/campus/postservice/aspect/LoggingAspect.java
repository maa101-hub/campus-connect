package com.campus.postservice.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger log =
            LoggerFactory.getLogger(LoggingAspect.class);

    @Around(
        "execution(* com.campus.postservice.service..*(..)) || " +
        "execution(* com.campus.postservice.controller..*(..))"
    )
    public Object logApplicationMethods(
            ProceedingJoinPoint joinPoint) throws Throwable {

        String className =
                joinPoint.getSignature()
                        .getDeclaringType()
                        .getSimpleName();

        String methodName =
                joinPoint.getSignature().getName();

        String fullMethod = className + "." + methodName + "()";

        long startTime = System.currentTimeMillis();

        log.info("➡️ Entering: {}", fullMethod);

        try {

            Object result = joinPoint.proceed();

            long timeTaken =
                    System.currentTimeMillis() - startTime;

            log.info("⬅️ Exiting: {} | Time taken: {} ms",
                    fullMethod,
                    timeTaken);

            return result;

        } catch (Exception ex) {

            long timeTaken =
                    System.currentTimeMillis() - startTime;

            log.error("❌ Exception in: {} | Time taken: {} ms | Message: {}",
                    fullMethod,
                    timeTaken,
                    ex.getMessage());

            throw ex;
        }
    }
}