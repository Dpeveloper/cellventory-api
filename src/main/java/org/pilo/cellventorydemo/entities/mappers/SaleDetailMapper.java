package org.pilo.cellventorydemo.entities.mappers;

import org.mapstruct.Mapper;
import org.pilo.cellventorydemo.entities.SaleDetail;
import org.pilo.cellventorydemo.entities.dtos.SaleDetailDto;

@Mapper(componentModel = "spring")
public interface SaleDetailMapper {
    SaleDetail toEntity(SaleDetailDto saleDto);
    SaleDetailDto toDto(SaleDetail saleDetail);
}
