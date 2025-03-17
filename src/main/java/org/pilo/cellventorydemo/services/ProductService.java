package org.pilo.cellventorydemo.services;

import org.pilo.cellventorydemo.entities.dtos.ProductDto;

import java.util.List;

public interface ProductService {
    List<ProductDto> findAll();
    List<ProductDto> findByName(String name);
    ProductDto save(ProductDto productDto);
    ProductDto update(Integer id, ProductDto productDto);
    void delete(Integer id);
    ProductDto findById(Integer id);
}
