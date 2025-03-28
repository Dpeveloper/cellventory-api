package org.pilo.cellventorydemo.entities.dtos;

import jakarta.validation.constraints.*;

public record ProductDto(
        Integer id,

        @NotBlank(message = "El nombre es obligatorio")
        String name,

        @NotBlank(message = "La categoría es obligatoria")
        String category,

        String model,

        @NotNull(message = "El precio de compra es obligatorio")
        @Positive(message = "El precio de compra debe ser mayor a 0")
        Double purchasePrice,

        @Positive(message = "El precio de venta debe ser mayor a 0")
        Double salePrice,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock no puede ser negativo")
        Integer stock,

        String description
) {}


