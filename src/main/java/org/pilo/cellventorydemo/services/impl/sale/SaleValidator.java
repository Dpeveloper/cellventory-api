package org.pilo.cellventorydemo.services.impl.sale;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.pilo.cellventorydemo.entities.Product;
import org.pilo.cellventorydemo.entities.Sale;
import org.pilo.cellventorydemo.entities.SaleDetail;
import org.pilo.cellventorydemo.entities.dtos.SaleDetailToSave;
import org.pilo.cellventorydemo.repositories.ProductRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SaleValidator {

    private final ProductRepository productRepository;

    /**
     * Valida que todos los productos de la venta existan.
     */
    public List<Product> validateProductsExist(List<Integer> productIds) {
        List<Product> products = productRepository.findAllById(productIds);

        if (products.size() != productIds.size()) {
            throw new EntityNotFoundException("Uno o más productos no existen.");
        }
        return products;
    }

    /**
     * Valida que la lista de detalles no esté vacía.
     */
    public void validateSaleDetails(List<SaleDetail> saleDetails) {
        if (saleDetails.isEmpty()) {
            throw new RuntimeException("Deben existir productos.");
        }
    }

    /**
     * Valida el stock disponible y lo actualiza en la base de datos.
     */
    public void validateAndUpdateStock(List<SaleDetail> saleDetails, Map<Integer, Product> productMap) {
        double subtotal;
        for (SaleDetail detail : saleDetails) {
            Product product = productMap.get(detail.getProduct().getId());

            if (product.getStock() < detail.getQuantity()) {
                throw new IllegalArgumentException("Stock insuficiente para el producto: " + product.getName());
            }

            detail.setProduct(product);
            detail.setPrice(product.getSalePrice());

            subtotal = detail.getQuantity() * product.getSalePrice();

            // Reducir el stock
            if (detail.getQuantity() < 0)
                product.setStock(product.getStock() + detail.getQuantity());
            else
                product.setStock(product.getStock() - detail.getQuantity());

            detail.setSubTotal(subtotal);
            productRepository.save(product);
        }
    }

    /**
     * Valida y actualiza el stock correctamente durante una actualización de venta.
     */
    public void validateAndUpdateStock(Sale sale, Map<Integer, SaleDetailToSave> newDetailsMap) {
        // Mapear productos existentes
        Map<Integer, Product> productMap = sale.getSaleDetailList().stream()
                .map(SaleDetail::getProduct)
                .collect(Collectors.toMap(Product::getId, p -> p));

        for (SaleDetail oldDetail : sale.getSaleDetailList()) {
            int productId = oldDetail.getProduct().getId();
            Product product = productMap.get(productId);

            // Obtener el nuevo detalle o asumir cantidad 0 si se eliminó
            int newQuantity = newDetailsMap.containsKey(oldDetail.getId())
                    ? newDetailsMap.get(oldDetail.getId()).quantity()
                    : 0;

            int oldQuantity = oldDetail.getQuantity();
            int quantityChange = newQuantity - oldQuantity;

            // Si la cantidad aumentó, validar que haya stock disponible
            if (quantityChange > 0 && product.getStock() < quantityChange) {
                throw new IllegalArgumentException("Stock insuficiente para el producto: " + product.getName());
            }

            // Actualizar stock
            product.setStock(product.getStock() - quantityChange);
            productRepository.save(product);

            // Actualizar la cantidad en el detalle
            oldDetail.setQuantity(newQuantity);
        }
    }
}

