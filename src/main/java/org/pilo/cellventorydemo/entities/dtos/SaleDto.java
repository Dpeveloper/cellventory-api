package org.pilo.cellventorydemo.entities.dtos;

import java.time.LocalDateTime;
import java.util.List;

public record SaleDto(
        Integer id,
        LocalDateTime dateOfSale,
        List<ProductDto> products,
        String client,
        Double total
) {
}
