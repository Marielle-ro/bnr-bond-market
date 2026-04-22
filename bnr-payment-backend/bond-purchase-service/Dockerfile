FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Use a wildcard to be safe with versioning
COPY target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]