package org.pilo.cellventorydemo.entities.dtos;

public record SaleDetailDto(
        Integer id,
        SaleDto sale,
        ProductDto product,
        Integer quantity
) {
}
