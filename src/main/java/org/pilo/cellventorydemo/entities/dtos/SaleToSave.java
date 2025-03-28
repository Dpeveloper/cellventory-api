package org.pilo.cellventorydemo.entities.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public record SaleToSave (
        @NotBlank(message = "El nombre del cliente es obligatorio.")
        @Size(min = 3, max = 50, message = "El nombre del cliente debe tener entre 3 y 50 caracteres.")
        String clientName,

        @NotBlank(message = "El estado de la venta es obligatorio.")
        @Pattern(regexp = "PENDIENTE|COMPLETADO", message = "El estado debe ser PENDIENTE O COMPLETADO.")
        String status,

        @NotEmpty(message = "Debe haber al menos un producto en la venta.")
        List<@Valid SaleDetailToSave> saleDetailList
) {}
