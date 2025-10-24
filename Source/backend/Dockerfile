# Stage build
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Chỉ copy thư mục backend
COPY Source/backend /app

RUN mvn -f /app/pom.xml clean package -DskipTests

# Stage run
FROM eclipse-temurin:17-jdk
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
