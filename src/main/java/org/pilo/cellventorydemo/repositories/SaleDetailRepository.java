package org.pilo.cellventorydemo.repositories;

import org.pilo.cellventorydemo.entities.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleDetailRepository extends JpaRepository<SaleDetail, Integer> {
    void deleteBySaleId(Integer id);

    List<SaleDetail> findBySaleId(Integer saleId);
}
