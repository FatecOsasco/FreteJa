package com.freteja;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

@SpringBootApplication

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import com.freteja.model.User;
import com.freteja.model.Perfil;
import com.freteja.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.time.Duration;
import java.util.Set;


public class FreteJaApplication {
    public static void main(String[] args) {
        SpringApplication.run(FreteJaApplication.class, args);
    
    @Bean
    CommandLineRunner initIndexesAndSeeds(MongoTemplate mongo, UserRepository users) {
      return args -> {
        IndexOperations ops = mongo.indexOps("cotacoes");
        // TTL of ~5 years on 'encerradaEm' (only applies when this field is non-null)
        ops.ensureIndex(new Index().on("encerradaEm", org.springframework.data.domain.Sort.Direction.ASC)
          .expire(Duration.ofDays(365*5)));

        // Seed users if empty
        if (users.count() == 0) {
          BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
          users.save(new User(null, "admin@freteja.com", "Admin", enc.encode("admin123"), Set.of(Perfil.ADMIN), true, null, java.time.Instant.now()));
          users.save(new User(null, "transportador@freteja.com", "Transportador", enc.encode("transport123"), Set.of(Perfil.TRANSPORTADOR), true, null, java.time.Instant.now()));
          users.save(new User(null, "solicitante@freteja.com", "Solicitante", enc.encode("solicita123"), Set.of(Perfil.SOLICITANTE), true, null, java.time.Instant.now()));
        }
      };
    }
}

    @Bean
    CommandLineRunner initIndexesAndSeeds(MongoTemplate mongo, UserRepository users) {
      return args -> {
        IndexOperations ops = mongo.indexOps("cotacoes");
        // TTL of ~5 years on 'encerradaEm' (only applies when this field is non-null)
        ops.ensureIndex(new Index().on("encerradaEm", org.springframework.data.domain.Sort.Direction.ASC)
          .expire(Duration.ofDays(365*5)));

        // Seed users if empty
        if (users.count() == 0) {
          BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
          users.save(new User(null, "admin@freteja.com", "Admin", enc.encode("admin123"), Set.of(Perfil.ADMIN), true, null, java.time.Instant.now()));
          users.save(new User(null, "transportador@freteja.com", "Transportador", enc.encode("transport123"), Set.of(Perfil.TRANSPORTADOR), true, null, java.time.Instant.now()));
          users.save(new User(null, "solicitante@freteja.com", "Solicitante", enc.encode("solicita123"), Set.of(Perfil.SOLICITANTE), true, null, java.time.Instant.now()));
        }
      };
    }
}
