package org.pilo.cellventorydemo.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id;
    private String name;
    private String category;
    private String model;
    private Double purchasePrice;
    private Double salePrice;
    private Integer stock;
    private String description;
}
