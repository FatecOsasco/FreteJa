# --------- Build ---------
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -e -B -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -e -B -DskipTests clean package

# --------- Runtime ---------
FROM eclipse-temurin:21-jre
ENV JAVA_OPTS=""
WORKDIR /app
COPY --from=build /app/target/freteja-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]

