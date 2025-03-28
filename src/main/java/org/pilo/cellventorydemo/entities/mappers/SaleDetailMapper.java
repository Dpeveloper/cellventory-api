package org.pilo.cellventorydemo.entities.mappers;

import org.pilo.cellventorydemo.entities.Product;
import org.pilo.cellventorydemo.entities.SaleDetail;
import org.pilo.cellventorydemo.entities.dtos.SaleDetailDto;
import org.pilo.cellventorydemo.entities.dtos.SaleDetailToSave;
import org.springframework.stereotype.Component;

@Component
public class SaleDetailMapper {

    private final ProductMapper productMapper;

    public SaleDetailMapper(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }

    public SaleDetail ToSaleDetail(SaleDetailDto saleDetailDto) {
        SaleDetail saleDetail = new SaleDetail();

        saleDetail.setId( saleDetailDto.id() );
        saleDetail.setQuantity(saleDetailDto.quantity());
        saleDetail.setPrice( saleDetailDto.price() );
        saleDetail.setSubTotal( saleDetailDto.quantity() * saleDetailDto.price() );
        return saleDetail;
    }

    public SaleDetailDto toDto(SaleDetail saleDetail) {
        return new SaleDetailDto(
                saleDetail.getId(),
                productMapper.toDto( saleDetail.getProduct() ),
                saleDetail.getQuantity(),
                saleDetail.getPrice(),
                saleDetail.getSubTotal()
        );
    }

    public SaleDetail saveToEntity(SaleDetailToSave saleDetailToSave) {
        SaleDetail saleDetail = new SaleDetail();
        saleDetail.setProduct(new Product(saleDetailToSave.productId()));
        saleDetail.setQuantity(saleDetailToSave.quantity());
        return saleDetail;
    }
}
