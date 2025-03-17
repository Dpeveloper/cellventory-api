package org.pilo.cellventorydemo.entities;

import jakarta.persistence.*;

@Entity
@Table(name ="SaleDetails")
public class SaleDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "sale_id")
    private Sale sale;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
}

