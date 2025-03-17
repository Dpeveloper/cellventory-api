package org.pilo.cellventorydemo.entities.dtos;

public record ProductDto(
        Integer id,
        String name,
        String category,
        String model,
        Double purchasePrice,
        Double salePrice,
        Integer stock,
        String description
) {}

