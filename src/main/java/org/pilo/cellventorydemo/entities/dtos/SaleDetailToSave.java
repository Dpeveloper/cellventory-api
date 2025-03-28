package org.pilo.cellventorydemo.entities.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SaleDetailToSave (
        Integer id,

        @NotNull(message = "El ID del producto es obligatorio.")
        Integer productId,

        @NotNull(message = "La cantidad es obligatoria.")
        @Min(value = 1, message = "Debe haber al menos un producto en la venta.")
        Integer quantity
){}

