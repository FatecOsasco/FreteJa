# --------- Build ---------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests clean package

# --------- Runtime ---------
FROM eclipse-temurin:21-jre
WORKDIR /app
ENV JAVA_OPTS=""
ENV SERVER_PORT=${SERVER_PORT}
COPY --from=build /app/target/*.jar /app/app.jar
EXPOSE 8080
HEALTHCHECK --interval=20s --timeout=3s --start-period=30s --retries=5 \
  CMD bash -c "exec 3<>/dev/tcp/127.0.0.1/8080 || exit 1"
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
