// repository/PropostaRepository.java
package com.freteja.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.freteja.model.Proposta;

public interface PropostaRepository extends MongoRepository<Proposta, String> {
  List<Proposta> findByCotacaoId(String cotacaoId);
}

