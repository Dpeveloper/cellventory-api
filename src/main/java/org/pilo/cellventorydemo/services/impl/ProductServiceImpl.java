package org.pilo.cellventorydemo.services.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.pilo.cellventorydemo.entities.Product;
import org.pilo.cellventorydemo.entities.dtos.ProductDto;
import org.pilo.cellventorydemo.entities.mappers.ProductMapper;
import org.pilo.cellventorydemo.repositories.ProductRepository;
import org.pilo.cellventorydemo.services.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public List<ProductDto> findAll() {
        return productRepository.findAll().stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> findByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto save(ProductDto productDto) {
        if (productDto.id() != null) {
            throw new IllegalArgumentException("No se debe pasar un ID al guardar un nuevo producto.");
        }

        Product product = productMapper.toEntity(productDto);

        if(productDto.salePrice() == null) {
            product.setSalePrice(productDto.purchasePrice() + productDto.purchasePrice() * 0.20);
        }

        return productMapper.toDto(productRepository.save(product));
   }

    @Override
    public ProductDto update(Integer id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + id));

        product.setName(productDto.name());
        product.setCategory(productDto.category());
        product.setModel(productDto.model());
        product.setPurchasePrice(productDto.purchasePrice());
        product.setSalePrice(productDto.salePrice());
        product.setStock(productDto.stock());
        product.setDescription(productDto.description());

        return productMapper.toDto(productRepository.save(product));
    }

    @Override
    public void delete(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Producto no encontrado con ID: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public ProductDto findById(Integer id) {
        return productRepository.findById(id)
                .map(productMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + id));
    }
}
