package org.pilo.cellventorydemo.entities.dtos;

import jakarta.validation.constraints.*;

public record SaleDetailDto(
        Integer id,

        @NotNull(message = "El ID del producto es obligatorio.")
        ProductDto product,

        @NotNull(message = "La cantidad es obligatoria.")
        @Min(value = 1, message = "Debe haber al menos un producto en la venta.")
        Integer quantity,

        @NotNull(message = "El precio es obligatorio.")
        @Positive(message = "El precio debe ser mayor a 0.")
        Double price,

        @NotNull(message = "El precio es obligatorio.")
        @Positive(message = "El precio debe ser mayor a 0.")
        Double subTotal
) {}
