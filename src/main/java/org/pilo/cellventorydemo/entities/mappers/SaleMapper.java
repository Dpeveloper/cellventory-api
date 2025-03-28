package org.pilo.cellventorydemo.entities.mappers;

import org.pilo.cellventorydemo.entities.Sale;
import org.pilo.cellventorydemo.entities.SaleDetail;
import org.pilo.cellventorydemo.entities.dtos.SaleDto;
import org.pilo.cellventorydemo.entities.dtos.SaleToSave;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SaleMapper {

    private final SaleDetailMapper saleDetailMapper;

    public SaleMapper(SaleDetailMapper saleDetailMapper) {
        this.saleDetailMapper = saleDetailMapper;
    }

    public Sale saveToEntity(SaleToSave dto) {
        Sale sale = new Sale();
        sale.setSaleDate(LocalDateTime.now());
        sale.setClientName(dto.clientName());
        sale.setStatus(dto.status());

        List<SaleDetail> details = dto.saleDetailList().stream()
                .map(saleDetailMapper::saveToEntity)
                .collect(Collectors.toList());

        sale.setSaleDetailList(details);

        double total = details.stream()
                .mapToDouble(SaleDetail::getSubTotal)
                .sum();
        sale.setTotal(total);

        return sale;
    }

    public SaleDto toSaleDto(Sale sale) {
        return new SaleDto(
                sale.getId(),
                sale.getSaleDate(),
                sale.getClientName(),
                sale.getTotal(),
                sale.getStatus(),
                sale.getSaleDetailList().stream()
                        .map(saleDetailMapper::toDto)
                        .collect(Collectors.toList())
        );
    }
}
