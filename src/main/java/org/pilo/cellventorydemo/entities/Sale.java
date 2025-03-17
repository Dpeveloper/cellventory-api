package org.pilo.cellventorydemo.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id;
    private LocalDateTime dateOfSale;
    @OneToMany
    private List<Product> products;
    private String Client;
    private Double total;

}
