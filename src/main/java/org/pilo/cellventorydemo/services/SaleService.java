package org.pilo.cellventorydemo.services;

import org.pilo.cellventorydemo.entities.dtos.SaleDto;
import org.pilo.cellventorydemo.entities.dtos.SaleToSave;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SaleService {
    SaleDto save(SaleToSave saleToSave);
    List<SaleDto> findAll();

    SaleDto findById(Integer id);

    SaleDto update(Integer id, SaleToSave saleToSave);

    void deleteById(Integer id);
}
