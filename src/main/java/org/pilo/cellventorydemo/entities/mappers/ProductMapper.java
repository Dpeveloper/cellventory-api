package org.pilo.cellventorydemo.entities.mappers;

import org.mapstruct.Mapper;
import org.pilo.cellventorydemo.entities.Product;
import org.pilo.cellventorydemo.entities.dtos.ProductDto;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDto toDto(Product product);
    Product toEntity(ProductDto productDto);
}

