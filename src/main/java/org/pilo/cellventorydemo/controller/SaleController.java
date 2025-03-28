package org.pilo.cellventorydemo.controller;

import jakarta.validation.Valid;
import org.pilo.cellventorydemo.entities.dtos.SaleDto;
import org.pilo.cellventorydemo.entities.dtos.SaleToSave;
import org.pilo.cellventorydemo.services.SaleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    public ResponseEntity<SaleDto> createSale(@Valid @RequestBody SaleToSave saleToSave) {
        SaleDto createdSale = saleService.save(saleToSave);
        return new ResponseEntity<>(createdSale, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SaleDto>> getAllSales() {
        List<SaleDto> sales = saleService.findAll();
        return new ResponseEntity<>(sales, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaleDto> getSaleById(@PathVariable Integer id) {
        SaleDto saleDto = saleService.findById(id);
        return new ResponseEntity<>(saleDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SaleDto> updateSale(@PathVariable Integer id,@Valid @RequestBody SaleToSave saleToSave) {
        SaleDto updatedSale = saleService.update(id,saleToSave);
        return new ResponseEntity<>(updatedSale, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Integer id) {
        saleService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
