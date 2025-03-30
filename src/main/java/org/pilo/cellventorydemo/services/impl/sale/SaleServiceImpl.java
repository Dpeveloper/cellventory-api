package org.pilo.cellventorydemo.services.impl.sale;

import jakarta.transaction.Transactional;
import org.pilo.cellventorydemo.entities.Product;
import org.pilo.cellventorydemo.entities.Sale;
import org.pilo.cellventorydemo.entities.SaleDetail;
import org.pilo.cellventorydemo.entities.dtos.*;
import org.pilo.cellventorydemo.entities.mappers.SaleDetailMapper;
import org.pilo.cellventorydemo.entities.mappers.SaleMapper;
import org.pilo.cellventorydemo.repositories.ProductRepository;
import org.pilo.cellventorydemo.repositories.SaleRepository;
import org.pilo.cellventorydemo.services.SaleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final SaleMapper saleMapper;
    private final SaleValidator saleValidator;
    private final SaleDetailMapper saleDetailMapper;

    public SaleServiceImpl(SaleRepository saleRepository, SaleMapper saleMapper, SaleValidator saleValidator, SaleDetailMapper saleDetailMapper) {
        this.saleRepository = saleRepository;
        this.saleMapper = saleMapper;
        this.saleValidator = saleValidator;
        this.saleDetailMapper = saleDetailMapper;
    }

    @Override
    @Transactional
    public SaleDto save(SaleToSave saleToSave) {

        // Obtener los IDs de los productos en la venta
        List<Integer> productIds = saleToSave.saleDetailList().stream()
                .map(SaleDetailToSave::productId)
                .toList();

        // Validar productos existentes
        List<Product> products = saleValidator.validateProductsExist(productIds);

        // Convertir DTO a entidad Sale
        Sale sale = saleMapper.saveToEntity(saleToSave);

        // Validar que la venta tenga detalles
        saleValidator.validateSaleDetails(sale.getSaleDetailList());

        // Mapa de productos por ID
        Map<Integer, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        // Validar stock y actualizarlo
        saleValidator.validateAndUpdateStock(sale.getSaleDetailList(), productMap);

        double total = sale.getSaleDetailList().stream()
                .mapToDouble(SaleDetail::getSubTotal)
                .sum();
        sale.setTotal(total);

        // Guardar la venta
        Sale savedSale = saleRepository.save(sale);

        savedSale.getSaleDetailList().stream().forEach(saleDetail -> saleDetail.setSale(savedSale));
        // Retornar DTO
        return saleMapper.toSaleDto(savedSale);
    }

    @Override
    public List<SaleDto> findAll() {
        return saleRepository.findAll().stream()
                .map(saleMapper::toSaleDto)
                .toList();
    }

    @Override
    public SaleDto findById(Integer id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada."));
        return saleMapper.toSaleDto(sale);
    }

    @Override
    public SaleDto update(Integer id, SaleToSave saleToSave) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada."));

        Sale saleToSaveEntitie = saleMapper.saveToEntity(saleToSave);

        boolean detailsEquals = sale.getSaleDetailList().stream()
                .map(saleDetail -> saleDetail.getProduct().getId()) // Obtener IDs de productos actuales
                .collect(Collectors.toSet()) // Convertir a conjunto para comparación rápida
                .equals(
                        saleToSave.saleDetailList().stream()
                                .map(SaleDetailToSave::productId) // Obtener IDs de productos nuevos
                                .collect(Collectors.toSet())
                );

        if (!detailsEquals) {
            throw new IllegalArgumentException("Los detalles de venta han cambiado. No se permite modificar los productos.");
        }

        saleValidator.validateSaleDetails(saleToSaveEntitie.getSaleDetailList());

        // Mapear los nuevos detalles de venta
        Map<Integer, SaleDetailToSave> newDetailsMap = saleToSave.saleDetailList().stream()
                .collect(Collectors.toMap(SaleDetailToSave::id, Function.identity()));

        // Validar y actualizar stock
        saleValidator.validateAndUpdateStock(sale, newDetailsMap);

        double total = sale.getSaleDetailList().stream()
                .mapToDouble(SaleDetail::getSubTotal).sum();

        sale.setClientName(saleToSave.clientName());
        sale.setStatus(saleToSave.status());
        sale.setTotal(total);
        return saleMapper.toSaleDto(saleRepository.save(sale));
    }

    @Override
    public SaleDto addDetails(Integer saleId, SaleDetailToSave saleDetailToSave) {
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada."));

        SaleDetail saleDetail = saleDetailMapper.saveToEntity(saleDetailToSave);

        saleValidator.addSaleDetailValidator(sale, saleDetail);

        return saleMapper.toSaleDto(saleRepository.save(sale));
    }
}
