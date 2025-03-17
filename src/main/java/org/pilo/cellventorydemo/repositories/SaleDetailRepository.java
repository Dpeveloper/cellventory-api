package org.pilo.cellventorydemo.repositories;

import org.pilo.cellventorydemo.entities.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleDetailRepository extends JpaRepository<SaleDetail, Integer> {
}
