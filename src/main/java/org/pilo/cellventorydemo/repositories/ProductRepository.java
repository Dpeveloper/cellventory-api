package org.pilo.cellventorydemo.repositories;

import org.pilo.cellventorydemo.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository  extends JpaRepository<Product, Integer> {
    List<Product> findByNameContainingIgnoreCase(String name);
}
