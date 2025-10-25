package com.freteja;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.domain.Sort;
import com.freteja.model.User;
import com.freteja.model.Perfil;
import com.freteja.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Duration;
import java.time.Instant;
import java.util.Set;

@SpringBootApplication
public class FreteJaApplication {
    public static void main(String[] args) {
        SpringApplication.run(FreteJaApplication.class, args);
    }

    @Bean
    CommandLineRunner initIndexesAndSeeds(MongoTemplate mongo, UserRepository users) {
      return args -> {
        IndexOperations ops = mongo.indexOps("cotacoes");
        ops.ensureIndex(new Index().on("encerradaEm", Sort.Direction.ASC).expire(Duration.ofDays(365*5)));

        if (users.count() == 0) {
          BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
          // admin
          User admin = new User();
          admin.setEmail("admin@freteja.com");
          admin.setNome("Admin");
          admin.setSenhaHash(enc.encode("admin123"));
          admin.setPerfis(Set.of(Perfil.ADMIN));
          admin.setAtivo(true);
          admin.setCreatedAt(Instant.now());
          users.save(admin);

          // transportador
          User t = new User();
          t.setEmail("transportador@freteja.com");
          t.setNome("Transportador");
          t.setSenhaHash(enc.encode("transport123"));
          t.setPerfis(Set.of(Perfil.TRANSPORTADORA));
          t.setAtivo(true);
          t.setCreatedAt(Instant.now());
          users.save(t);

          // solicitante
          User s = new User();
          s.setEmail("solicitante@freteja.com");
          s.setNome("Solicitante");
          s.setSenhaHash(enc.encode("solicita123"));
          s.setPerfis(Set.of(Perfil.DEMANDANTE));
          s.setAtivo(true);
          s.setCreatedAt(Instant.now());
          users.save(s);
        }
      };
    }
}
