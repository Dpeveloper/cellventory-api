package org.pilo.cellventorydemo.repositories;

import org.pilo.cellventorydemo.entities.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Integer> {
}
