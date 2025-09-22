// repository/CotacaoRepository.java
package com.freteja.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.freteja.model.Cotacao;

public interface CotacaoRepository extends MongoRepository<Cotacao, String> {
  List<Cotacao> findBySolicitanteUserId(String userId);
}

