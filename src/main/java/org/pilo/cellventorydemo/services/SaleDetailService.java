package org.pilo.cellventorydemo.services;

import org.pilo.cellventorydemo.entities.dtos.SaleDetailDto;

import java.util.List;

public interface SaleDetailService {
    List<SaleDetailDto> findAll();
    SaleDetailDto findById(Integer id);
    void deleteById(Integer id);
    List<SaleDetailDto> findBySaleId(Integer id);
}
