package org.pilo.cellventorydemo.controller;
import org.pilo.cellventorydemo.entities.dtos.SaleDetailDto;
import org.pilo.cellventorydemo.services.SaleDetailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sale-details")
public class SaleDetailController {

    private final SaleDetailService saleDetailService;

    public SaleDetailController(SaleDetailService saleDetailService) {
        this.saleDetailService = saleDetailService;
    }

    @PostMapping
    public ResponseEntity<SaleDetailDto> createSaleDetail(@RequestBody SaleDetailDto saleDetailDto) {
        SaleDetailDto createdSaleDetail = saleDetailService.save(saleDetailDto);
        return new ResponseEntity<>(createdSaleDetail, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SaleDetailDto>> getAllSaleDetails() {
        List<SaleDetailDto> saleDetails = saleDetailService.findAll();
        return new ResponseEntity<>(saleDetails, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaleDetailDto> getSaleDetailById(@PathVariable Integer id) {
        try {
            SaleDetailDto saleDetailDto = saleDetailService.findById(id);
            return new ResponseEntity<>(saleDetailDto, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSaleDetail(@PathVariable Integer id) {
        try {
            saleDetailService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
